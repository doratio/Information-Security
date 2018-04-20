const {encode, decode} = require('../square/square'),
    {ECB} = require('../square/encryption_modes'),
    fs = require('fs'),
    unit = require('fs')