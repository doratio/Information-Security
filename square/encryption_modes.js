const matrix = require('../methods/matrix'),
    abstract = require('./abstract')

module.exports = {
    //Electronic Code Book
    ECB: function (data, key, cipher) {
        let ciphertext = '';
        for (let count = 0; count < data.length; count += 16) {
            let dataBlock = abstract.createMatrix(data.slice(count, count + 16)),
                keyBlock = abstract.createMatrix(key),
                cipherBlock

            cipherBlock = cipher(dataBlock, keyBlock);
            ciphertext += abstract.matrixToString(cipherBlock)
        }
        return ciphertext
    },

    //counter_mode
    CTR: function (data, key, nonce, cipher) {
        var ciphertext = '';
        for (let count = 0; count < data.length; count += 16) {
            let countBlock = abstract.createMatrix(nonce + (count + 1)),
                dataBlock = abstract.createMatrix(data.slice(count, count + 16)),
                keyBlock = abstract.createMatrix(key),
                cipherBlock

            cipherBlock = cipher(countBlock, keyBlock);
            cipherBlock = matrix.SumMatrixModulo2(dataBlock, cipherBlock)
            ciphertext += abstract.matrixToString(cipherBlock)
        }
        return ciphertext
    }
}