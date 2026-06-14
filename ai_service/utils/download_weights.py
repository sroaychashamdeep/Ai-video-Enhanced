import os
import requests

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

WEIGHTS = {
    "RealESRGAN_x4plus.pth": "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth",
    "GFPGANv1.4.pth": "https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth"
}

def download_file(url, dest_path):
    print(f"Downloading {os.path.basename(dest_path)}...")
    response = requests.get(url, stream=True)
    response.raise_for_status()
    total_size = int(response.headers.get('content-length', 0))
    block_size = 1024 * 1024 # 1MB
    
    downloaded = 0
    with open(dest_path, 'wb') as f:
        for data in response.iter_content(block_size):
            f.write(data)
            downloaded += len(data)
            if total_size > 0:
                percent = int(50 * downloaded / total_size)
                print(f"\r[{'=' * percent}{' ' * (50-percent)}] {downloaded / (1024*1024):.2f} MB", end="")
    print(f"\nSuccessfully downloaded {os.path.basename(dest_path)}")

def main():
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)

    for filename, url in WEIGHTS.items():
        dest_path = os.path.join(MODELS_DIR, filename)
        if not os.path.exists(dest_path):
            download_file(url, dest_path)
        else:
            print(f"{filename} already exists. Skipping download.")

if __name__ == "__main__":
    main()
