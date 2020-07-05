import os

paths = (os.path.join(root, filename)
        for root, _, filenames in os.walk('E:\\temp\\fish')
        for filename in filenames)

for path in paths:
    newname = path.replace("abc", "");
    os.rename(path, newname)