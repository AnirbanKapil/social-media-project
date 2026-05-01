import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";


export const authOptions : NextAuthOptions = {
 providers: [
  GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text", placeholder: "jsmith@mail.com" },
      username: { label: "Name", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password",}
    },
    async authorize(credentials : any) : Promise<any> {
      if(!credentials.email || !credentials.password){
        throw new Error("Email and password are required")
      };
      try {
        const user = await prisma.user.findFirst({
          where : {
            email : credentials.email,
          }
        })
        if(!user){
          throw new Error("No user found with this email")
        }

        if (!user.password) {
           throw new Error("Please sign in with Google");
           }

        const isValid = await bcrypt.compare(credentials?.password,user?.password)

        if(!isValid){
          throw new Error("Password incorrect")
        }
        return {
          id : user.id.toString(),
          email : user.email,
          username : user.username
        }
      } catch (error) {
        throw error
      }
    }
  })
],
secret : process.env.NEXTAUTH_SECRET,
callbacks : {
   async jwt ({token,user}) {
      if(user){
        token.id = user.id
      }
      return token;
   },
   async session ({session,token} : any) {
      if(session.user){
        session.user.id = token.id as string
      }
      return session;
   },
   async signIn({ user, account }) {
      if (account?.provider === "google") {
      const existingUser = await prisma.user.findUnique({
      where: { email: user.email! },
       });

      if (existingUser) {
      await prisma.user.update({
        where: { email: user.email! },
        data: { profileImgUrl: user.image },
      });
      return true;
      }

    
      let baseUsername = user.name?.replace(/\s+/g, "").toLowerCase() || "user";
      let finalUsername = baseUsername;

      const usernameExists = await prisma.user.findFirst({
      where: { username: baseUsername },
      });

      if (usernameExists) {
      const suffix = Math.random().toString(36).substring(2, 6);
      finalUsername = `${baseUsername}_${suffix}`;
      }

      await prisma.user.create({
      data: {
        email: user.email!,
        username: finalUsername,
        profileImgUrl: user.image,
      },
    });
  }
  return true;
},

},
session : {
        strategy : "jwt",
        maxAge : 30*24*60*60
    }, 
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };