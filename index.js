#!/usr/bin/env node

let DuplicateFiles = require('./duplicate-files.js')
let program = require('commander')

async function main(){
  function list(val) {
    return val.split(',')
  }

  program
    .version('0.1.0')
    .option('-d, --directory <directory>', 'Root directory')
    .option('-e, --extensions [extensions]', 'Extensions to map', list)
    .option('-r, --remove [remove]', 'Remove mode')
    .parse(process.argv)
  
  let removeMode = program.remove
  let finder = new DuplicateFiles()

  let directory = program.directory
  if (!directory) {
    console.log('--directory required')
    return
  }

  let mappedFilesCount = 0,
    walkedFilesCount = 0

  function updateUiCount(msg) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write('walked\t' + walkedFilesCount + ' and mapped\t' + mappedFilesCount + ' files.\t' + (msg || ''))
  }

  let options = {
    extensions: program.extensions || null,
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
  
  try {
    let duplicates = await finder.findDuplicates(directory, options)
    console.log(JSON.stringify(duplicates, 0, 4))
  } catch(err) {
    console.log('Error: ', err.error)
  }

  if(removeMode) {

  }
}

main()
