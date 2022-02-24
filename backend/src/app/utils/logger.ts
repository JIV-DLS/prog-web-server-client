/* eslint-disable no-console */
// tslint:disable-next-line:no-console
import fs, {mkdirSync, openSync} from "fs";
import path from "path";

const originalConsoleLog = console.log
// tslint:disable-next-line:no-console
console.log = function consoleLog(...args) {
  const newArguments = [`[${new Date().toISOString()}]`, ...args]
  return originalConsoleLog.apply(this, newArguments)
}
// tslint:disable-next-line:no-console
console.info = console.log

const dir = "."

const access = fs.openSync(dir + '/node.access.log',"w+")
const error = fs.openSync(dir + '/node.error.log',"w+")

const E2E_DIR = '.'

export const logger = console

// @ts-ignore
function initLogs( timestamp ) {
  const dir = path.join( E2E_DIR, 'logs', `${ timestamp }` );

  mkdirSync( dir, { recursive: true } );

  const appLogPath = path.join( dir, `app-${ timestamp }.log` );
  const driverLogPath = path.join( dir, `chromedriver-${ timestamp }.log` );

  const appLogFd = openSync( appLogPath, 'w+' );
  const driverLogFd = openSync( driverLogPath, 'w+' );

  if ( ! appLogFd || ! driverLogFd ) {
    throw 'failed to initialize logs';
  }

  const appLog = { path: appLogPath, fd: appLogFd };
  const driverLog = { path: driverLogPath, fd: driverLogFd };

  return { appLog, driverLog };
}

const fileLoggers = initLogs(new Date().getTime())

// @ts-ignore
const writeLog = (...args) =>{
  fs.writeSync( fileLoggers.appLog.fd, [`[${new Date().toISOString()}]`, ...args,'\n'].join(' '));
}

export const loggerToFile = {'log':writeLog}

export function closeFileLoggers(){
  fs.closeSync(fileLoggers.appLog.fd);
  fs.closeSync(fileLoggers.driverLog.fd);
}
