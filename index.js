var DuplicateFiles = require('./duplicate-files.js')
var program = require('commander')

function list(val) {
  return val.split(',')
}

program
  .version('0.1.0')
  .option('-d, --directory <directory>', 'Root directory')
  .option('-e, --extensions [extensions]', 'Extensions to map', list)
  .parse(process.argv)

var finder = new DuplicateFiles()

var directory = program.directory
if (!directory) {
  console.log('--directory required')
  process.exit()
}

var mappedFilesCount = 0,
  walkedFilesCount = 0

function updateUiCount(msg) {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write('walked\t' + walkedFilesCount + ' and mapped\t' + mappedFilesCount + ' files.\t' + (msg || ''))
}

var options = {
  extensions: program.extensions || null,
  eventHandlers: {
    'walked_file': (data) => {
      walkedFilesCount += 1
      updateUiCount(' Walked: ' + data.file.name)
    },
    'mapped_file': (data) => {
      mappedFilesCount += 1
      updateUiCount(' Mapped: ' + data.file.name)
    }
  }
}

finder.findDuplicates(directory, options).then((duplicates) => {
  duplicates.forEach(function (duplicate) {
    console.log(duplicate)
  }, this)
}, (err) => {
  console.log('Error: ', err.error)
})