import os
import sys

def check_path_exists(path, is_dir=False):
    exists = os.path.isdir(path) if is_dir else os.path.exists(path)
    status = "✅" if exists else "❌"
    print(f"{status} Checking {path}...")
    return exists

def main():
    print("Starting System Health Check...")
    
    # Define required paths
    required_dirs = ["execution", "directives", ".tmp"]
    required_files = [".env", "CLAUDE.md", "GEMINI.md", "AGENTS.md"]
    
    all_pass = True
    
    # Check Directories
    for d in required_dirs:
        if not check_path_exists(d, is_dir=True):
            all_pass = False
            
    # Check Files
    for f in required_files:
        if not check_path_exists(f, is_dir=False):
            all_pass = False
            
    # Check Write Permissions to .tmp
    try:
        test_file = ".tmp/write_test"
        with open(test_file, "w") as f:
            f.write("test")
        os.remove(test_file)
        print("✅ Write permission to .tmp verified.")
    except Exception as e:
        print(f"❌ Write permission to .tmp failed: {e}")
        all_pass = False

    if all_pass:
        print("\nSystem Operational: 3-Layer Architecture Ready")
        sys.exit(0)
    else:
        print("\nSystem Health Check Failed: verification incomplete.")
        sys.exit(1)

if __name__ == "__main__":
    main()
