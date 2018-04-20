const fs = require('fs')

module.exports.readActionWrite = function (fromPath, toPath, action, character_encoding) {
    let data

    data = fs.readFileSync(fromPath, character_encoding);
    data = action(data)
    fs.writeFileSync(toPath, data, character_encoding)
};