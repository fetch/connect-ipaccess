/*
 * Connect Middleware for IP address validation
 *
 * Build by Koen Punt for Fetch! (http://www.fetch.nl)
 */

var pause = require('pause');
(function(exports){

  "use strict"; // jshint ;_;

  function ipAccess(addresses, allow, callback) {
    var _addresses = addresses instanceof Array ? addresses : ( addresses ? [addresses] : [] );
    allow = allow == null ? true : allow;
    callback = callback == null ? function(req, res){
      return allow;
    } : callback;

    function forbidden(res){
      res.statusCode = 403;
      res.end('Forbidden');
    }

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
      if (_addresses.indexOf( getClientIp(req) ) > -1 == allow) {
        next();
      } else {
        // async
        if (callback.length >= 3) {
          var wait = pause(req);
          callback(req, res, function(err){
            if (err) return forbidden(res);
            next();
            wait.resume();
          });
        // sync
        } else {
          if (callback(req, res)) {
            next();
          } else {
            return forbidden(res);
          }
        }
      }
    }
  };
})();