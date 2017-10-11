# duplicate-files

Find duplicate files in folder

## Algo

Walk through all files in directory and also recursively in sub-directories, files are mapped with respect to their hashes. Hashes that are associated with more than 1 files are duplicates.

# installation

`npm install`

# run

`node index.js --directory <directory> --extensions <ext1>,<ext2>``
