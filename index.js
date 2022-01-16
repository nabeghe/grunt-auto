/*
 * grunt-auto
 * https://github.com/nabeghe/grunt-auto
 *
 * Copyright (c) 2022 Hadi Akbarzadeh
 * Licensed under the MIT license.
 */

const {readdirSync} = require('fs')

/* ****************************************************************************************************************** */
/* ****************************************************************************************************************** */
//<editor-fold desc="Utils" defaultstate="collapsed">

const generateJsFilesPattern = (data, source) => {
  return [
    `${source}/${data.iname}/polyfill/**/*.js`,  // Polyfills
    `${source}/${data.iname}/addon/**/*.js`,     // Embeded Libraries
    `${source}/${data.iname}/config.js`,         // Config
    `${source}/${data.iname}/jquery/**/*.js`,    // Custom jQuery Addons
    `${source}/${data.iname}/classes/**/*.js`,   // Classes
    `${source}/${data.iname}/functions/**/*.js`, // Funcrions
    `${source}/${data.iname}/index.js`,          // Index
    `${source}/${data.iname}/runners/**/*.js`    // Runners
  ];
}

const getFolders = (source) => {
  return readdirSync(source, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
}

const inArray = (val, arr) => {
  const length = arr.length;
  for (let i = 0; i < length; i++) if (arr[i] === val) return true;
  return false;
}

const isObject = (val) => {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

const modifyConf = (conf, typesrc = 'js', typedist = 'js') => {
  if (!isObject(conf)) conf = {}
  if (typeof conf.source === "undefined") conf.source = `./src/${typesrc}`
  if (typeof conf.dist === "undefined") conf.dist = `dist/${typedist}`
  if (typeof conf.ignores === "undefined") conf.ignores = []
  if (typeof conf.filters === "undefined") conf.filters = {}
  if (typeof conf.devEnabled === "undefined") conf.devEnabled = true
  if (typeof conf.minEnabled === "undefined") conf.minEnabled = true
  return conf;
}

//</editor-fold>
/* ****************************************************************************************************************** */
/* ****************************************************************************************************************** */
//<editor-fold desc="Less" defaultstate="collapsed">

function less(conf) {

  conf          = modifyConf(conf, 'less', 'css')
  let result    = {}
  const folders = getFolders(conf.source)

  const _getLessFiles = function (isMin = true) {
    const source = (conf.source.endsWith('/') ? conf.source : `${conf.source}/`).replace('./', '')
    var files    = {}
    for (let i = 0; i < folders.length; i++) {
      if (inArray(folders[i], conf.ignores)) continue
      let data = {
        iname: folders[i],
        oname: folders[i],
        dist: conf.dist
      }
      if (typeof conf.filters.data !== "undefined") data = conf.filters.data(data, isMin)
      if (!data) continue;
      const output  = `${data.dist}/${data.oname}${(isMin ? ".min" : "")}.css`
      files[output] = `${source}${data.iname}/index.less`
    }
    return files
  }

  // development mode
  if (conf.devEnabled) {
    let development = {
      options: {
        optimization: 2
      },
      files: _getLessFiles(false)
    }
    if (typeof conf.filters.development !== "undefined") development = conf.filters.development(development)
    result.development = development
  }

  if (conf.minEnabled) {
    let production = {
      options: {
        compress: true,
        yuicompress: true,
        optimization: 2,
      },
      files: _getLessFiles()
    }
    if (typeof conf.filters.production !== "undefined") production = conf.filters.production(production)
    result.production = production
  }

  if (typeof conf.filters.result !== "undefined") result = conf.filters.terser(result)
  return result

}

//</editor-fold>
/* ****************************************************************************************************************** */
/* ****************************************************************************************************************** */
//<editor-fold desc="Sass" defaultstate="collapsed">

function sass(conf) {

  conf          = modifyConf(conf, 'sass', 'css')
  let result    = {}
  const folders = getFolders(conf.source)

  const _getSassFiles = function (isMin = true) {
    const source = (conf.source.endsWith('/') ? conf.source : `${conf.source}/`).replace('./', '')
    var files    = {}
    for (let i = 0; i < folders.length; i++) {
      if (inArray(folders[i], conf.ignores)) continue
      let data = {
        iname: folders[i],
        oname: folders[i],
        dist: conf.dist
      }
      if (typeof conf.filters.data !== "undefined") data = conf.filters.data(data, isMin)
      if (!data) continue;
      const output  = `${data.dist}/${data.oname}${(isMin ? ".min" : "")}.css`
      files[output] = `${source}${data.iname}/index.scss`
    }
    return files
  }

  const sass = require('node-sass');
  result     = {
    options: {
      implementation: sass,
      style: 'expanded'
    },
    dist: {files: _getSassFiles(false)}
  }

  if (typeof conf.filters.result !== "undefined") result = conf.filters.terser(result)
  return result

}

//</editor-fold>
/* ****************************************************************************************************************** */
/* ****************************************************************************************************************** */
//<editor-fold desc="JS" defaultstate="collapsed">

function js(type, conf) {

  conf        = modifyConf(conf)
  let result  = {}
  let folders = getFolders(conf.source)

  for (var i = 0; i < folders.length; i++) {
    if (inArray(folders[i], conf.ignores)) continue
    //
    let data = {
      iname: folders[i],
      oname: folders[i],
      dist: conf.dist
    }
    if (typeof conf.filters.data !== "undefined") data = conf.filters.data(data)
    if (!data) continue
    const source = conf.source.replace("./", "")
    //
    if (conf.devEnabled) {
      const output = `${data.dist}/${data.oname}.js`
      let item     = {
        options: {},
        files: {}
      }
      if (type === 'uglify') {
        item.options = {
          beautify: true,
          mangle: false,
          compress: false
        }
      } else if (type === 'terser') {
        item.options = {
          mangle: false,
          compress: false,
          keep_classnames: true,
          keep_fnames: true,
          format: {
            beautify: true,
          },
        }
      }
      item.files[output] = generateJsFilesPattern(data, source)
      if (typeof conf.filters.files !== "undefined") item.files[output] = conf.filters.files(item.files[output], data.iname, source)
      if (typeof conf.filters.development !== "undefined") item = conf.filters.development(item, data)
      if (item) result[(typeof data.uname === "undefined" ? data.iname : data.uname)] = item
    }
    //
    if (conf.minEnabled) {
      const output       = `${data.dist}/${data.oname}.min.js`
      let item           = {
        files: {}
      }
      item.files[output] = generateJsFilesPattern(data, source)
      if (typeof conf.filters.files !== "undefined") item.files[output] = conf.filters.files(item.files[output], data.iname, source)
      if (typeof conf.filters.production !== "undefined") item = conf.filters.production(item, data)
      if (item) result[(typeof data.uname === "undefined" ? data.iname : data.uname) + ' (Min)'] = item
    }

  }

  if (typeof conf.filters.result !== "undefined") result = conf.filters.result(result)
  return result

}

//</editor-fold>
/* ****************************************************************************************************************** */
/* ****************************************************************************************************************** */

exports.ga = (type, conf = {}) => {
  type = type.toLowerCase()
  switch (type) {
    case 'less':
    case 'l':
      return less(conf);
      break
    case 'sass':
    case 's':
      return sass(conf);
      break
    case 'terser':
    case 't':
      return js(type, conf);
      break
    case 'uglify':
    case 'u':
      return js(type, conf);
      break
  }
  return {}
}