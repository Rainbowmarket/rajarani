from ftplib import FTP, FTP_TLS
import os

def connect_ftp(server, username, password):
    ftp = None
    try:
        print("Attempting to connect using FTPS...")
        ftp = FTP_TLS(server, timeout=15)
        ftp.login(username, password)
        ftp.prot_p()  # Secure data connection for FTPS
        print("Connected using FTPS.")
        return ftp
    except Exception as e:
        print(f"FTPS failed: {e}\nFalling back to standard FTP...")

    try:
        print("Attempting to connect using standard FTP...")
        ftp = FTP(server, timeout=15)
        ftp.login(username, password)
        print("Connected using standard FTP.")
        return ftp
    except Exception as e:
        print(f"Standard FTP failed: {e}")
        return None

def sync_directory(ftp, local_dir, remote_dir, skip_dirs=[], protected_files=[]):
    if not ftp:
        print("FTP connection not established. Exiting sync.")
        return
    
    # Change to the remote directory (create if it doesn't exist)
    try:
        ftp.cwd(remote_dir)
    except:
        try:
            ftp.mkd(remote_dir)
            ftp.cwd(remote_dir)
        except Exception as e:
            print(f"Failed to create or change remote directory: {e}")
            return
    
    # Get list of remote files
    try:
        remote_files = ftp.nlst()
        print(f"Remote files: {remote_files}")
    except Exception as e:
        print(f"Failed to list remote files: {e}")
        remote_files = []

    # Get list of local files
    local_files = os.listdir(local_dir)
    print(f"Local files: {local_files}")

    # Delete remote files not in local directory, excluding protected files
    for remote_file in remote_files:
        remote_path = f"{remote_dir}/{remote_file}"
        if remote_file not in local_files and remote_file not in protected_files:
            try:
                ftp.delete(remote_path)
                print(f"Deleted remote file: {remote_path}")
            except:
                delete_remote_directory(ftp, remote_path)

    # Upload local files to remote directory
    for local_file in local_files:
        local_path = os.path.join(local_dir, local_file)
        remote_path = f"{remote_dir}/{local_file}"

        # Skip specified directories
        if local_file in skip_dirs:
            print(f"Skipped directory: {local_path}")
            continue

        if os.path.isdir(local_path):
            try:
                ftp.mkd(remote_path)
            except:
                pass
            sync_directory(ftp, local_path, remote_path, skip_dirs, protected_files)
        else:
            try:
                with open(local_path, "rb") as file:
                    ftp.storbinary(f"STOR {remote_path}", file)
                print(f"Uploaded file: {remote_path}")
            except Exception as e:
                print(f"Failed to upload {remote_path}: {e}")

def delete_remote_directory(ftp, remote_dir):
    try:
        ftp.rmd(remote_dir)
        print(f"Deleted remote directory: {remote_dir}")
    except:
        try:
            ftp.cwd(remote_dir)
            remote_files = ftp.nlst()
            for file in remote_files:
                try:
                    ftp.delete(file)
                    print(f"Deleted remote file: {file}")
                except:
                    delete_remote_directory(ftp, f"{remote_dir}/{file}")

            ftp.cwd("..")
            ftp.rmd(remote_dir)
            print(f"Deleted remote directory: {remote_dir}")
        except Exception as e:
            print(f"Failed to delete remote directory: {e}")

if __name__ == "__main__":
    FTP_SERVER = "ftp.kongunattugounder.com"
    FTP_USERNAME = "game@kongunattugounder.com"
    FTP_PASSWORD = r'r0oUJLDrm9sE'
    
    LOCAL_DIR = r"E:\Development\Website's\rajarani"
    REMOTE_DIR = "/"

    # List of directories to skip
    SKIP_DIRS = [".git", ".idea", ".vscode", "venv", "node_modules", "dist"]

    # List of files that should NEVER be deleted from the server
    PROTECTED_FILES = [".htaccess"]
    
    ftp = connect_ftp(FTP_SERVER, FTP_USERNAME, FTP_PASSWORD)
    
    if ftp:
        sync_directory(ftp, LOCAL_DIR, REMOTE_DIR, skip_dirs=SKIP_DIRS, protected_files=PROTECTED_FILES)
        ftp.quit()
        print("FTP connection closed.")
    else:
        print("FTP connection failed. Exiting.")
