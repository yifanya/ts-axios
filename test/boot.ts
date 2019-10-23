const Jasmine = require('jasmine-core')

// @ts-ignore
global.getJasmineRequireObj = function() {
  return Jasmine
}

require('jasmine-ajax')
