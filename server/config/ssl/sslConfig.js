var fs = require('fs');

var options = {
    key: fs.readFileSync('./config/ssl/privatekey.pem'/*,'utf-8'*/),
    cert: fs.readFileSync('./config/ssl/certificate.crt'/*,'utf-8'*/)
};

module.exports = options;