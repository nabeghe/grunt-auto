require('qunit')
const { ga } = require('./../index.js')

const generateDefaultExpected = (source = 'src/less', dist = 'dist/css') => {
    const expected = {
        development: {
            options: {
                optimization: 2
            },
            files: {}
        },
        production: {
            options: {
                compress: true,
                yuicompress: true,
                optimization: 2
            },
            files: {}
        }
    }
    expected.development.files[dist + '/style-1.css'] = source + '/style-1/index.less'
    expected.development.files[dist + '/style-2.css'] = source + '/style-2/index.less'
    expected.production.files[dist + '/style-1.min.css'] = source + '/style-1/index.less'
    expected.production.files[dist + '/style-2.min.css'] = source + '/style-2/index.less'

    return expected
}

QUnit.module('less')

//<editor-fold desc="default" defaultstate="collapsed">
QUnit.test('default', assert => {
    const lessConf = ga('less')
    assert.propEqual(lessConf, generateDefaultExpected())
})
//</editor-fold>

//<editor-fold desc="only production" defaultstate="collapsed">
QUnit.test('only production', assert => {
    const lessConf = ga('less', {
        devEnabled: false
    })

    const expected = generateDefaultExpected()
    delete expected.development
    assert.propEqual(lessConf, expected)
})
//</editor-fold>

//<editor-fold desc="only development" defaultstate="collapsed">
QUnit.test('only development', assert => {
    const lessConf = ga('less', {
        minEnabled: false
    })

    const expected = generateDefaultExpected()
    delete expected.production
    assert.propEqual(lessConf, expected)
})
//</editor-fold>

//<editor-fold desc="ignores style-2" defaultstate="collapsed">
QUnit.test('ignores style-2', assert => {
    const lessConf = ga('less', {
        ignores: ['style-2']
    })

    const expected = generateDefaultExpected()
    delete expected.development.files['dist/css/style-2.css']
    delete expected.production.files['dist/css/style-2.min.css']
    assert.propEqual(lessConf, expected)
})
//</editor-fold>

//<editor-fold desc="custom source and dist path" defaultstate="collapsed">
QUnit.test('custom source and dist path', assert => {
    const lessConf = ga('less', {
        source: 'test/src/less',
        dist: 'assets/css'
    })

    assert.propEqual(lessConf, {
        development: {
            options: {
                optimization: 2
            },
            files: {
                'assets/css/example.css': 'test/src/less/example/index.less'
            }
        },
        production: {
            options: {
                compress: true,
                yuicompress: true,
                optimization: 2
            },
            files: {
                'assets/css/example.min.css': 'test/src/less/example/index.less'
            }
        }
    })
})
//</editor-fold>

//<editor-fold desc="changes the entry name from index.less to related folder names" defaultstate="collapsed">
QUnit.test('changes the entry name from index.less to related folder names', assert => {
    const lessConf = ga('less', {
        filters: {
            data: (data, isMin) => {
                data.entry = data.iname
                return data
            }
        }
    })

    const expected = generateDefaultExpected()
    expected.development.files['dist/css/style-1.css'] = 'src/less/style-1/style-1.less'
    expected.development.files['dist/css/style-2.css'] = 'src/less/style-2/style-2.less'
    expected.production.files['dist/css/style-1.min.css'] = 'src/less/style-1/style-1.less'
    expected.production.files['dist/css/style-2.min.css'] = 'src/less/style-2/style-2.less'
    assert.propEqual(lessConf, expected)
})
//</editor-fold>

//<editor-fold desc="changes the output names" defaultstate="collapsed">
QUnit.test('changes the output names', assert => {
    const lessConf = ga('less', {
        filters: {
            data: (data, isMin) => {
                data.oname = data.oname.replaceAll('-', '')
                return data
            }
        }
    })

    const expected = generateDefaultExpected()
    expected.development.files['dist/css/style1.css'] = expected.development.files['dist/css/style-1.css']
    delete expected.development.files['dist/css/style-1.css']
    expected.development.files['dist/css/style2.css'] = expected.development.files['dist/css/style-2.css']
    delete expected.development.files['dist/css/style-2.css']
    expected.production.files['dist/css/style1.min.css'] = expected.production.files['dist/css/style-1.min.css']
    delete expected.production.files['dist/css/style-1.min.css']
    expected.production.files['dist/css/style2.min.css'] = expected.production.files['dist/css/style-2.min.css']
    delete expected.production.files['dist/css/style-2.min.css']
    assert.propEqual(lessConf, expected)
})
//</editor-fold>

//<editor-fold desc="adds custom keys to final result" defaultstate="collapsed">
QUnit.test('adds custom keys to final result', assert => {
    const lessConf = ga('less', {
        filters: {
            result: (result) => {
                result.test = 'Hi!'
                return result
            }
        }
    })

    const expected = generateDefaultExpected()
    expected.test = 'Hi!'
    assert.propEqual(lessConf, expected)
})
//</editor-fold>