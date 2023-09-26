/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable prefer-rest-params */
// @ts-nocheck
/* eslint-disable prefer-spread */
/* eslint-disable no-console */
/* global __DEVELOPMENT__ */
import ExecutionEnvironment from 'exenv';
import debounce from 'lodash.debounce';

import { formatDate } from './dateUtils';

if (
  ExecutionEnvironment.canUseDOM &&
  (window.console === undefined ||
    window.console.log === undefined ||
    window.console.debug === undefined ||
    window.console.error === undefined)
) {
  // polyfill
  window.console = window.console || {};
  window.console.log = () => {};
  window.console.debug = () => {};
  window.console.error = () => {};
}

// function logToErrCgi(name, trace) {
//   if (window && typeof window.onerror === 'function') {
//     window.onerror(name, window.location.href, trace);
//   }
// }

function modifyLogCall(logFunc: any, clientOrServer: any, args: any) {
  // eslint-disable-next-line unicorn/prefer-spread
  console[logFunc].apply(console, [clientOrServer].concat(Array.prototype.slice.call(args)));
}

function getClientLogger(logFunc) {
  return function () {
    modifyLogCall(logFunc, 'Marty Client:', arguments);
  };
}

function getServerLogger(logFunc) {
  const env = process.env.MARTY_EB_ENV || 'unset';
  if (process.env.NODE_ENV === 'test') {
    return () => undefined;
  }
  // needs to be function rather than fat arrow or else `arguments` get lost
  return function () {
    const timestamp = formatDate('DD/MMM/YYYY:HH:mm:ss.ms ZZ');
    const loggingPrefix = `[${timestamp}] martyenv=${env}`;
    modifyLogCall(logFunc, loggingPrefix, arguments);
  };
}

export function devLogger(message) {
  if (__DEVELOPMENT__) {
    logger(message);
  }
}

export class DevLoggerGroupDebounced {
  constructor({ groupName, debounceTime }) {
    this.groupName = groupName;
    this.debounceTime = debounceTime;
    this.itemsToLog = [];
  }

  logGroup = debounce(() => {
    console.groupCollapsed(this.groupName);
    for (const item of this.itemsToLog) {
      console.log(item);
    }
    console.groupEnd();
    this.itemsToLog = [];
  }, this.debounceTime);

  addLog = (item) => {
    if (__DEVELOPMENT__ && typeof console.groupCollapsed === 'function') {
      this.itemsToLog.push(item);
      this.logGroup();
    }
  };
}

const logger = ExecutionEnvironment.canUseDOM ? getClientLogger('log') : getServerLogger('log');

export const logError = ExecutionEnvironment.canUseDOM
  ? getClientLogger('error')
  : getServerLogger('error');

export const logDebug = ExecutionEnvironment.canUseDOM
  ? getClientLogger('debug')
  : getServerLogger('log');

export const logToServer = logError;
export const logErrorAndLogToServer = (error) => {
  logError(error);
  logToServer(error);
};

export default logger;
