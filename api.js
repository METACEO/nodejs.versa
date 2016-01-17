'use strict';

var CRYPTO = require('crypto');

function VersaApi(
  opts
){
  
  if(!(this instanceof VersaApi)) return new VersaApi(opts);
  
  opts           = (typeof opts === 'object')             ? opts                          : {};
  this.size      = (typeof opts.size === 'number')        ? opts.size                     : 2048;
  this.size      = (this.size >= 16)                      ? Math.floor(this.size)         : 16;
  this.algorithm = (typeof opts.algorithm === 'string')   ? opts.algorithm                : 'aes256';
  this.password  = (typeof opts.password === 'undefined') ? CRYPTO.randomBytes(opts.size) : opts.password;
  
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

