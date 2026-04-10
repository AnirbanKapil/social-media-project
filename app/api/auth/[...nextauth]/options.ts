import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


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
      if(!credentials) return null;
      const user = { id : 1 , email : credentials.email , username : credentials.username  }
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

