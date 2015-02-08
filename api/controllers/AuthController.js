/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: Provides the base authentication
 */

module.exports = {
  authenticate: function(req, res) {
    var username = req.param('username');
    var password = req.param('password');

    if ( !username || !password ) {
      return res.json(401, {err: 'username and password required'});
    }

    User.findOneByUsername(username, function(err, user) {
      if (!user) {
        return res.json(401, {err: 'invalid username or password'});
      }

      User.validPassword(password, user, function(err, valid) {
        if (err) {
          return res.json(403, {err: 'forbidden'});
        }

        if (!valid) {
          return res.json(401, {err: 'invalid username or password'});
        } else {
          res.json({user: user.toJSON(), token: jwtToken.issueToken(user.id)});
        }
      });
    })
  },
  register: function(req, res) {

    User.create({username: req.body.username,  password: req.body.password, email: req.body.email}).exec(function(err, user) {
      if (err) {
        res.json(err.status, {err: err});
        return;
      }
      if (user) {
        res.json({user: user, token: jwtToken.issueToken(user.id)});
      }
    });
  }
};