import { v2 as cloudinary } from "cloudinary"
import { NextRequest, NextResponse } from "next/server";


cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
}


export async function POST (request : NextRequest) {
       
       if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_SECRET){
             return NextResponse.json(
                {error : "Cloudinary credentials not found"},
                {status : 500}
            )
       }

       try {
         const formData = request.formData();
         const file = (await formData).get("file") as File || null;
         if(!file){
            return NextResponse.json(
                {error : "Image file not found"},
                {status : 401}
            )
         } 
       } catch (error) {
          console.log("error msg -",error)
          return NextResponse.json(
            {error : "Error uploading image on cloudinary"},
            {status : 400})
       }
}