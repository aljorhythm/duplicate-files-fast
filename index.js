#!/usr/bin/env node

let DuplicateFiles = require('./duplicate-files.js')
let program = require('commander')
let _ = require('lodash')
let fs = require('fs-extra')

async function main(){
  function list(val) {
    return val ? val.split(',') : []
  }

  program
    .version('0.1.0')
    .option('-d, --directory <directory>', 'Root directory')
    .option('-e, --extensions [extensions]', 'Extensions to map', list)
    .option('-r, --remove', 'Remove mode')
    .option('-x, --dryrun', 'Dry run')
    .parse(process.argv)
  
  let removeMode = program.remove
  let extensions = program.extensions
  let dryRun = program.dryrun
  let directory = program.directory
  if (!directory) {
    console.log('--directory required')
    return
  }

  let finder = new DuplicateFiles()  

  let mappedFilesCount = 0,
    walkedFilesCount = 0

  function updateUiCount(msg) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write('walked\t' + walkedFilesCount + ' and mapped\t' + mappedFilesCount + ' files.\t' + (msg || ''))
  }

  let options = {
    extensions: extensions || null,
    eventHandlers: {
      'walked_file': (fileStats) => {
        let { name } = fileStats
        walkedFilesCount += 1
        updateUiCount(' Walked: ' + name)
      },
      'mapped_file': (fileStats) => {
        let { name } = fileStats
        mappedFilesCount += 1
        updateUiCount(' Mapped: ' + name)
      }
    }
  }
  
  let duplicates = []
  try {
    duplicates = await finder.findDuplicates(directory, options)
  } catch(err) {
    console.log('Error: ', err.error)
    return
  }
  
  if(removeMode) {
    let toRemoveFileFromEachHash = duplicates.map((files) => files.slice(1))
    let toRemoveFiles = _.flatten(toRemoveFileFromEachHash)

    if(dryRun) {
      console.log(toRemoveFiles.join("\n"))
    } else {
      let removeOperations = toRemoveFiles.map((filepath) => {
          return fs.unlink(filepath)
      })
      await Promise.all(removeOperations)
    }
  } else {
    console.log(JSON.stringify(duplicates, 0, 4))    
  }
}

main()
