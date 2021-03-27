/* eslint-disable no-multi-spaces */
const exec = require('child_process').exec
const SSL_PATH = './generateCert/cert/'
const KEY_SIZE  = 2048
const EXPIRATION_DAYS = 365

function generateCert() {
  
  /**
   * openssl genrsa -out server-key.pem 1024
     openssl req -new -key server-key.pem -out server-csr.pem
     openssl x509 -req -in server-csr.pem -signkey server-key.pem -out server-cert.pem
   */
  exec('openssl genrsa -out ' + SSL_PATH + 'generated-key.pem ' + KEY_SIZE,
    {shell: '/bin/sh'},
    (err, stdout, stderr) => {
      if (err) {
        console.log((new Date()).toISOString() + ' unable to generate keys ' + err)
      } else {
        console.log((new Date()).toISOString() + ' keys generated successfully', stdout)
        exec('openssl req -new -x509 -key ' + SSL_PATH + 'generated-key.pem -out ' + SSL_PATH + 'generated-cert.pem -days ' + EXPIRATION_DAYS + ' -subj /CN=localhost',
            {shell: '/bin/sh'},
            (err, stdout, stderr) => {
                err ? console.log((new Date()).toISOString() + ' unable to generated certificate ' + err, stderr) :
                      console.log((new Date()).toISOString() + ' certificate generated successfully ', stdout)
            })
      }
    })
}

module.exports = {
  generateCert: generateCert,
  SSL_PATH: SSL_PATH
}