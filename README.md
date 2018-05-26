# duplicate-files

Find duplicate files in folder

## Algo

Walk through all files in directory and also recursively in sub-directories, files are mapped with respect to their hashes. Hashes that are associated with more than 1 files are duplicates.

# installation

`npm i -g duplicate-files-fast`

# run

Find out which files are duplicates
Output is in json format
```duplicate-files-fast --directory <directory> --extensions <ext1>,<ext2>```

Remove files mode. Files except the first found file is kept.
- Removes duplicate
```duplicate-files-fast --directory <directory> --remove```

- Dry run mode, prints files to be deleted without deleting
```duplicate-files-fast --directory <directory> --remove --dryrun```

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
