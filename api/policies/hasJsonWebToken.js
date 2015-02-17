'use strict';
/* jshint unused:false */

/**
 * hasJsonWebToken
 *
 * @module      :: Policy
 * @description :: Assumes that your request has an jwt;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */
module.exports = function(req, res, next) {

  var errorCallback = function(err, user){
    if(err){
      return res.forbidden(err);
    }

    // valid request

  };


  var token = req.headers.authorization;
  token = token.substring(8,token.length);

  if(token){

    // validate the token
    waterlock.validator.validateToken(token, function(err, user){
      if(err){
        waterlock.logger.debug(err);
        return errorCallback(err);
      }

      // check if we're running in stateless
      if(!waterlock.config.jsonWebTokens.stateless){
        waterlock.validator.bindToSession(req, user);
      }

      // check if we're tracking usage
      if(waterlock.config.jsonWebTokens.trackUsage){
        var address = waterlock.cycle._addressFromRequest(req);
        return waterlock.validator.trackTokenUsage(address, token, user, errorCallback);
      }

      waterlock.logger.debug('access token accepted');
      errorCallback(null, user);
    });
    next();
  }else{
    waterlock.logger.debug('no access token present');
    errorCallback('Access token not present.');
  }

};
