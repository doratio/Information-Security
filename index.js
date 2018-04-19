const square = require('./square/square')

str = "i said Hello!!!!"
key = "passwordpassword"

data = square.encode(str, key);
console.log(data)
console.log()
data = square.decode(data, key);
console.log(data)
