var DuplicateFiles = require('./duplicate-files.js')

var finder = new DuplicateFiles()

var directory = process.argv[2]

var options = {
  extensions : ['jpg', 'jpeg', 'png', 'mov', 'mp3', 'mp4']
}

finder.findDuplicates(directory, options).then((duplicates)=>{
  duplicates.forEach(function(duplicate) {
    console.log(duplicate)
  }, this)
})