"use strict"

var walk = require('walk'),
  fs = require('fs-extra'),
  hashFile = require('hash-file'),
  _ = require('lodash'),
  fileExtension = require('file-extension')

var DuplicateFiles = function () {

}

DuplicateFiles.prototype = {
  findDuplicates: async (directory, options) => {
    options = options || {}
    if (!await fs.existsSync(directory)) {
      throw Error('No such directory')
    }
    
    let extensions = options.extensions
    let eventHandlers = options.eventHandlers || {}

    function handleEvent(event, data) {
      if (event in eventHandlers) {
        eventHandlers[event](data)
      }
    }

    async function toCheckfilepath(filepath) {
      return !extensions || extensions.includes(fileExtension(filepath))
    }

    function getSizeMappings() {
      return new Promise(async (resolve, reject) => {
        let allPromises = []
        let filesSizeMappings = {}
  
        let walker = walk.walk(directory)
        walker.on("file", async (root, fileStats, next) => {
          let filepath = root + '/' + fileStats.name
          handleEvent('walked_file', fileStats)
          let toCheck = await toCheckfilepath(filepath)
          if(!toCheck) {
            return next()
          }
          let fileSize = fileStats.size
          filesSizeMappings[fileSize] = filesSizeMappings[fileSize] || []
          filesSizeMappings[fileSize].push(filepath)
          handleEvent('mapped_file', fileStats)
          next()
        })
  
        walker.on("errors", function (root, nodeStatsArray, next) {
          handleEvent('errors', nodeStatsArray)
          next()
        })
  
        walker.on("end", function () {
          resolve(filesSizeMappings)
        })
      })
    }
    let sizeMappings = await getSizeMappings()
    let allHashOperations = []

    let hashedMapping = {}

    async function addToHashMapping(filepath) {
      let hash = await hashFile(filepath)
      hashedMapping[hash] = hashedMapping[hash] || []
      hashedMapping[hash].push(filepath)   
    }

    for(var size in sizeMappings) {
      let files = sizeMappings[size]
      let count = files.length

      if(count <= 1) {
        continue
      }

      files.forEach((filepath) => {
        allHashOperations.push(addToHashMapping(filepath))
      })
    }
    await Promise.all(allHashOperations)

    let duplicates = _.filter(hashedMapping, files => files.length > 1)
    return duplicates
  }
}

module.exports = DuplicateFiles