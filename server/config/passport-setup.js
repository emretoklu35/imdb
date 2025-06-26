const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../database");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (user) {
          return done(null, user);
        } else {
          user = await User.findOne({
            where: { email: profile.emails[0].value },
          });

          if (user) {
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          }

          const newUser = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            firstName:
              profile.name.givenName || profile.emails[0].value.split("@")[0],
            lastName: profile.name.familyName || "(Google User)",
            password: Math.random().toString(36).slice(-8),
            country: "Unknown",
            city: "Unknown",
          });
          return done(null, newUser);
        }
      } catch (err) {
        console.error("Google Strategy Error:", err);
        return done(err);
      }
    }
  )
);
