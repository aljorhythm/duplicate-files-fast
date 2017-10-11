(function () {
    "use strict"

    var walk = require('walk'),
        fs = require('fs'),
        hashFile = require('hashFile')
    
    var dir = process.argv[2]
    var walker = walk.walk(dir)

    var files = {}

    walker.on("file", function (root, fileStats, next) {
      fs.readFile(fileStats.name, function () {
        hashFile(root + '/' + fileStats.name).then(hash => {
          console.log(hash);
          //=> 'ac8b2c4b75b2d36988c62b919a857f1baacfcd4c' 
        })
        next()
      })
    })

    walker.on("errors", function (root, nodeStatsArray, next) {

      next()
    })

    walker.on("end", function () {
      console.log("all done")
    })
}())