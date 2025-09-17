import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../models/user'; 


passport.serializeUser((user: any, done) => {
  done(null, { id: user.id }); // Ensure `id` is included
});

passport.deserializeUser(async (user: any, done) => {
  try {
    const fullUser = await UserModel.findById(user.id);
    done(null, fullUser);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback', 
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;
      const email = emails?.[0].value;

      if (!email) {
        return done(new Error('Email not found in Google profile.'), false);
      }

      try {
        let user = await UserModel.findByGoogleId(id);

        if (!user) {
          user = await UserModel.create({
            googleId: id,
            name: displayName,
            email: email,
          });
        }
        
        return done(null, user);

      } catch (err) {
        return done(err, false);
      }
    }
  )
);