require('qunit')
const { ga } = require('./../index.js')

const generateDefaultExpected = (source = 'src/js', dist = 'dist/js') => {
    const expected = {
        development: {
            options: {
                mangle: false,
                compress: false,
                keep_classnames: true,
                keep_fnames: true,
                format: {
                    beautify: true,
                },
            },
            files: {},
        },
        production: {
            options: {
                mangle: true,
                compress: true,
                keep_classnames: true,
                keep_fnames: true,
                format: {
                    beautify: false,
                },
            },
            files: {},
        },
    }
    expected.development.files[dist + '/script-1.js'] = [
        source + `/script-1/polyfill/**/*.js`,
        source + `/script-1/addon/**/*.js`,
        source + `/script-1/config.js`,
        source + `/script-1/jquery/**/*.js`,
        source + `/script-1/functions/**/*.js`,
        source + `/script-1/classes/**/*.js`,
        source + `/script-1/index.js`,
        source + `/script-1/runners/**/*.js`
    ]
    expected.development.files[dist + '/script-2.js'] = [
        source + `/script-2/polyfill/**/*.js`,
        source + `/script-2/addon/**/*.js`,
        source + `/script-2/config.js`,
        source + `/script-2/jquery/**/*.js`,
        source + `/script-2/functions/**/*.js`,
        source + `/script-2/classes/**/*.js`,
        source + `/script-2/index.js`,
        source + `/script-2/runners/**/*.js`
    ]
    expected.production.files[dist + '/script-1.min.js'] = [
        source + `/script-1/polyfill/**/*.js`,
        source + `/script-1/addon/**/*.js`,
        source + `/script-1/config.js`,
        source + `/script-1/jquery/**/*.js`,
        source + `/script-1/functions/**/*.js`,
        source + `/script-1/classes/**/*.js`,
        source + `/script-1/index.js`,
        source + `/script-1/runners/**/*.js`
    ]
    expected.production.files[dist + '/script-2.min.js'] = [
        source + `/script-2/polyfill/**/*.js`,
        source + `/script-2/addon/**/*.js`,
        source + `/script-2/config.js`,
        source + `/script-2/jquery/**/*.js`,
        source + `/script-2/functions/**/*.js`,
        source + `/script-2/classes/**/*.js`,
        source + `/script-2/index.js`,
        source + `/script-2/runners/**/*.js`
    ]

    return expected
}

QUnit.module('terser')

//<editor-fold desc="default" defaultstate="collapsed">
QUnit.test('default', assert => {
    const terserConf = ga('terser')
    //console.log(JSON.stringify(terserConf, null, '\t'))
    assert.propEqual(terserConf, generateDefaultExpected())
})
//</editor-fold>