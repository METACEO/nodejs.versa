'use strict';

var FS    = require('fs');
var VERSA = require('./');
var plainFile     = './Versa.test.file';
var encryptedFile = './Versa.test.file.encrypted';

var profile  = {'algorithm':'aes256','password':'profileA\'s password'};
var profileA = VERSA(profile);
var profileB = VERSA(profile);

FS.writeFileSync(plainFile,JSON.stringify(profile));

FS.createReadStream(plainFile)
.on('error',function(error){ throw new Error(error); })
.pipe(profileA.encrypt())
.pipe(FS.createWriteStream(encryptedFile))
.on('finish',function(){
  
  var decrypted = "";
  
  if(FS.readFileSync(encryptedFile,'base64') !== 'QSeKGw7GUmPecH+hrZJpYIuQgt160+/jPnWE0FkgiDPmDqLXKTjj7gfu021l7qcirE7/ub+8Dgr0k//Zm4xP1g==') throw new Error('Pipe encryption mismatches!.');
  
  console.log('Pipe encryption matches!');
  
  FS.createReadStream(encryptedFile)
  .on('error',function(error){ throw new Error(error); })
  .pipe(profileB.decrypt())
  .on('data',function(data){ decrypted += data.toString('binary'); })
  .on('finish',function(){
    
    if(decrypted !== JSON.stringify(profileA)) throw new Error('ProfileA mismatches!');
    
    console.log('ProfileA matches!');
    
    if(decrypted !== JSON.stringify(profileB)) throw new Error('ProfileB mismatches!');
    
    console.log('ProfileB matches!');
    
    FS.unlinkSync(plainFile);
    FS.unlinkSync(encryptedFile);
    
    console.log('Done!');
  });
});

