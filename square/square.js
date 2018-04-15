const matrix = require('../methods/matrix'),
    abstract = require('./abstract')

module.exports = {
    encode: function (data, pass) {
        let str = '',
            data_matrix = abstract.createMatrix(data),
            key_matrix = abstract.createMatrix(pass)

        function nonLinearTransformation(A) {
            γ = [[], [], [], []]
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    γ[i][j] = abstract.sBox[A[i][j]]
                }
            }
            return γ
        }

        function round(data_matrix_round, key_matrix_round) {
            data_matrix_round = matrix.MultiplyMatrixModulo2in8(abstract.CONST, data_matrix_round);
            data_matrix_round = nonLinearTransformation(data_matrix_round);
            data_matrix_round = matrix.TransMatrix(data_matrix_round);
            data_matrix_round = matrix.SumMatrixModulo2(data_matrix_round, key_matrix_round);

            return data_matrix_round;
        }

        data_matrix = matrix.MultiplyMatrixModulo2in8(
            matrix.Round(
                matrix.InverseMatrix(
                    abstract.CONST
                )
            ), data_matrix);
        data_matrix = matrix.SumMatrixModulo2(data_matrix, key_matrix);

        for (let i = 0; i < 8; i++) {
            key_matrix = abstract.createNewKey(key_matrix)
            data_matrix = round(data_matrix, key_matrix.slice(0))
        }

        console.log(data_matrix);
        for (let i = 0; i < data_matrix.length; i++) {
            for (let j = 0; j < data_matrix[i].length; j++) {
                str += String.fromCharCode(data_matrix[i][j])
            }
        }
        return str
    },

    decode: function (data, pass) {
        let str = '',
            data_matrix = abstract.createMatrix(data),
            key_matrix = abstract.createMatrix(pass),
            key = []

        function nonLinearTransformation(A) {
            γ = [[], [], [], []]
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    γ[i][j] = abstract.sBox.indexOf(A[i][j])
                }
            }
            return γ
        }

        function round(data_matrix_round, key_matrix_round) {
            data_matrix_round = matrix.MultiplyMatrixModulo2in8(
                matrix.Round(
                    matrix.InverseMatrix(
                        abstract.CONST
                    )
                ), data_matrix_round);
            data_matrix_round = nonLinearTransformation(data_matrix_round);
            data_matrix_round = matrix.TransMatrix(data_matrix_round);
            data_matrix_round = matrix.SumMatrixModulo2(data_matrix_round, key_matrix_round);

            return data_matrix_round;
        }

        key.push(key_matrix);
        for (let i = 0; i < 8; i++) {
            key_matrix = abstract.createNewKey(key_matrix)
            key.unshift(key_matrix);
        }

        data_matrix = matrix.MultiplyMatrixModulo2in8(abstract.CONST, data_matrix)
        data_matrix = matrix.SumMatrixModulo2(data_matrix, key[0]);

        for (let i = 0; i < 8; i++) {
            data_matrix = round(data_matrix, key[i + 1])
        }

        console.log(data_matrix)
        for (let i = 0; i < data_matrix.length; i++) {
            for (let j = 0; j < data_matrix[i].length; j++) {
                str += String.fromCharCode(data_matrix[i][j])
            }
        }
        return str
    }
}