(function () {
    "use strict"

    var walk = require('walk'),
        fs = require('fs'),
        hashFile = require('hash-file'),
        lodash = require('lodash'),
        fileExtension = require('file-extension')

    var dir = process.argv[2]
    var walker = walk.walk(dir)

    var extensions = ['jpg', 'jpeg', 'png', 'mov', 'mp3', 'mp4']
    var files = {}
    var allPromises = []
    walker.on("file", function (root, fileStats, next) {
      var filePath = root + '/' + fileStats.name
      fs.readFile(filePath, function () {
        if(fileStats.type == 'file' && extensions.includes(fileExtension(filePath))){
          allPromises.push(hashFile(filePath).then(hash => {
            files[hash] = files[hash] || []
            files[hash].push(filePath)
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
        console.log("all done")        
      })
    })
}())