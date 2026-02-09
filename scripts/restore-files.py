import os
import subprocess

# The v0 project root
PROJECT_ROOT = "/vercel/share/v0-project"

# Find all files that the Read tool can access but might not be on the filesystem
# Use find to see what actually exists in src/
src_path = os.path.join(PROJECT_ROOT, "src")

# Check if src directory exists
if os.path.isdir(src_path):
    existing = []
    for root, dirs, files in os.walk(src_path):
        for f in files:
            existing.append(os.path.relpath(os.path.join(root, f), PROJECT_ROOT))
    print(f"Found {len(existing)} files already on disk in src/:")
    for f in existing:
        print(f"  {f}")
else:
    print("src/ directory does not exist on disk!")
    os.makedirs(src_path, exist_ok=True)
    print("Created src/ directory")

# Try to use git if available
try:
    result = subprocess.run(
        ["git", "ls-tree", "-r", "HEAD", "--name-only"],
        capture_output=True, text=True, cwd=PROJECT_ROOT
    )
    if result.returncode == 0:
        git_files = [f for f in result.stdout.strip().split("\n") if f.startswith("src/")]
        print(f"\nGit reports {len(git_files)} files under src/")
        
        # Try git checkout for all src files
        checkout_result = subprocess.run(
            ["git", "checkout", "HEAD", "--", "src/"],
            capture_output=True, text=True, cwd=PROJECT_ROOT
        )
        if checkout_result.returncode == 0:
            print("Successfully checked out all src/ files from git!")
        else:
            print(f"Git checkout failed: {checkout_result.stderr}")
    else:
        print(f"Git ls-tree failed: {result.stderr}")
except FileNotFoundError:
    print("Git is not available")

# Verify what's there now
if os.path.isdir(src_path):
    count = 0
    for root, dirs, files in os.walk(src_path):
        count += len(files)
    print(f"\nAfter restore: {count} files in src/")
