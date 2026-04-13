
import { NextRequest, NextResponse } from "next/server";


export function middleware (request : NextRequest) {
   const path = request.nextUrl.pathname;

   const publicPath = ["/api/auth" , "/signup"];
   const isPublic = publicPath.some((p)=> path.startsWith(p))
   const token = request.cookies.get("token")?.value
   if(isPublic && token){
    return NextResponse.redirect(new URL("/dashboard",request.nextUrl))
   }
   if(!isPublic && !token){
    return NextResponse.redirect(new URL("/api/auth/signin",request.nextUrl))
   }
   return NextResponse.next();
}


export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}