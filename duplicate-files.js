"use strict"

var walk = require('walk'),
  fs = require('fs'),
  hashFile = require('hash-file'),
  _ = require('lodash'),
  fileExtension = require('file-extension')

var DuplicateFiles = function () {

}

DuplicateFiles.prototype = {
  findDuplicates: function (directory, options) {
    return new Promise((resolve, reject) => {

      options = options || {}
      var extensions = options['extensions'] || []

      var mappedFiles = {}
      var allPromises = []

      var walker = walk.walk(directory)
      walker.on("file", function (root, fileStats, next) {
        var filePath = root + '/' + fileStats.name
        fs.readFile(filePath, function () {
          if (!extensions || extensions.includes(fileExtension(filePath))) {
            allPromises.push(hashFile(filePath).then(hash => {
              mappedFiles[hash] = mappedFiles[hash] || []
              mappedFiles[hash].push(filePath)
            }))
          }
          next()
        })
      })

      walker.on("errors", function (root, nodeStatsArray, next) {
        next()
      })

      walker.on("end", function () {
        Promise.all(allPromises).then(function () {
          var filtered = _.filter(mappedFiles, function (o) {
            return o.length > 1
          })
          resolve(filtered)
        })
      })
    })
  }
}

module.exports = DuplicateFiles