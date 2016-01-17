# versa

*Module to provide encryption/decryption profiles.*

[![Build Status](https://travis-ci.org/METACEO/nodejs.versa.svg)](https://travis-ci.org/METACEO/nodejs.versa)
[![Dependency Status](https://david-dm.org/metaceo/nodejs.versa.svg)](https://david-dm.org/metaceo/nodejs.versa)

```
npm install versa
```

## Usage

### Programmatically

**Encryption/Decryption Profiles**
```javascript
var Versa = require("versa");

/* If you don't set any options (you don't
// have to,) then Versa will fill in what's
// necessary. Versa-generated passwords are
// 2048 bytes long using the randomBytes
// method of the native Crypto module. Whether
// you specify the profile or not, be sure to
// back it up for future use!
*/
console.log(new Versa());
// { algorithm: 'aes256',
//   password: <Buffer 8f 35 a0 40 ... > }

console.log(new Versa({"algorithm":"aes128"}));
// { algorithm: 'aes128',
//   password: <Buffer f5 d4 01 97 ... > }

console.log(new Versa({"algorithm":"aes256","password":"my application's secret code"}));
// { algorithm: 'aes256',
//   password: 'my application\'s secret code' }
```

**Pipe Example**

```javascript
var FS       = require("fs");
var Versa    = require("versa");
var resource = new Versa();

/* Here's a simple pipe example, something like
// you'd use with the native Crypto module. Once
// the pipe is done, we save the encryption/
// decryption profile. We won't worry about the
// password used to encrypt/decrypt, we backup
// it and its algorithm up somewhere where we
// can access later. This example writes the
// profile locally (alongside the encrypted file)
// but you can save it wherever is secure for
// you and your application.
*/
FS.createReadStream("LICENSE")
.pipe(resource.encrypt())
.pipe(FS.createWriteStream("LICENSE.encrypted"))
.on("finish",function(){
  
  FS.writeFileSync("LICENSE.encrypted.profile",JSON.stringify(resource));
});
```
