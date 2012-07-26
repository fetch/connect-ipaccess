exports = module.exports = function ipAccess(addresses, allow){
  var _addresses = addresses instanceof Array ? addresses : ( addresses ? [addresses] : [] );
  allow = allow == null ? true : allow;

  // From: http://catapulty.tumblr.com/post/8303749793/heroku-and-node-js-how-to-get-the-client-ip-address
  function getClientIp(req) {
    var ipAddress;
    // Amazon EC2 / Heroku workaround to get real client IP
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
      // 'x-forwarded-for' header may return multiple IP addresses in
      // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
      // the first one
      var forwardedIps = forwardedIpsStr.split(',');
      ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
      // Ensure getting client IP address still works in
      // development environment
      ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
  };

  return function(req, res, next) {
    if(_addresses.indexOf( getClientIp(req) ) > -1 == allow){
      next();
    }else{
      res.statusCode = 403;
      res.end('Forbidden');
    }
  }
};
