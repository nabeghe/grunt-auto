# Grunt Auto
> Grunt Auto Config Generator for Terser, Uglify, Less & Sass.

Call a function to generate default general config for grunt tasks.

# Getting Started
**Prerequisites:** 
* [Grunt](https://gruntjs.com/)
* [Getting Started](https://gruntjs.com/getting-started)
* [Gruntfile](https://gruntjs.com/sample-gruntfile)

**Install:**
```bash
npm install grunt-auto --save-dev
```

# How To Work
* Default sources path of all JS, Less and Sass files is `src` folder in the project root directory. so for each of them there must be a folder with its own name in the src, like `src/js`
* General output path is `dist` folder in the project root directory.
* Each folder in the js, less and sass source path will be converted to a single file in the output path.
* Each final JavaScript file is obtained from a combination of files in the source path folders.
* Inside each folder of js, less and sass, there should be a file named index.js, index.less or index.scss.

**Default Files Pattern for JS folders in the source path:**
```javascript
[
    `${sourcePath}/${folderName}/polyfill/**/*.js`,  // Polyfills
    `${sourcePath}/${folderName}/addon/**/*.js`,     // Embeded Libraries
    `${sourcePath}/${folderName}/config.js`,         // Config
    `${sourcePath}/${folderName}/jquery/**/*.js`,    // Custom jQuery Addons
    `${sourcePath}/${folderName}/classes/**/*.js`,   // Classes
    `${sourcePath}/${folderName}/functions/**/*.js`, // Funcrions
    `${sourcePath}/${folderName}/index.js`,          // Index
    `${sourcePath}/${folderName}/runners/**/*.js`    // Runners
]
```
`index.js` is required

## Terser Usage:

**Requirement:**
```bash
npm install grunt-terser -save-dev
```

**Simple Usage:**
```javascript
const {ga} = require("grunt-auto");

module.exports = function (grunt) {
  grunt.initConfig({
    terser: ga('terser')
  })
  grunt.loadNpmTasks('grunt-terser');
}
```
**Customize:**
```javascript
const {ga} = require("grunt-auto");

module.exports = function (grunt) {
  grunt.initConfig({
    terser: ga("terser", {
      source: './src/js',
      dist: "dist/js",
      ignores: ['test2'], // ignored javscript folder from the source path, default = []
      devEnabled: true, // development (debug) output
      minEnabled: true, // minimum (publish) output
      filters: {
        data: (data) => {
          // data.iname  = input folder name
          // data.oname  = output file name, defult = data.iname
          // data.dist   = custom output directory path, default is undefined (automatically = dist/js)

          // example: customize a folder oname and dist
          if (data.iname === 'test3') {
            data.oname = 'test-3'
            data.dist  = 'assets/js'
          }
          return data
        },
        // customize the files in each folder
        files: (files, data, source) => { return files },
        // customize each terser development object
        development: (terser, data) => { return terser },
        // customize each terser production (minified) object
        production: (terser, data) => { return terser },
        // customize the final result of the ga_js function
        result: (result) => { return result }
      }
    }),
  })
  grunt.loadNpmTasks('grunt-terser');
}
```

## Terser Usage:
it's like terser

**Requirement:**
```bash
npm install grunt-contrib-uglify grunt-contrib-uglify -save-dev
```

**Simple Usage:**
```javascript
const {ga} = require("grunt-auto");

module.exports = function (grunt) {
  grunt.initConfig({
    uglify: ga('uglify')
  })
  grunt.loadNpmTasks('grunt-contrib-uglify')
}
```
**Customize:**
```javascript
const {ga} = require("grunt-auto");

module.exports = function (grunt) {
  grunt.initConfig({
    uglify: ga("uglify", {
      source: './src/js',
      dist: "dist/js",
      ignores: ['test2'],
      devEnabled: true,
      minEnabled: true
      filters: {
        data: (data) => {
          if (data.iname === 'test3') {
            data.oname = 'test-3'
            data.dist  = 'assets/js'
          }
          return data
        },
        files: (files, data, source) => { return files },
        development: (terser, data) => { return terser },
        production: (terser, data) => { return terser },
        result: (result) => { return result }
      }
    }),
  })
  grunt.loadNpmTasks('grunt-contrib-uglify')
}
```
## Less Usage:
It is the same as before, but here there is no files filter.

**Requirement:**
```bash
npm install grunt-contrib-concat grunt-contrib-less --save-dev
```

Simple:
```javascript
const {ga} = require("grunt-auto");

module.exports = function (grunt) {
  grunt.initConfig({
    less: ga('less')
  })
  grunt.loadNpmTasks('grunt-contrib-less')
}
```
Customize:
```javascript
const {ga} = require("grunt-auto");

module.exports = function (grunt) {
  grunt.initConfig({
    less: ga('less', {
      source: './src/less',
      dist: "dist/css",
      ignores: ['test2'],
      devEnabled: true,
      minEnabled: true,
      filters: {
        data: (data) => {
          if (data.iname === 'test3') {
            data.oname = 'test-3'
            data.dist  = 'assets/css'
          }
          return data
        },
        development: (ugilify, data) => { return ugilify },
        production: (ugilify, data) => { return ugilify },
        result: (result) => { return result }
      }
    }),
  })
  grunt.loadNpmTasks('grunt-contrib-less')
}
```