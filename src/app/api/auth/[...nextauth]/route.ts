import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../../models/userModel";
import { connect } from "../../../../dbConfig/dbConfig";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {

          await connect();
          
          let existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            existingUser = new User({
              fullName: user.name,
              email: user.email,
              googleId: account.providerAccountId, 
              mobileNumber: "Not Provided", 
              password: "GoogleOAuth",
            });
            
            await existingUser.save();
            console.log("New Google user saved!");
          }
  
          return true;
        } catch (error) {
          console.error("Error while creating user:", error);
          throw new Error("Error while creating user");
        }
      }
      return true;
    },
  },  
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
