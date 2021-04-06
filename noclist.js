const axios = require('axios');
const utf8 = require('utf8');
const eol = require('eol');
const sha256 = require("sha256");
var CryptoJS = require("crypto-js");
var rfc2047 = require('rfc2047');
async function prueba(url,headers, max_intentos=3) {
    var intentos = 0;
    while  (intentos < max_intentos) {
        intentos += 1
        response = await axios
        .get(url, {headers})
        .then(res => {
            //console.log('res.data>> ' + typeof res.data);
           return res.data.split("\n");
        })
        .catch(error => {
         console.error(error);
        });
    if (response)
    return response;
    }
}
async function g_token(url) {
    return await axios
    .get(url + '/auth')
    .then(res => {
        var token = res.headers['badsec-authentication-token']
        //console.log('g_token >>> ' + token);
        return token
    })
    .catch(error => {
      console.error(1);
    });
}
async function g_checksum(token) {
    var encoded = await rfc2047.encode(token + '/users');
    //console.log('encode>> '  + encoded);
    var checksum = await sha256(encoded);
    //console.log('g_checksum_sha256 >>> ' + checksum);
    //console.log('g_checksum >>> ' + CryptoJS.enc.Hex.parse(checksum));
    return CryptoJS.enc.Hex.parse(checksum);
}

async function u_ids(url,checksum) {
    response = await prueba(url + '/users',{'X-Request-Checksum': checksum});
    //console.log('u_ids1>> ' + response);
    //console.log('u_ids2>> ' + rfc2047.decode(response));
    return rfc2047.decode(response);
}
async function badsec(url) {
    var token = await g_token(url);
    var checksum = await g_checksum(token);
    var users = await u_ids(url, checksum);
    console.log(JSON.stringify(users));
}
badsec('http://127.0.0.1:8888')
