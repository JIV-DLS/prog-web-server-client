/* eslint-disable no-console */
// tslint:disable-next-line:no-console
const originalConsoleLog = console.log
// tslint:disable-next-line:no-console
console.log = function consoleLog(...args) {
  const newArguments = [`[${new Date().toISOString()}]`, ...args]
  return originalConsoleLog.apply(this, newArguments)
}
// tslint:disable-next-line:no-console
console.info = console.log

export const logger = console
