'use strict';

var CRYPTO = require('crypto');
var FS     = require('fs');
var VERSA  = require('./');
var plainFile     = './Versa.test.file';
var encryptedFile = './Versa.test.file.encrypted';

function throwError(
  message
){
  
  throw new Error((Array.isArray(message)) ? message.join('\n') : message);
  
  process.exit(1);
}

if(typeof Buffer.isBuffer !== 'function') throwError('Buffer.isBuffer is not a function!');

var profile  = {"algorithm":"aes-256-cbc","padding":512,"password":"profileA's password","size":2048};
var profileA = VERSA(profile);
var profileB = VERSA(profile);
var profileC = VERSA();

FS.writeFileSync(plainFile,JSON.stringify(profile));

FS.createReadStream(plainFile)
.on('error',throwError)
.pipe(profileA.encrypt())
.pipe(FS.createWriteStream(encryptedFile))
.on('finish',function(){
  
  var decrypted = "";
  
  if(FS.readFileSync(encryptedFile,'base64') !== 'QSeKGw7GUmPecH+hrZJpYFIrWC+zUcV/A/c/esLwJoIJ865bK1byWEb1jM4vJ+uKY5HEwPQi05HOPPWBa2TKah32Z0z86ZnB9CbGbDusbovow/wO4ca18ta+cW8c+5Fr') throwError('Pipe encryption mismatches!');
  
  console.log('Pipe encryption matches!');
  
  FS.createReadStream(encryptedFile)
  .on('error',throwError)
  .pipe(profileB.decrypt())
  .on('data',function(data){ decrypted += data.toString('binary'); })
  .on('finish',function(){
    
    if(decrypted !== profileA.json()) throwError('ProfileA mismatches!');
    
    console.log('ProfileA matches!');
    
    if(decrypted !== profileB.json()) throwError('ProfileB mismatches!');
    
    console.log('ProfileB matches!');
    
    if(JSON.stringify(profileA.profile()) !== JSON.stringify(profileB.profile())) throwError('Profile mismatches!');
    
    console.log('Profiles matches!');
    
    var testBuffer  = CRYPTO.randomBytes(1024);
    var testEncrypt = profileC.encrypt(testBuffer);
    var testHide    = profileC.hide(testBuffer);
    
    if(testEncrypt.length !== 1040) throwError('ProfileC encrypt mismatch!');
    
    console.log('ProfileC encrypt matches!');
    
    if(testHide.length !== 1552) throwError('ProfileC hide mismatch!');
    
    console.log('ProfileC hide matches!');
    
    if(!(testBuffer.equals(profileC.decrypt(testEncrypt)))) throwError('ProfileC decrypt mismatch!');
    
    console.log('ProfileC decrypt matches!');
    
    if(!(testBuffer.equals(profileC.show(testHide)))) throwError('ProfileC show mismatch!');
    
    console.log('ProfileC show matches!');
    
    FS.unlinkSync(plainFile);
    FS.unlinkSync(encryptedFile);
    
    console.log('Done!');
  });
});

