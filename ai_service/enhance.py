import cv2
import os
import sys
import subprocess
import argparse
import imageio_ffmpeg

FFMPEG_CMD = imageio_ffmpeg.get_ffmpeg_exe()

# Attempt to import PyTorch and AI models
try:
    import torch
    from realesrgan import RealESRGANer
    from basicsr.archs.rrdbnet_arch import RRDBNet
    from gfpgan import GFPGANer
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False
    print("WARNING: AI modules (torch, realesrgan, gfpgan) not found.")
    print("Falling back to standard OpenCV enhancement (Bicubic Upscaling) for testing purposes.")

def get_models(model_dir):
    """Initialize Real-ESRGAN and GFPGAN models"""
    # 1. Initialize Real-ESRGAN
    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
    model_path = os.path.join(model_dir, 'RealESRGAN_x4plus.pth')
    
    upsampler = None
    if os.path.exists(model_path):
        upsampler = RealESRGANer(
            scale=4,
            model_path=model_path,
            model=model,
            tile=0,
            tile_pad=10,
            pre_pad=0,
            half=True if torch.cuda.is_available() else False
        )
    else:
        print(f"WARNING: Real-ESRGAN model not found at {model_path}")

    # 2. Initialize GFPGAN for face restoration
    gfpgan_path = os.path.join(model_dir, 'GFPGANv1.4.pth')
    face_enhancer = None
    if os.path.exists(gfpgan_path):
        face_enhancer = GFPGANer(
            model_path=gfpgan_path,
            upscale=4,
            arch='clean',
            channel_multiplier=2,
            bg_upsampler=upsampler
        )
    else:
        print(f"WARNING: GFPGAN model not found at {gfpgan_path}")

    return upsampler, face_enhancer

def extract_audio(input_video, output_audio):
    """Extract audio from the input video using ffmpeg"""
    try:
        command = [
            FFMPEG_CMD, '-y', '-i', input_video, '-vn', '-acodec', 'copy', output_audio
        ]
        subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except FileNotFoundError:
        print("ERROR: ffmpeg not found in PATH. Audio extraction skipped.")
        return False
    except subprocess.CalledProcessError:
        print("Audio extraction failed (Video might not have audio).")
        return False

def merge_audio(input_video, input_audio, output_video):
    """Merge processed video with original audio"""
    try:
        command = [
            FFMPEG_CMD, '-y', '-i', input_video, '-i', input_audio, 
            '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0?', output_video
        ]
        subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except Exception as e:
        print(f"Audio merge failed: {e}")
        return False

def process_video(input_path, output_path, quality="standard"):
    print(f"Starting processing for: {input_path} with quality: {quality}")
    
    model_dir = os.path.join(os.path.dirname(__file__), 'models')
    upsampler, face_enhancer = None, None
    if AI_AVAILABLE:
        upsampler, face_enhancer = get_models(model_dir)

    # Prepare temp files
    temp_dir = os.path.join(os.path.dirname(output_path), 'temp_processing')
    os.makedirs(temp_dir, exist_ok=True)
    temp_video_no_audio = os.path.join(temp_dir, 'temp_no_audio.mp4')
    audio_path = os.path.join(temp_dir, 'audio.aac')

    has_audio = extract_audio(input_path, audio_path)

    # Setup OpenCV Video Capture
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print(f"Error opening video stream or file: {input_path}")
        return

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Determine settings based on quality
    if quality == "fast":
        scale = 2
        interpolation = cv2.INTER_LINEAR
        use_ai = False
    elif quality == "standard":
        scale = 4
        interpolation = cv2.INTER_CUBIC
        use_ai = False
    else: # "pro"
        scale = 4
        interpolation = cv2.INTER_CUBIC
        use_ai = AI_AVAILABLE
        
    out_width, out_height = width * scale, height * scale
    
    # Setup FFmpeg Subprocess for Video Writing
    ffmpeg_cmd = [
        FFMPEG_CMD, '-y', 
        '-f', 'rawvideo', '-vcodec', 'rawvideo',
        '-s', f'{out_width}x{out_height}', '-pix_fmt', 'bgr24',
        '-r', str(fps), '-i', '-',
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-pix_fmt', 'yuv420p',
        temp_video_no_audio
    ]
    process = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    frame_count = 0
    print(f"Processing {total_frames} frames...")
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        frame_count += 1
        
        # Output progress
        if frame_count % 10 == 0 or frame_count == total_frames:
            print(f"Processing frame {frame_count}/{total_frames} ({(frame_count/total_frames)*100:.1f}%)")

        try:
            if use_ai and face_enhancer is not None:
                # Use GFPGAN which also uses RealESRGAN for background
                _, _, output = face_enhancer.enhance(frame, has_aligned=False, only_center_face=False, paste_back=True)
            elif use_ai and upsampler is not None:
                # Use only RealESRGAN
                output, _ = upsampler.enhance(frame, outscale=scale)
            else:
                # Fallback or Non-Pro Quality
                output = cv2.resize(frame, (out_width, out_height), interpolation=interpolation)
                
            process.stdin.write(output.tobytes())
                
        except Exception as e:
            print(f"Error processing frame {frame_count}: {e}")
            break

    cap.release()
    process.stdin.close()
    process.wait()
    
    # Merge audio back
    if has_audio and os.path.exists(audio_path):
        print("Merging audio back to video...")
        merge_audio(temp_video_no_audio, audio_path, output_path)
    else:
        print("Saving video without audio...")
        import shutil
        shutil.move(temp_video_no_audio, output_path)
        
    print(f"Enhancement complete. Output saved to {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input', type=str, required=True, help='Input video path')
    parser.add_argument('-o', '--output', type=str, required=True, help='Output video path')
    parser.add_argument('-q', '--quality', type=str, default='standard', choices=['fast', 'standard', 'pro'], help='Enhancement quality')
    args = parser.parse_args()
    
    process_video(args.input, args.output, args.quality)
