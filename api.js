'use strict';

var CRYPTO = require('crypto');

function VersaApi(
  opts
){
  
  if(!(this instanceof VersaApi)) return new VersaApi(opts);
  
  var self = this;
  opts           = (typeof opts === 'object')           ? opts                  : {};
  self.size      = (typeof opts.size === 'number')      ? opts.size             : 2048;
  self.size      = (self.size >= 16)                    ? Math.floor(self.size) : 16;
  self.algorithm = (typeof opts.algorithm === 'string') ? opts.algorithm        : 'aes256';
  
  /* If the provided password is a
  // buffer, then make a copy of it.
  */
  if(Buffer.isBuffer(opts.password)) self.password = new Buffer(opts.password);
  
  /* If the provided password is from
  // a JSON parsed string, then make
  // a buffer out of it.
  */
  else if(
    typeof opts.password === 'object'
    &&
    opts.password !== null
    &&
    typeof opts.password.type === 'string'
    &&
    typeof opts.password.data === 'object'
    &&
    opts.password.type === 'Buffer'
    &&
    Array.isArray(opts.password.data)
  ){
    
    self.password = new Buffer(opts.password.data);
  }
  
  /* If the provided password is a
  // string, then make a copy of it.
  */
  else if(
    typeof opts.password === 'string'
    &&
    opts.password.length > 0
  ){
    
    self.password = opts.password.substring(0);
  }
  
  /* If the provided password met
  // none of the other conditions,
  // then create a random one.
  */
  else self.password = CRYPTO.randomBytes(self.size);
  
  self.decrypt = function VersaApiDecrypt(
  ){
    
    return CRYPTO.createDecipher(self.algorithm,self.password.toString('binary'));
  };
  
  self.encrypt = function VersaApiEncrypt(
  ){
    
    return CRYPTO.createCipher(self.algorithm,self.password.toString('binary'));
  };
  
  self.profile = function VersaApiProfile(
  ){
    
    return {
      'algorithm': self.algorithm,
      'password': self.password,
      'size': self.size
    };
  }
  
  self.json = function VersaApiJson(
  ){
    
    return JSON.stringify(self.profile());
  }
  
  return self;
}

module.exports = VersaApi;

