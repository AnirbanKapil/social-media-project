
import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
    function middleware () {
        return NextResponse.next()
    },
      {
        pages: {
        signIn: "/src/pages/signup", // 👈 change redirect here
        },
        callbacks : {
            authorized : ({token,req}) => {
                 const {pathname} = req.nextUrl;
                 
                //  auth related routes
                 if(
                    pathname.startsWith("/api/auth") ||
                    pathname === "/signin" ||
                    pathname === "/src/pages/signup"
                ){
                    return true
                 }

                //  public routes
                if(pathname === "/"){
                    return true
                }

                return !!token
            }
        }
    }
) 


export const config = {
    matcher : [ "/((?!_next/static|_next/image|favicon.ico|public/).*)",]
}