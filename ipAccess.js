exports = module.exports = function ipAccess(addresses, allow){
  var _addresses = addresses instanceof Array ? addresses : ( addresses ? [addresses] : [] );
  allow = allow == null ? true : allow;
  return function(req, res, next) {
    if(_addresses.indexOf(req.connection.remoteAddress) > -1 == allow){
      next();
    }else{
      res.statusCode = 403;
      res.end('Forbidden');
    }
  }
};
