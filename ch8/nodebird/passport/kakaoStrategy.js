const KakaoStrategy = require('passport-kakao').Strategy;
const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    clientID: 'c7a191568b2209e54a0cabe514fcbabf',
    callbackURL: '/auth/kakao/callback',
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    console.log(profile);
    try {
      const exUser = await User.find({ where: { snsId: profile.id, provider: 'kakao' } });
      if (exUser) {
        done(null, exUser);
      } else {
        const result = await User.create({
          email: profile._json && profile._json.kaccount_email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, exUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
