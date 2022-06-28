# Grunt Auto
> Grunt Auto Config Generator for Terser, Uglify, LESS & SASS.

Call the `ga` function to generate a default config for grunt tasks.
Supports Terser, Uglify, LESS & SASS

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
* The default source paths for the `Terser` and `Uglify` are `src/js`, and for the `LESS` and `SASS` are `src/less` and `src/sass`.
* Each directory (folder) in the `src/js`, `src/less` and `src/sass` paths will be converted to a single file in the related output path. The output file name is same with the directory name.
* The default output path for the `Terser` and `Uglify` are `dist/js`, and for the `LESS` and `SASS` are `dist/css`.
* Inside each folder in the`src/less` path there should be a file named `index.less`. for example `src/less/style-1/index.less`.
* Inside each folder in the`src/sass` path there should be a file named `index.scss`. for example `src/sass/style-1/index.scss`.
* The final JavaScript file is obtained by merging the JavaScript files in the source folder. For example, if we consider the path `src/js/script-1`, then all the JavaScript files inside it will be converted to files named` script-1.js` and `script-1.min.js`.

**Of course, merging the JavaScript files is based on a predefined order, which we call it queue. The default queue:**
```javascript
[
    `%P%/polyfill/**/*.js`,  // Polyfills
    `%P%/addon/**/*.js`,     // Embedded Libraries
    `%P%/config.js`,         // Config
    `%P%/jquery/**/*.js`,    // Custom jQuery Addons
    `%P%/classes/**/*.js`,   // Classes
    `%P%/functions/**/*.js`, // Funcrions
    `%P%/index.js`,          // Index
    `%P%/runners/**/*.js`    // Runners
]
```
The %P% replaced with the folder path. For example: `src/js/script-1`

## Terser Usage:

**Requirement:**
```bash
npm install grunt-terser --save-dev
```

**Simple Usage:**
```javascript
const {ga} = require("grunt-auto");

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-terser');
    grunt.initConfig({
        terser: ga('terser')
    })
}
```
You can use the `gaTerser` function too.

## Grunt Usage:
it's like terser

**Requirement:**
```bash
npm install grunt-contrib-uglify --save-dev
```

**Simple Usage:**
```javascript
const {ga} = require("grunt-auto");

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.initConfig({
        uglify: ga('uglify')
    })
}
```
You can use the `gaUglify` function too.

## Less Usage:
It is the same as before.

**Requirement:**
```bash
npm install grunt-contrib-less grunt-contrib-concat --save-dev
```

Simple Usage:
```javascript
const {ga} = require("grunt-auto");

module.exports = function (grunt) {
    grunt.initConfig({
        less: ga('less'),
    })
    grunt.loadNpmTasks('grunt-contrib-less')
}
```
You can use the `gaLess` function too.

## Sass Usage:
as always. but don't forget to install the ruby.

**Requirement:**
```bash
npm install -g sass
npm install grunt-contrib-sass --save-dev
```

Simple Usage:
```javascript
const {ga} = require("grunt-auto");

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-sass')
    grunt.initConfig({
        less: ga('sass'),
    })
}
```
You can use the `gaSass` function too.

## Customizations:
You can simply customize the configs by passing the second argument of the `ga` function.
```javascript
const {ga} = require("grunt-auto");

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-terser')
    grunt.initConfig({
        less: ga('terser', {
            // enables/disables the development output
            devEnabled: true,
            // enables/disables the production (minified) output
            minEnabled: true,
            // the source path
            source: './src/js',
            // the output path
            dist: './dist/js',
            // skips some specified scripts or styles. just add the name.
            ignores: [],
            // the queue (Terser and Uglify)
            queue: [
                `%P%/polyfill/**/*.js`,  // Polyfills
                `%P%/addon/**/*.js`,     // Embeded Libraries
                `%P%/config.js`,         // Config
                `%P%/jquery/**/*.js`,    // Custom jQuery Addons
                `%P%/functions/**/*.js`, // Funcrions
                `%P%/classes/**/*.js`,   // Classes
                `%P%/index.js`,          // Index
                `%P%/runners/**/*.js`    // Runners
            ],
            // the filters to customize some values
            filters: {
                /**
                 * filters the list of folders in the source
                 * @param {array}  folders  array of folders in the source path
                 * @param {string} type     (less, terser, sass or ugilify)
                 * @return {array} folders
                 */
                folders: (folders, type) => {
                    return folders
                },
                /**
                 * filters each folder seperatly
                 * @param {array} data
                 *  - data.iname -> folder name
                 *  - data.oname -> output file name (default is same with iname)
                 *  - source     -> source path (doesn't includes the folder name)
                 *  - dist       -> ouput  path (doesn't includes the folder name)
                 *  - entry      -> only for less and sass
                 * @param {string} type (less, terser, sass or ugilify)
                 * @return {object|false} if returns false, will be ignored
                 */
                data: (data, type) => {
                    return data
                },
                /**
                 * filters the development config
                 * @param {object} development
                 * @returns {object|false}
                 */
                development: (development) => {
                    return development
                },
                /**
                 * filters the production config
                 * @param {object} production
                 * @returns {object|false}
                 */
                production: (production) => {
                    return production
                },
                /**
                 * filters the final result
                 * @param {object} result
                 * @returns {object}
                 */
                result: (result) => {
                    return result
                }
            }
        }),
    })
}
```