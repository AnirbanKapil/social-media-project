import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";


export const authOptions : NextAuthOptions = {
 providers: [
  CredentialsProvider({
    
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text", placeholder: "jsmith@mail.com" },
      username: { label: "Name", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password",}
    },
    async authorize(credentials : any) : Promise<any> {
      
      if(!credentials.email || !credentials.password || !credentials.username){
        throw new Error("All fields are required")
      };
      try {
        const user = await prisma.user.findFirst({
          where : {
            email : credentials.email,
            username : credentials.username
          }
        })
        if(!user){
          throw new Error("User not found")
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
secret : process.env.JWT_SECRET,
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
   }
},
session : {
        strategy : "jwt",
        maxAge : 30*24*60*60
    }, 
}

