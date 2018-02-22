#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const faceapp = require('../src/index')

// Allow Console Statements
/* eslint no-console: 0 */

program
  .version(require('../package.json').version)
  .option('-l, --list-filters', 'Lists all filters you can use')
  .parse(process.argv)

/**
 * @param {program} p Commander Program
 */
const main = async p => {
  if (p.args.length === 0 && !p.listFilters) p.help()
  if (p.listFilters) {
    let filters = (await faceapp.listFilters()).filter(x => x.id !== 'no-filter')
    let free = filters.filter(x => !x.paid)
    let paid = filters.filter(x => x.paid)

    console.log(chalk`{blue ${'Free Filters:'}}
${free.map(x => x.id).join(' ')}

{blue ${'Paid Filters:'}}
${paid.map(x => x.id).join(' ')}`)
  }
}

main(program)
