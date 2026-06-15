import whisper
import os
import sys

def generate_subtitles(video_path, output_dir):
    print("Loading Whisper model...")
    model = whisper.load_model("base")
    
    print("Transcribing audio...")
    result = model.transcribe(video_path)
    
    base_name = os.path.basename(video_path).split('.')[0]
    txt_path = os.path.join(output_dir, f"{base_name}.txt")
    srt_path = os.path.join(output_dir, f"{base_name}.srt")
    
    # Save TXT
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(result["text"])
        
    # Save SRT
    with open(srt_path, "w", encoding="utf-8") as srt:
        for i, segment in enumerate(result["segments"]):
            start = format_timestamp(segment["start"])
            end = format_timestamp(segment["end"])
            srt.write(f"{i + 1}\n{start} --> {end}\n{segment['text'].strip()}\n\n")
            
    print(f"Transcript saved to {txt_path}")
    print(f"Subtitles saved to {srt_path}")
    
    return txt_path, srt_path

def format_timestamp(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"

if __name__ == "__main__":
    if len(sys.argv) > 2:
        generate_subtitles(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python whisper_engine.py <video_path> <output_dir>")
