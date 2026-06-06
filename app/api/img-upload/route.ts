import { v2 as cloudinary } from "cloudinary"
import { NextRequest, NextResponse } from "next/server";


cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
}


export async function POST (request : NextRequest) {
       
       if(!(process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_SECRET)){
             return NextResponse.json(
                {error : "Cloudinary credentials not found"},
                {status : 500}
            )
       }

       try {
         const formData = request.formData();
         const file = (await formData).get("file") as File | null;
         if(!file){
            return NextResponse.json(
                {error : "Image file not found"},
                {status : 401}
            )
         } 

         const bytes = await file.arrayBuffer();
         const buffer = Buffer.from(bytes);

         const result =await new Promise<CloudinaryUploadResult>((resolve,reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder : "social-media-uploads"},
                (error,result)=>{
                    if(error) reject(error);
                    else resolve(result as CloudinaryUploadResult) 
                }
            )
            uploadStream.end(buffer)
         })
          return NextResponse.json(
                   {
                    publicId : result.public_id,
                    imageUrl: result.secure_url
                   },
                     {status : 200})
       } catch (error) {
          console.log("error msg -",error)
          return NextResponse.json(
            {error : "Error uploading image on cloudinary"},
            {status : 400})
       }
}