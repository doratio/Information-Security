const square = require('./square/square'),
    mode = require('./square/encryption_modes'),
    file = require('./methods/files')

var nonce = '89869055860'
pass = 'passwordpassword'

file.readActionWrite('./text.txt', './text-ECB.txt', function (text) {
    return mode.ECB(text, pass, square.encode)
}, 'utf8')

file.readActionWrite('./text-ECB.txt', './text-new1.txt', function (text) {
    return mode.ECB(text, pass, square.decode)
}, 'utf8')

file.readActionWrite('./text.txt', './text-CTR.txt', function (text) {
    return mode.CTR(text, pass, nonce, square.encode).slice(0, text.length)
}, 'utf8')

file.readActionWrite('./text-CTR.txt', './text-new2.txt', function (text) {
    return mode.CTR(text, pass, nonce, square.encode).slice(0, text.length)
}, 'utf8')