(function () {
    "use strict"

    var walk = require('walk'),
        fs = require('fs'),
        hashFile = require('hash-file'),
        _ = require('lodash'),
        fileExtension = require('file-extension')

    var dir = process.argv[2]
    var walker = walk.walk(dir)

    var extensions = ['jpg', 'jpeg', 'png', 'mov', 'mp3', 'mp4']
    var mappedFiles = {}
    var allPromises = []

    var walkedFilesCount = 0, mappedFilesCount = 0

    walker.on("file", function (root, fileStats, next) {
      var filePath = root + '/' + fileStats.name
      fs.readFile(filePath, function () {
        walkedFilesCount += 1
        if(fileStats.type == 'file' && extensions.includes(fileExtension(filePath))){
          
          allPromises.push(hashFile(filePath).then(hash => {
            mappedFiles[hash] = mappedFiles[hash] || []
            mappedFiles[hash].push(filePath)

            mappedFilesCount += 1

            process.stdout.clearLine()
            process.stdout.cursorTo(0)
            process.stdout.write('Walked files: ' + walkedFilesCount + ' mappedFiles: ' + mappedFilesCount)
          }))
        }
        next()
      })
    })

    walker.on("errors", function (root, nodeStatsArray, next) {
      next()
    })

    walker.on("end", function () {
      Promise.all(allPromises).then(function(){
          process.stdout.write('\n')
          var filtered = _.filter(mappedFiles, function(o) { 
            return o.length > 1
          })
          console.log(filtered)
      })
    })
}())