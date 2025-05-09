from ftplib import FTP, FTP_TLS
import os

def connect_ftp(server, username, password):
    try:
        # Try FTPS (Secure FTP)
        print("Attempting to connect using FTPS...")
        ftp = FTP_TLS(server)
        # ftp.set_debuglevel(2)  # Enable debug mode
        # ftp.set_pasv(True)     # Passive mode
        ftp.login(username, password)
        ftp.prot_p()           # Secure data connection (for FTPS)
        print("Connected using FTPS.")
        return ftp
    except Exception as e:
        print(f"FTPS failed: {e}\nFalling back to standard FTP...")


def sync_directory(ftp, local_dir, remote_dir):
    # Change to the remote directory (create if it doesn't exist)
    try:
        ftp.cwd(remote_dir)
    except:
        ftp.mkd(remote_dir)
        ftp.cwd(remote_dir)
    
    # Get list of remote files
    remote_files = ftp.nlst()
    print(f"Remote files: {remote_files}")

    # Get list of local files
    local_files = os.listdir(local_dir)
    print(f"Local files: {local_files}")
    # Delete remote files that are not in local directory
    for remote_file in remote_files:
        remote_path = f"{remote_dir}/{remote_file}"
        if remote_file not in local_files:
            try:
                ftp.delete(remote_path)
                print(f"Deleted remote file: {remote_path}")
            except:
                delete_remote_directory(ftp, remote_path)

    # Upload local files to remote directory
    for local_file in local_files:
        local_path = os.path.join(local_dir, local_file)
        remote_path = f"{remote_dir}/{local_file}"

        if os.path.isdir(local_path):
            try:
                ftp.mkd(remote_path)
            except:
                pass
            sync_directory(ftp, local_path, remote_path)
        else:
            with open(local_path, "rb") as file:
                ftp.storbinary(f"STOR {remote_path}", file)
            print(f"Uploaded file: {remote_path}")

def delete_remote_directory(ftp, remote_dir):
    try:
        ftp.rmd(remote_dir)
        print(f"Deleted remote directory: {remote_dir}")
    except:
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

if __name__ == "__main__":
    FTP_SERVER = "ftp.kongunattugounder.com"
    FTP_USERNAME = "game@kongunattugounder.com"
    FTP_PASSWORD = r'r0oUJLDrm9sE'
    
    LOCAL_DIR = r"D:\Naveen\github\rajarani"
    # LOCAL_DIR = r"E:\Development\Website's\rajarani\build"
    
    ftp = connect_ftp(FTP_SERVER, FTP_USERNAME, FTP_PASSWORD)
    sync_directory(ftp, LOCAL_DIR, REMOTE_DIR)
    ftp.quit()
    print("FTP connection closed.")