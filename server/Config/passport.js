const passport = require("passport");
const { User } = require("../Model/authModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/user/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {  
          console.log(profile)        
          const existingUser = await User.findOne({ email: profile.emails[0].value });
  
          if (existingUser) {
            return done(null, existingUser);
          }
  
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: null, // or handle conditionally
            authType: "google",
            googleId: profile.id,
            photo: profile.photos?.[0]?.value, // ✅ Store image URL
          });
  
          done(null, newUser);
        } catch (err) {
          done(err, false);
        }
      }
    )
  );
  

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});
