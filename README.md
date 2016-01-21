# versa

*Module to provide encryption/decryption profiles.*

[![Build Status](https://travis-ci.org/METACEO/nodejs.versa.svg)](https://travis-ci.org/METACEO/nodejs.versa)
[![Dependency Status](https://david-dm.org/metaceo/nodejs.versa.svg)](https://david-dm.org/metaceo/nodejs.versa)

```
npm install versa
```

## Usage

### Programmatically

**Encryption/Decryption Profile Examples**

```javascript
var Versa = require("versa");

/* If you don't set any options (you don't
// have to,) then Versa will fill in what's
// necessary. Versa-generated passwords are
// 2048 bytes long using the randomBytes
// method of the native Crypto module (unless
// you specify the 'size', the minimum is 16
// bits in size with no ceiling limit.)
// Whether you specify the profile or not,
// be sure to back it up for future use!
*/
console.log(new Versa());
// AES256 with 2048-bit password:
// { algorithm: 'aes256',
//   password: <Buffer 8f 35 a0 40 ... > }

console.log(new Versa({"algorithm":"aes128"}));
// AES128 with 2048-bit password:
// { algorithm: 'aes128',
//   password: <Buffer f5 d4 01 97 ... > }

console.log(new Versa({"size":1337}));
// AES256 with 1337-bit password:
// { algorithm: 'aes256',
//   password: <Buffer 28 cf 03 6b ... > }

console.log(new Versa({"size":15}));
// AES256 with 16-bit password:
// { algorithm: 'aes256',
//   password: <Buffer bc 99 fa 4b ... > }

console.log(new Versa({"password":"my application's secret code"}));
// AES256 with a String password:
// { algorithm: 'aes256',
//   password: 'my application\'s secret code' }

console.log(new Versa({"password":new Buffer("my application's secret code")}));
// AES256 with a Buffer password:
// { algorithm: 'aes256',
//   password: <Buffer 6d 79 20 61 ... > }

console.log(new Versa({"password":{"type":"Buffer","data":[109,121,32,97]}}));
// AES256 with a JSON-parsed Buffer password:
// { algorithm: 'aes256',
//   password: <Buffer 6d 79 20 61 > }
```

**Padding Examples**

```javascript
var Versa = require("versa");

/* Using modulus, further obscure your encrypted
// payloads by increasing their byte lengths toward
// an incremented amount. Versa will serialize your
// message within a larger-looking payload of junk
// bytes from Crypto's randomBytes method. When
// decrypting, Versa will parse out and return your
// original message. Because of the serialization and
// parsing approaches, Versa will only decrypt it's
// own encrypted payloads.
*/

var note    = new Versa();
var message = "Hey!.. here's some information!";

var encrypted = note.encrypt(message);
// This results with a 32-bit encrypted buffer. While
// it is encrypted, it can be guessed that the message
// is small.
//   <Buffer f6 aa 95 19 ... >

var hidden = note.hide(message);
// This results with a 528-bit encrypted buffer. Unlike
// 'encrypted' above, it eliminates the ability to guess
// the size or scale of the original message.
//   <Buffer 3d 7f 2a 7a ... >

console.log('%s',note.decrypt(encrypted)); // Hey!.. here's some information!
console.log('%s',note.show(hidden));       // Hey!.. here's some information!
// Both the above decrypt back to the original message,
// but by "hiding" the message, the two instead look
// unrelated.
```

**Pipe Examples**

```javascript
var FS       = require("fs");
var Versa    = require("./");
var resource = new Versa();

/* Here's a simple pipe example, something like
// you'd use with the native Crypto module. Once
// the pipe is done, we save the encryption/
// decryption profile. We won't worry about the
// password used to encrypt/decrypt, we back it
// and its algorithm up somewhere where we can
// access them later. This example writes the
// profile locally (alongside the encrypted file)
// but you can save it wherever is secure for
// you and your application.
*/
FS.createReadStream("LICENSE")
.pipe(resource.encrypt())
.pipe(FS.createWriteStream("LICENSE.encrypted"))
.on("finish",function(){
  
  FS.writeFileSync("LICENSE.encrypted.profile",resource.json());
  
  console.log("Encrypted!");
  
  /* We'll simulate, as in some other application,
  // loading the profile of what we encrypted the
  // license with to decrypt it back. In most cases,
  // if not all, our profile won't be alongside our
  // plaintext or encrypted file, imagine we've
  // loaded back our profile and we need the license
  // next.
  */
  FS.createReadStream("LICENSE.encrypted")
  .pipe(new Versa(JSON.parse(FS.readFileSync("LICENSE.encrypted.profile"))).decrypt())
  .pipe(FS.createWriteStream("LICENSE.decrypted"))
  .on("finish",function(){
    
    console.log("Decrypted!");
    
    FS.unlinkSync("LICENSE.encrypted");
    FS.unlinkSync("LICENSE.encrypted.profile");
    
    console.log("Cleaned up!");
  });
});
```
