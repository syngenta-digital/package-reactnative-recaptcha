const fs = require('fs')
const { spawnSync } = require('child_process')
const file = require('../package.json')
const { exit } = require('process')
const brands = process.env.BRANDS.split(',')

const packageName = file.name
const fileName = `${__dirname}/../package.json`

const verbose = (/** @type {string} */ message) => {
  if (process.argv.indexOf('--verbose') > -1) {
    console.log(message)
  }
}
try {
  for (let brand of brands) {
    file.name = `${packageName}-${brand}`
    file.brandId = `${brand}`
    try {
      fs.writeFileSync(fileName, JSON.stringify(file, null, 2))
    } catch (err) {
      console.log(err)
      file.name = `${packageName}`
      fs.writeFileSync(fileName, JSON.stringify(file, null, 2))
    }
    const build = spawnSync('npm', ['build'])
    verbose(build.toString())
    const pack = spawnSync('npm', ['pack'])
    const result = pack.output[1]
    verbose(result.toString())
    const r = result.toString().split(/\r?\n/)
    const packageFile = r[r.length - 2]
    spawnSync('mv', [packageFile, 'artifacts/'])
    console.log(`${packageFile} successfully created. 🤟`)
  }
} catch (ex) {
  console.log(ex)
  file.name = `${packageName}`
  fs.writeFileSync(fileName, JSON.stringify(file, null, 2))
}

file.name = `${packageName}`
fs.writeFileSync(fileName, JSON.stringify(file, null, 2))
exit(0)