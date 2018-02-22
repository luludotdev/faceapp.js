#!/usr/bin/env node
const program = require('commander')

program
  .version(require('../package.json').version)
  .option('-l, --list-filters', 'Lists all filters you can use')
  .parse(process.argv)
