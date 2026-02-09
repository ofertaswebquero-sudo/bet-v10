import os
import shutil

base = "/vercel/share/v0-project"
src = os.path.join(base, "src")

# Directories to copy from src/ to root
dirs_to_copy = [
    "components",
    "hooks", 
    "services",
    "integrations",
    "types",
    "pages",
    "lib",
]

copied = 0
skipped = 0

for d in dirs_to_copy:
    src_dir = os.path.join(src, d)
    dest_dir = os.path.join(base, d)
    
    if not os.path.isdir(src_dir):
        print(f"SKIP: {d}/ not found in src/")
        continue
    
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            src_file = os.path.join(root, f)
            # Get relative path from src/d/
            rel = os.path.relpath(src_file, src_dir)
            dest_file = os.path.join(dest_dir, rel)
            
            # Create dest directory if needed
            dest_parent = os.path.dirname(dest_file)
            os.makedirs(dest_parent, exist_ok=True)
            
            # Copy (overwrite if exists)
            shutil.copy2(src_file, dest_file)
            copied += 1
            print(f"  Copied: {d}/{rel}")

print(f"\nDone! Copied {copied} files.")
