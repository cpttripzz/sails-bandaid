/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {
  connection: 'localMysqlServer',
  attributes: {

    username: {
      type: "string",
      required: true,
      unique: true,
      minLength: 6
    },
    password: {
      type: "string",
      required: true
    },
    email: {
      type: "email",
      required: "true",
      unique: true
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  validPassword: function(password, user, cb) {
    var bcrypt = require('bcrypt');
    bcrypt.compare(password, user.password, function(err, match) {
      if (err) cb(err);

      if (match) {
        cb(null, true);
      } else {
        cb(err);
      }
    });
  },
  beforeCreate: function (attrs, next) {
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(attrs.password, salt, function(err, hash) {
        if (err) return next(err);

        attrs.password = hash;
        next();
      });
    });
  }
};
