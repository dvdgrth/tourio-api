const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const jwtExtractor = require("passport-jwt").ExtractJwt;
const User = require("./models/User");

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: jwtExtractor.fromAuthHeaderAsBearerToken(),
    },
    function (jwt_payload, done) {
      User.findById({ _id: jwt_payload.sub }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      });
    }
  )
);

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.refreshToken;
  }
  return token;
};

passport.use(
  "refreshTokenStrategy",
  new JwtStrategy(
    {
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      jwtFromRequest: cookieExtractor,
    },
    function (jwt_payload, done) {
      User.findById({ _id: jwt_payload.sub }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          if (user.revoked == true) {
            return done(null, false);
          }
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

module.exports = passport;
