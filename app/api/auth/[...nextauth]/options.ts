import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";


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
      if(!credentials?.email || !credentials?.username || !credentials?.password){
        throw new Error("All fields are required")
      };
      
      const existingUser = await prisma.user.findUnique({
        where : {
          email : credentials.email
        }
      });
      if(existingUser){
        throw new Error("User already exist!")
      }

      const user = await prisma.user.create({
        data : {
             email : credentials.email,
             username : credentials.username,
             password : credentials.password
        }
      })
      console.log(user)
      if (user) {
        return user
      } else {
        return null

     
      }
    }
  })
],
secret : "secret",
callbacks : {},
}

