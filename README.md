# Ethereum Network Status Chrome Extension

Chrome Extension, TypeScript, Vue, Mocha

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

## Option

* [Visual Studio Code](https://code.visualstudio.com/)

## Includes the following

* TypeScript
* Webpack
* Moment.js
* Mocha tests
* Vue.js
* jQuery
* Extension Features
    * ETH Last-Block stats in Chrome Storage
    * Custom RPC Provider
    <!-- * content script -->
    * Background Light-Sync (only block number)
    * Badge Counter for number of blocks behind sync

## Project Structure

* src: TypeScript source files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

```
npm install
```

## Build by watch mode

### terminal

```
npm run build -- --watch
```

### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

## Load extension to chrome

Load `dist` directory


### Run Mocha tests

### terminal
```
npm test
```
