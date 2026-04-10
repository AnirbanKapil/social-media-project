import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions : NextAuthOptions = {
 providers: [
  CredentialsProvider({
    
    name: "Credentials",
    credentials: {
      username: { label: "Email", type: "text", placeholder: "jsmith@mail.com" },
      password: { label: "Password", type: "password",}
    },
    async authorize(credentials, req) {
      
      const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

      if (user) {
        return user
      } else {
        return null

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      }
    }
  })
]
}

