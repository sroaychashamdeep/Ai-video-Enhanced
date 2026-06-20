import cv2
import sys
import json
import argparse
import numpy as np

def analyze_video(input_path):
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print(json.dumps({"error": "Could not open video"}))
        return

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Read a few sample frames
    samples = min(total_frames, 10)
    step = max(1, total_frames // samples)
    
    blur_scores = []
    noise_scores = []
    brightness_scores = []
    
    # Mock Face Detection Cascade
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces_detected = 0

    for i in range(samples):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i * step)
        ret, frame = cap.read()
        if not ret:
            break
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # 1. Blur Detection (Laplacian Variance)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_scores.append(laplacian_var)
        
        # 2. Brightness
        brightness = np.mean(gray)
        brightness_scores.append(brightness)
        
        # 3. Noise Estimation (Standard deviation of laplacian)
        noise = np.std(cv2.Laplacian(gray, cv2.CV_64F))
        noise_scores.append(noise)
        
        # 4. Face Detection
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        faces_detected += len(faces)

    cap.release()

    avg_blur = np.mean(blur_scores) if blur_scores else 0
    avg_brightness = np.mean(brightness_scores) if brightness_scores else 0
    avg_noise = np.mean(noise_scores) if noise_scores else 0
    
    # Heuristics
    is_blurry = avg_blur < 100
    is_dark = avg_brightness < 80
    is_noisy = avg_noise > 50
    has_faces = faces_detected > 0
    needs_upscale = height < 1080
    
    # Build Recommendations
    recommendations = []
    if needs_upscale or is_blurry:
        recommendations.append({"id": "esrgan", "label": "Real-ESRGAN Upscaling", "icon": "🔍", "reason": "Low resolution or blurry video detected."})
    
    if has_faces:
        recommendations.append({"id": "gfpgan", "label": "GFPGAN Face Restore", "icon": "🤖", "reason": f"Detected {faces_detected} potential faces."})
        
    if fps < 60:
        recommendations.append({"id": "rife", "label": "RIFE Frame Interpolation", "icon": "🎞️", "reason": f"Low framerate ({fps:.1f} fps) detected. Smooth to 60fps."})

    if is_dark or is_noisy:
        recommendations.append({"id": "denoise", "label": "AI Denoising", "icon": "✨", "reason": "High noise or low-light conditions detected."})

    # Default to esrgan if nothing
    if not recommendations:
        recommendations.append({"id": "esrgan", "label": "Real-ESRGAN Upscaling", "icon": "🔍", "reason": "General enhancement recommended."})

    # Scene Classification Heuristics
    scene_type = "Standard / Mixed"
    confidence = 0.85
    
    if has_faces and faces_detected > 2:
        scene_type = "Portrait / Face-Heavy"
        confidence = 0.92
    elif is_dark:
        scene_type = "Low-Light / Night"
        confidence = 0.88
    elif fps >= 60:
        scene_type = "Action / Sports"
        confidence = 0.95
    elif avg_brightness > 180:
        scene_type = "Outdoor / Bright"
        confidence = 0.82
        
    analysis_result = {
        "metadata": {
            "resolution": f"{width}x{height}",
            "fps": round(fps, 2),
            "blurScore": round(avg_blur, 2),
            "brightnessScore": round(avg_brightness, 2)
        },
        "scene": {
            "type": scene_type,
            "confidence": confidence
        },
        "flags": {
            "isBlurry": bool(is_blurry),
            "isDark": bool(is_dark),
            "hasFaces": bool(has_faces)
        },
        "recommendations": recommendations,
        "estimatedQualityGain": min(100, int((2000 / max(1, avg_blur)) * 10 + (faces_detected * 5)))
    }
    
    print(json.dumps(analysis_result))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input', type=str, required=True, help='Input video path')
    args = parser.parse_args()
    
    # Suppress cv2 warnings
    import os
    os.environ['OPENCV_LOG_LEVEL'] = 'SILENT'
    
    analyze_video(args.input)
