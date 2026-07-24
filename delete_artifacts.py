import shutil
import os

path = r"C:\Users\Lenovo\OneDrive\Desktop\solar-website\artifacts"
if os.path.exists(path):
    shutil.rmtree(path)
    print("Deleted artifacts folder")
else:
    print("Folder not found")
