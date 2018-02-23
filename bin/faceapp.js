#!/usr/bin/env node
const { Spinner } = require('cli-spinner')
const program = require('commander')
const chalk = require('chalk')
const fs = require('fs-extra')
const faceapp = require('../src/index')

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
  let filters = (await faceapp.listFilters()).filter(x => x.id !== 'no-filter')
  let free = filters.filter(x => !x.paid)
  let paid = filters.filter(x => x.paid)

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

  let [input] = p.args
  let { output, filter } = p

  let exists = await fs.exists(input)
  if (!exists) {
    console.log(chalk.red('file not found'))
    return false
  }

  let spinner = new Spinner('%s processing...')
  spinner.setSpinnerString(process.platform === 'win32' ? 0 : 18)
  spinner.start()
  try {
    let image = await fs.readFile(input)
    let final = await faceapp.process(image, filter)

    if (output) await fs.writeFile(output, final)
    else await fs.writeFile(input, final)

    spinner.stop(true)
    console.log(chalk.green(`saved ${output ? output : input} successfully!`))
  } catch (err) {
    spinner.stop(true)
    console.log(chalk.red(err.message))
  }
}

main(program)
