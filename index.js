/*
 * grunt-auto
 * https://github.com/nabeghe/grunt-auto
 *
 * Copyright (c) 2022 Hadi Akbarzadeh
 * Licensed under the MIT license.
 */

const {existsSync, readdirSync} = require('fs')

//<editor-fold desc="Utils" defaultstate="collapsed">

const getFolders = (source) => {
    if (!existsSync(source)) {
        return []
    }

    return readdirSync(source, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
}

const inArray = (val, arr) => {
    const length = arr.length
    for (let i = 0; i < length; i++) {
        if (arr[i] === val) {
            return true
        }
    }
    return false
}

const isObject = (val) => {
    return val != null && typeof val === 'object' && Array.isArray(val) === false
}

const modifyConf = (conf, srcContainer, distFileExtension) => {
    if (!isObject(conf)) conf = {}
    if (conf.source === undefined) conf.source = `./src/${srcContainer}`
    if (conf.dist === undefined) conf.dist = `dist/${distFileExtension}`
    if (conf.ignores === undefined) conf.ignores = []
    if (conf.filters === undefined) conf.filters = {}
    if (conf.devEnabled === undefined) conf.devEnabled = true
    if (conf.minEnabled === undefined) conf.minEnabled = true
    if (conf.entry === undefined) conf.entry = 'index'
    return conf
}

//</editor-fold>

//<editor-fold desc="Main Function" defaultstate="collapsed">

/**
 * generates auti and fast config for less, sass, terser and ugilify
 * @param {Object|null} conf grunt auto config for specified processor type
 * @param {string} processorType can be less, sass, terser or uglify
 * @returns {Object|null} generated config for less, sass, terser or uglify
 */
const ga = (processorType, conf = {}) => {
    processorType = processorType.toLowerCase()
    if (!inArray(processorType, ['less', 'sass', 'terser', 'uglify'])) {
        return null
    }

    const srcFileExtension = inArray(processorType, ['terser', 'uglify']) ? 'js' : (processorType === 'less' ? 'less' : 'scss')
    const distFileExtension = inArray(processorType, ['terser', 'uglify']) ? 'js' : 'css'
    const srcContainer = inArray(processorType, ['terser', 'uglify']) ? 'js' : processorType
    conf = modifyConf(conf, srcContainer, distFileExtension)

    // get all main folders in the source
    let folders = getFolders(conf.source)
    // filters the folders array
    if (typeof conf.filters.folders !== 'undefined') {
        folders = conf.filters.folders(folders, processorType)
    }

    const sourcePath = conf.source.startsWith('./') ? conf.source.replace('./', '') : conf.source
    const distPath = conf.dist.startsWith('./') ? conf.dist.replace('./', '') : conf.dist
    let result = {}

    const queue = conf.queue === undefined ?
        [
            `%P%/polyfill/**/*.js`,  // Polyfills
            `%P%/addon/**/*.js`,     // Embeded Libraries
            `%P%/config.js`,         // Config
            `%P%/jquery/**/*.js`,    // Custom jQuery Addons
            `%P%/functions/**/*.js`, // Funcrions
            `%P%/classes/**/*.js`,   // Classes
            `%P%/index.js`,          // Index
            `%P%/runners/**/*.js`    // Runners
        ] : conf.queue

    const generateSrcOutput = (isMin = true) => {
        let files = {}
        // each main folder
        for (let i = 0; i < folders.length; i++) {
            // skip ignores
            if (inArray(folders[i], conf.ignores)) continue
            // data
            let data = {
                // the input folder name that contains index.less
                iname: folders[i],
                // the output css file name without extension
                oname: folders[i],
                // the input source path
                source: sourcePath,
                // the output path
                dist: distPath,
                // the entry less
                entry: conf.entry
            }
            // filter data
            if (typeof conf.filters.data !== 'undefined') {
                data = conf.filters.data(data, processorType)
            }
            if (!data) continue

            const fileDistPath = `${data.dist}/${data.oname}${(isMin ? '.min' : '')}.${distFileExtension}`
            if (srcFileExtension === 'js') {
                files[fileDistPath] = structuredClone(queue)
                for (let i = 0; i < files[fileDistPath].length; i++) {
                    files[fileDistPath][i] = files[fileDistPath][i].replace('%P%', data.source + '/' + data.iname)
                }
            } else {
                files[fileDistPath] = `${data.source}/${data.iname}/${data.entry}.${srcFileExtension}`
            }
        }
        return files
    }

    // development
    if (conf.devEnabled) {
        let development = {
            options: {},
            files: generateSrcOutput(false)
        }
        if (conf.options !== undefined && conf.options.development) {
            development.options = conf.options.development
        }
        if (processorType === 'less') {
            if (development.options.optimization === undefined) development.options.optimization = 2
        } else if (processorType === 'sass') {
            if (development.options.style === undefined) development.options.style = 'expanded'
        } else if (processorType === 'terser') {
            if (development.options.mangle === undefined) development.options.mangle = false
            if (development.options.compress === undefined) development.options.compress = false
            if (development.options.keep_classnames === undefined) development.options.keep_classnames = true
            if (development.options.keep_fnames === undefined) development.options.keep_fnames = true
            if (development.options.format === undefined) development.options.format = {}
            if (development.options.format.beautify === undefined) development.options.format.beautify = true
        } else if (processorType === 'uglify') {
            if (development.options.beautify === undefined) development.options.beautify = true
            if (development.options.mangle === undefined) development.options.mangle = false
            if (development.options.compress === undefined) development.options.compress = false
        }
        // filter development
        if (typeof conf.filters.development !== 'undefined') {
            development = conf.filters.development(development, processorType)
        }
        if (development) {
            result.development = development
        }
    }

    // production
    if (conf.minEnabled) {
        let production = {
            options: {},
            files: generateSrcOutput(true)
        }
        if (conf.options !== undefined && conf.options.production) {
            production.options = conf.options.production
        }
        if (processorType === 'less') {
            if (production.options.compress === undefined) production.options.compress = true
            if (production.options.yuicompress === undefined) production.options.yuicompress = true
            if (production.options.optimization === undefined) production.options.optimization = 2
        } else if (processorType === 'sass') {
            if (production.options.style === undefined) production.options.style = 'compressed'
            if (production.options.noSourceMap === undefined) production.options.noSourceMap = true
        } else if (processorType === 'terser') {
            if (production.options.mangle === undefined) production.options.mangle = true
            if (production.options.compress === undefined) production.options.compress = true
            if (production.options.keep_classnames === undefined) production.options.keep_classnames = true
            if (production.options.keep_fnames === undefined) production.options.keep_fnames = true
            if (production.options.format === undefined) production.options.format = {}
            if (production.options.format.beautify === undefined) production.options.format.beautify = false
        } else if (processorType === 'uglify') {
            if (production.options.beautify === undefined) production.options.beautify = true
            if (production.options.mangle === undefined) production.options.mangle = false
            if (production.options.compress === undefined) production.options.compress = false
        }
        // filter production
        if (typeof conf.filters.production !== 'undefined') {
            production = conf.filters.production(production)
        }
        if (production) {
            result.production = production
        }
    }

    // filter result
    if (typeof conf.filters.result !== 'undefined') {
        result = conf.filters.result(result)
    }
    return result
}

//</editor-fold>

exports.ga = ga
exports.gaLess = (conf) => ga('less', conf)
exports.gaSass = (conf) => ga('sass', conf)
exports.gaTerser = (conf) => ga('terser', conf)
exports.gaUglify = (conf) => ga('uglify', conf)