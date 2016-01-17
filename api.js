'use strict';

var CRYPTO = require('crypto');

function VersaApi(
  opts
){
  
  if(!(this instanceof VersaApi)) return new VersaApi(opts);
  
  var self = this;
  opts           = (typeof opts === 'object')             ? opts                          : {};
  self.size      = (typeof opts.size === 'number')        ? opts.size                     : 2048;
  self.size      = (self.size >= 16)                      ? Math.floor(self.size)         : 16;
  self.algorithm = (typeof opts.algorithm === 'string')   ? opts.algorithm                : 'aes256';
  self.password  = (typeof opts.password === 'undefined') ? CRYPTO.randomBytes(opts.size) : opts.password;
  
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

