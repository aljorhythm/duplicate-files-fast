# duplicate-files

Find duplicate files in folder

## Algo

Walk through all files in directory and also recursively in sub-directories, files are mapped with respect to their hashes. Hashes that are associated with more than 1 files are duplicates.

# installation

`npm i -g duplicate-files-fast`

# run

```duplicate-files-fast --directory <directory> --extensions <ext1>,<ext2>```

# code

```
var DuplicateFiles = require('duplicate-files-fast')

var finder = new DuplicateFiles()

var directory = '.'
var options = {
  extensions : ['js']
}

finder.findDuplicates(directory, options).then((duplicates) => {
  duplicates.forEach(function (duplicate) {
    console.log('duplicate', duplicate)
  }, this)
}, (err) => {
  console.log('Error: ', err.error)
})
```
