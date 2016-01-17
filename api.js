'use strict';

var CRYPTO = require('crypto');

function VersaApi(
  options
){
  
  if(!(this instanceof VersaApi)) return new VersaApi(options);
  
  options        = (typeof options === 'object')             ? options                  : {};
  this.algorithm = (typeof options.algorithm === 'string')   ? options.algorithm        : 'aes256';
  this.password  = (typeof options.password === 'undefined') ? CRYPTO.randomBytes(2048) : options.password;
  
  return this;
}

VersaApi.prototype.decrypt = function(
){
  
  return CRYPTO.createDecipher(this.algorithm,this.password.toString('binary'));
};

VersaApi.prototype.encrypt = function(
){
  
  return CRYPTO.createCipher(this.algorithm,this.password.toString('binary'));
};

module.exports = VersaApi;

