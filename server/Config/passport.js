const passport = require("passport");
const { User, ProfilePicture } = require("../Model/authModel");
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
        console.log("📥 Google profile received:", profile);

        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        console.log("⚙️ Creating new user...");

        // Define newUser in upper scope
        let newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          authType: "google",
        });

        console.log("Creating user with:", {
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          authType: 'google',
        });

        console.log("✅ New user created:", newUser);

        // Get photo URL
        const photoUrl =
          (profile.photos && profile.photos[0]?.value) ||
          profile._json?.picture;

        if (photoUrl) {
          console.log("✅ Using photo URL:", photoUrl);

          const profilePic = await ProfilePicture.create({
            userId: newUser._id,
            imageUrl: photoUrl,
            googleId: profile.id,
          });

          console.log("📸 Profile picture saved:", profilePic);

          // Link profile picture to user
          newUser.photo = profilePic._id;
          await newUser.save();

          console.log("🧾 User updated with profile pic.");
        } else {
          console.log("❌ No valid photo URL found.");
        }

        return done(null, newUser);
      } catch (err) {
        console.error("❌ Error in Google strategy:", err);
        return done(err, false);
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
