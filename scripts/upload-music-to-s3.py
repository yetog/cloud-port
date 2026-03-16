#!/usr/bin/env python3
"""
Music Upload Script for IONOS S3
Uploads audio files to S3 with public-read access and generates URLs for music.ts

Usage:
    python3 upload-music-to-s3.py <file_or_folder>
    python3 upload-music-to-s3.py ~/Music/my-album/
    python3 upload-music-to-s3.py ~/Music/single-track.mp3

Examples:
    # Upload a single file
    python3 scripts/upload-music-to-s3.py ~/Music/track.mp3

    # Upload entire folder
    python3 scripts/upload-music-to-s3.py ~/Music/album-folder/

    # Dry run (see what would be uploaded)
    python3 scripts/upload-music-to-s3.py ~/Music/album-folder/ --dry-run

Output:
    Generates TypeScript snippets ready for src/data/music.ts
"""

import os
import sys
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from pathlib import Path
from dotenv import load_dotenv
import mimetypes
import json
from datetime import datetime

# === Load Configuration ===
# Look for .env.s3 in project root
PROJECT_ROOT = Path(__file__).parent.parent
ENV_FILE = PROJECT_ROOT / ".env.s3"

if ENV_FILE.exists():
    load_dotenv(ENV_FILE)
else:
    print(f"Warning: {ENV_FILE} not found. Using environment variables.")

# Configuration from environment
ACCESS_KEY = os.getenv('IONOS_S3_ACCESS_KEY')
SECRET_KEY = os.getenv('IONOS_S3_SECRET_KEY')
BUCKET_NAME = os.getenv('IONOS_S3_BUCKET', 'portfoliowebsite')
ENDPOINT_URL = os.getenv('IONOS_S3_ENDPOINT', 'https://s3.us-central-1.ionoscloud.com')
REGION = os.getenv('IONOS_S3_REGION', 'us-central-1')

# S3 prefix for music files
MUSIC_PREFIX = "music"

# Supported audio formats
AUDIO_EXTENSIONS = {'.mp3', '.wav', '.flac', '.m4a', '.aac', '.ogg', '.wma'}

# === Helper Functions ===

def get_content_type(filename: str) -> str:
    """Get MIME type for audio files"""
    ext = Path(filename).suffix.lower()
    content_types = {
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.flac': 'audio/flac',
        '.m4a': 'audio/mp4',
        '.aac': 'audio/aac',
        '.ogg': 'audio/ogg',
        '.wma': 'audio/x-ms-wma',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
    }
    return content_types.get(ext, mimetypes.guess_type(filename)[0] or 'binary/octet-stream')


def sanitize_filename(filename: str) -> str:
    """Make filename URL-safe"""
    # Replace spaces with hyphens, remove special chars
    safe = filename.replace(' ', '-').replace('_', '-')
    # Keep only alphanumeric, hyphens, dots
    safe = ''.join(c for c in safe if c.isalnum() or c in '-.')
    return safe.lower()


def get_s3_key(local_path: Path, base_folder: Path = None) -> str:
    """Generate S3 key for a file"""
    filename = sanitize_filename(local_path.name)

    if base_folder:
        # Preserve folder structure
        relative = local_path.relative_to(base_folder)
        folder_name = sanitize_filename(relative.parent.name) if relative.parent.name != '.' else ''
        if folder_name:
            return f"{MUSIC_PREFIX}/{folder_name}/{filename}"

    return f"{MUSIC_PREFIX}/{filename}"


def get_public_url(s3_key: str) -> str:
    """Generate public URL for uploaded file"""
    return f"{ENDPOINT_URL}/{BUCKET_NAME}/{s3_key}"


def test_connection(s3_client) -> bool:
    """Test S3 connectivity"""
    try:
        s3_client.head_bucket(Bucket=BUCKET_NAME)
        print(f"✓ Connected to bucket: {BUCKET_NAME}")
        return True
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == '404':
            print(f"✗ Bucket '{BUCKET_NAME}' not found")
        elif error_code == '403':
            print(f"✗ Access denied - check credentials")
        else:
            print(f"✗ Connection error: {error_code}")
        return False


def disable_public_access_block(s3_client) -> bool:
    """Ensure bucket allows public ACLs"""
    config = {
        'BlockPublicAcls': False,
        'IgnorePublicAcls': False,
        'BlockPublicPolicy': False,
        'RestrictPublicBuckets': False
    }
    try:
        s3_client.put_public_access_block(
            Bucket=BUCKET_NAME,
            PublicAccessBlockConfiguration=config
        )
        print("✓ Public access block configured")
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchPublicAccessBlockConfiguration':
            print("✓ No public access block (already open)")
            return True
        print(f"⚠ Could not configure public access: {e}")
        return False


def upload_file(s3_client, local_path: Path, s3_key: str, dry_run: bool = False) -> dict:
    """Upload a single file to S3"""
    content_type = get_content_type(str(local_path))
    public_url = get_public_url(s3_key)

    result = {
        'local_path': str(local_path),
        's3_key': s3_key,
        'url': public_url,
        'content_type': content_type,
        'size': local_path.stat().st_size,
        'success': False
    }

    if dry_run:
        print(f"  [DRY RUN] Would upload: {local_path.name}")
        print(f"            → {s3_key}")
        result['success'] = True
        return result

    try:
        s3_client.upload_file(
            str(local_path),
            BUCKET_NAME,
            s3_key,
            ExtraArgs={
                'ACL': 'public-read',
                'ContentType': content_type
            }
        )
        print(f"  ✓ {local_path.name}")
        print(f"    → {public_url}")
        result['success'] = True
    except Exception as e:
        print(f"  ✗ {local_path.name}: {e}")
        result['error'] = str(e)

    return result


def collect_audio_files(path: Path) -> list:
    """Collect all audio files from path (file or directory)"""
    files = []

    if path.is_file():
        if path.suffix.lower() in AUDIO_EXTENSIONS:
            files.append(path)
        else:
            print(f"⚠ Not an audio file: {path}")
    elif path.is_dir():
        for ext in AUDIO_EXTENSIONS:
            files.extend(path.glob(f"*{ext}"))
            files.extend(path.glob(f"*{ext.upper()}"))
        # Also check subdirectories
        for ext in AUDIO_EXTENSIONS:
            files.extend(path.glob(f"**/*{ext}"))
    else:
        print(f"✗ Path not found: {path}")

    return sorted(set(files))


def generate_typescript_snippet(results: list) -> str:
    """Generate TypeScript code for music.ts"""
    successful = [r for r in results if r['success']]

    if not successful:
        return "// No successful uploads"

    lines = [
        "// Add these URLs to your src/data/music.ts tracks:",
        "// Generated by upload-music-to-s3.py",
        ""
    ]

    for r in successful:
        filename = Path(r['local_path']).stem
        # Convert filename to readable title
        title = filename.replace('-', ' ').replace('_', ' ').title()
        lines.append(f"// {title}")
        lines.append(f"audioUrl: '{r['url']}',")
        lines.append("")

    return '\n'.join(lines)


def main():
    """Main upload workflow"""
    # Parse arguments
    if len(sys.argv) < 2:
        print("Usage: python3 upload-music-to-s3.py <file_or_folder> [--dry-run]")
        print("\nExamples:")
        print("  python3 scripts/upload-music-to-s3.py ~/Music/track.mp3")
        print("  python3 scripts/upload-music-to-s3.py ~/Music/album/ --dry-run")
        sys.exit(1)

    target_path = Path(sys.argv[1]).expanduser().resolve()
    dry_run = '--dry-run' in sys.argv

    print("=" * 60)
    print("IONOS S3 Music Uploader")
    print("=" * 60)
    print(f"Target: {target_path}")
    print(f"Bucket: {BUCKET_NAME}")
    print(f"Prefix: {MUSIC_PREFIX}/")
    if dry_run:
        print("Mode: DRY RUN (no actual uploads)")
    print("-" * 60)

    # Validate credentials
    if not ACCESS_KEY or not SECRET_KEY:
        print("✗ Missing S3 credentials!")
        print(f"  Check {ENV_FILE} or set environment variables:")
        print("  - IONOS_S3_ACCESS_KEY")
        print("  - IONOS_S3_SECRET_KEY")
        sys.exit(1)

    # Initialize S3 client
    s3 = boto3.client(
        's3',
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        endpoint_url=ENDPOINT_URL,
        region_name=REGION
    )

    # Test connection
    if not dry_run:
        if not test_connection(s3):
            sys.exit(1)
        disable_public_access_block(s3)

    # Collect files
    print("\nScanning for audio files...")
    files = collect_audio_files(target_path)

    if not files:
        print("✗ No audio files found!")
        print(f"  Supported formats: {', '.join(AUDIO_EXTENSIONS)}")
        sys.exit(1)

    print(f"Found {len(files)} audio file(s)\n")

    # Determine base folder for relative paths
    base_folder = target_path if target_path.is_dir() else target_path.parent

    # Upload files
    print("Uploading...")
    results = []
    for f in files:
        s3_key = get_s3_key(f, base_folder if target_path.is_dir() else None)
        result = upload_file(s3, f, s3_key, dry_run)
        results.append(result)

    # Summary
    print("\n" + "=" * 60)
    success_count = sum(1 for r in results if r['success'])
    fail_count = len(results) - success_count
    print(f"Results: {success_count} success, {fail_count} failed")

    # Generate TypeScript snippet
    if success_count > 0:
        print("\n" + "-" * 60)
        print(generate_typescript_snippet(results))

    # Save results to JSON
    if not dry_run and success_count > 0:
        output_file = PROJECT_ROOT / f"music-upload-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\nResults saved to: {output_file}")

    print("\nDone!")


if __name__ == "__main__":
    main()
