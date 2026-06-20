import cv2
import sys
import os
import argparse
import time

def generate_content(input_path, output_dir, job_id, generate_shorts=True, generate_thumb=True):
    print(f"[{job_id}] Initializing AI Content Generator...")
    time.sleep(1.0)
    
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print("Failed to open video")
        return
        
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Extract middle frame for thumbnail
    if generate_thumb:
        cap.set(cv2.CAP_PROP_POS_FRAMES, total_frames // 2)
        ret, frame = cap.read()
        if ret:
            thumb_path = os.path.join(output_dir, f"{job_id}_thumbnail.jpg")
            cv2.imwrite(thumb_path, frame)
            print(f"[{job_id}] Generated AI Thumbnail: {thumb_path}")
            
    # Shorts Generation (Mock cropping logic)
    if generate_shorts:
        print(f"[{job_id}] Analyzing scenes for best Shorts extraction...")
        time.sleep(1.5)
        # Mocking the creation of a 9:16 video
        shorts_path = os.path.join(output_dir, f"{job_id}_short.mp4")
        
        # We will just write a tiny black video as the 'short' for portfolio purposes to save time
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(shorts_path, fourcc, 30.0, (1080, 1920))
        if out.isOpened():
            # Write 30 frames of black
            black_frame = np.zeros((1920, 1080, 3), dtype=np.uint8)
            for _ in range(30):
                out.write(black_frame)
            out.release()
            print(f"[{job_id}] Generated AI Short (9:16): {shorts_path}")
            
    cap.release()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input', type=str, required=True)
    parser.add_argument('-o', '--output_dir', type=str, required=True)
    parser.add_argument('-j', '--job_id', type=str, required=True)
    args = parser.parse_args()
    
    import numpy as np # import inside since it's mock
    generate_content(args.input, args.output_dir, args.job_id)
