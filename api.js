'use strict';

var CRYPTO = require('crypto');

function VersaApi(
  opts
){
  
  if(!(this instanceof VersaApi)) return new VersaApi(opts);
  
  var self = this;
  opts           = (typeof opts === 'object')           ? opts                     : {};
  self.padding   = (typeof opts.padding === 'number')   ? opts.padding             : 512;
  self.padding   = (self.padding >= 1)                  ? Math.floor(self.padding) : 0;
  self.size      = (typeof opts.size === 'number')      ? opts.size                : 2048;
  self.size      = (self.size >= 16)                    ? Math.floor(self.size)    : 16;
  self.algorithm = (typeof opts.algorithm === 'string') ? opts.algorithm           : 'aes-256-cbc';
  VersaApiPassword.call(self,opts);
  
  self.decrypt = function VersaApiDecrypt(
    data
  ){
    
    var decipher = CRYPTO.createDecipher(self.algorithm,self.password.toString('binary'));
    
    if(
      data === null
      ||
      data === undefined
    ){
      
      return decipher;
    }
    else{
      
      data = [decipher.update(data), decipher.final()];
      
      return Buffer.concat(data,data[0].length + data[1].length);
    }
  };
  
  self.encrypt = function VersaApiEncrypt(
    data
  ){
    
    var cipher = CRYPTO.createCipher(self.algorithm,self.password.toString('binary'));
    
    if(
      data === null
      ||
      data === undefined
    ){
      
      return cipher;
    }
    else{
      
      data = [cipher.update(data), cipher.final()];
      
      return Buffer.concat(data,data[0].length + data[1].length);
    }
  };
  
  self.hide = function VersaApiHide(
    data
  ){
    
    var bytes;
    var padding = (self.padding > 0) ? self.padding : 256;
    
    if(
      typeof data === 'string'
      ||
      Buffer.isBuffer(data)
      ||
      VersaApiIsBuffer(data)
    ){
      
      data    = new Buffer((VersaApiIsBuffer(data)) ? data.data : data);
      bytes   = new Buffer(data.length.toString() + "#");
      padding = new Buffer(CRYPTO.randomBytes((padding - ((data.length + bytes.length) % padding))))
      
      return self.encrypt(Buffer.concat([
        bytes,
        data,
        padding
      ],data.length + bytes.length + padding.length));
    }
    else return false;
  };
  
  self.profile = function VersaApiProfile(
  ){
    
    return {
      'algorithm': self.algorithm,
      'padding': self.padding,
      'password': self.password,
      'size': self.size
    };
  };
  
  self.show = function VersaApiShow(
    data
  ){
    
    var bytes;
    var index = 0;
    
    if(
      typeof data === 'string'
      ||
      Buffer.isBuffer(data)
      ||
      VersaApiIsBuffer(data)
    ){
      
      data = self.decrypt((VersaApiIsBuffer(data)) ? data.data : data);
      
      while(data.toString('utf-8',index,(index + 1)) !== "#") index++;
      
      bytes = parseFloat(data.slice(0,index));
      
      index++;
      
      if((data.length - index) < bytes) return false;
      
      return data.slice(index,(index + bytes));
    }
    else return false;
  };
  
  self.json = function VersaApiJson(
  ){
    
    return JSON.stringify(self.profile());
  };
  
  return self;
}

function VersaApiPassword(
  opts
){
  
  /* If the provided password is a
  // buffer, then make a copy of it.
  */
  if(Buffer.isBuffer(opts.password)) this.password = new Buffer(opts.password);
  
  /* If the provided password is from
  // a JSON parsed string, then make
  // a buffer out of it.
  */
  else if(VersaApiIsBuffer(opts.password)) this.password = new Buffer(opts.password.data);
  
  /* If the provided password is a
  // string, then make a copy of it.
  */
  else if(
    typeof opts.password === 'string'
    &&
    opts.password.length > 0
  ){
    
    this.password = opts.password.substring(0);
  }
  
  /* If the provided password met
  // none of the other conditions,
  // then create a random one.
  */
  else this.password = CRYPTO.randomBytes(this.size);
  
}

function VersaApiIsBuffer(
  data
){
  
  return (
    typeof data === 'object'
    &&
    data !== null
    &&
    typeof data.type === 'string'
    &&
    typeof data.data === 'object'
    &&
    data.type === 'Buffer'
    &&
    Array.isArray(data.data)
  );
}

module.exports = VersaApi;

