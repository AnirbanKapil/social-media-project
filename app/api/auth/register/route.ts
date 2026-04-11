import prisma from "@/lib/prisma";
import { NextRequest , NextResponse } from "next/server";
import bcrypt from "bcryptjs"


export async function POST (req : NextRequest) {
    
   try {
     const {username,email,password} = await req.json();
     if(!username.trim() || !email.trim() || !password.trim()){
         throw new Error("All fields are required")
     }
 
     const existingUser = await prisma.user.findUnique({
         where : {
             email
         }
     });
     if(existingUser){
         throw new Error("Email already exist")
     };
     
     const hashedPassword = await bcrypt.hash(password,10)
     
     await prisma.user.create({
         data : {
             username,
             password : hashedPassword,
             email
         }
     });
 
     return NextResponse.json({
         message : "User created successfully!!",
         status : 200
     })
   } catch (error) {
         console.log(error)
         return NextResponse.json({
            Message : "Error in registering",
            status : 501
         })
   }
}