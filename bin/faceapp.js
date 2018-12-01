#!/usr/bin/env node
const { Spinner } = require('cli-spinner')
const program = require('commander')
const chalk = require('chalk')
const fs = require('fs')
const { promisify } = require('util')
const faceapp = require('../src/index')

const fse = {
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  exists: promisify(fs.exists),
}

// Allow Console Statements
/* eslint no-console: 0 */

program
  .version(require('../package.json').version)
  .arguments('<input>')
  .option('-o, --output <file>', 'file name or path to output to (otherwise overwrites original file)')
  .option('-f, --filter <id>', 'filter id to process with')
  .option('-l, --list-filters', 'lists all filters you can use')
  .parse(process.argv)

/**
 * @param {program} p Commander Program
 */
const main = p => {
  if (p.args.length === 0 && !p.listFilters) p.help()
  if (p.listFilters) listFilters()
  else run(p)
}

const listFilters = async () => {
  const filters = (await faceapp.listFilters()).filter(x => x.id !== 'no-filter')
  const free = filters.filter(x => !x.paid)
  const paid = filters.filter(x => x.paid)

  console.log(chalk`{green ${'Free Filters:'}}
${free.map(x => x.id).join(' ')}

{green ${'Paid Filters:'}}
${paid.map(x => x.id).join(' ')}`)
}

/**
 * @param {program} p Commander Program
 * @returns {*}
 */
const run = async p => {
  if (!p.filter) {
    console.log(chalk.red('--filter not specified'))
    return false
  }

  const [input] = p.args
  const { output, filter } = p

  const exists = await fse.exists(input)
  if (!exists) {
    console.log(chalk.red('file not found'))
    return false
  }

  const spinner = new Spinner('%s processing...')
  spinner.setSpinnerString(process.platform === 'win32' ? 0 : 18)
  spinner.start()
  try {
    const image = await fse.readFile(input)
    const final = await faceapp.process(image, filter)

    if (output) await fse.writeFile(output, final)
    else await fse.writeFile(input, final)

    spinner.stop(true)
    console.log(chalk.green(`saved ${output ? output : input} successfully!`))
  } catch (err) {
    spinner.stop(true)
    console.log(chalk.red(err.message))
  }
}

main(program)
