const matrix = require('../methods/matrix'),
    abstract = require('./abstract')

module.exports = {
    encode: function (data, pass) {
        let data_matrix = (Array.isArray(data)) ? data : abstract.createMatrix(data),
            key_matrix = (Array.isArray(pass)) ? pass : abstract.createMatrix(pass)

        function nonLinearTransformation(A) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    A[i][j] = abstract.sBox[A[i][j]]
                }
            }
            return A
        }

        function round(data_matrix_round, key_matrix_round) {
            data_matrix_round = matrix.MultiplyMatrixGF256(abstract.CONST, data_matrix_round);
            data_matrix_round = nonLinearTransformation(data_matrix_round);
            data_matrix_round = matrix.TransMatrix(data_matrix_round);
            data_matrix_round = matrix.SumMatrixModulo2(data_matrix_round, key_matrix_round);
            return data_matrix_round;
        }

        data_matrix = matrix.MultiplyMatrixGF256(abstract.CONST_1, data_matrix);
        data_matrix = matrix.SumMatrixModulo2(data_matrix, key_matrix);
        for (let i = 0; i < 8; i++) {
            key_matrix = abstract.createNewKey(key_matrix)
            data_matrix = round(data_matrix, key_matrix)
        }

        return data_matrix
    },

    decode: function (data, pass) {
        let data_matrix = (Array.isArray(data)) ? data : abstract.createMatrix(data),
            key_matrix = (Array.isArray(pass)) ? pass : abstract.createMatrix(pass),
            key = [];

        function nonLinearTransformation(A) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    A[i][j] = abstract.sBox.indexOf(A[i][j])
                }
            }
            return A
        }

        function round(data_matrix_round, key_matrix_round) {
            data_matrix_round = matrix.SumMatrixModulo2(data_matrix_round, key_matrix_round);
            data_matrix_round = matrix.TransMatrix(data_matrix_round);
            data_matrix_round = nonLinearTransformation(data_matrix_round);
            data_matrix_round = matrix.MultiplyMatrixGF256(abstract.CONST_1, data_matrix_round);
            return data_matrix_round;
        }

        key[0] = key_matrix
        for (let i = 0; i < 8; i++) {
            key[i + 1] = abstract.createNewKey(key[i])
        }

        for (let i = 8; i > 0; i--) {
            data_matrix = round(data_matrix, key[i])
        }

        data_matrix = matrix.SumMatrixModulo2(data_matrix, key[0]);
        data_matrix = matrix.MultiplyMatrixGF256(abstract.CONST, data_matrix)

        return data_matrix;
    }
}