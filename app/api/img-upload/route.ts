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
       
       if(!(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)){
             return NextResponse.json(
                {error : "Cloudinary credentials not found"},
                {status : 500}
            )
       }

       try {
         const formData = await request.formData();
         const files = [
           ...formData.getAll("files"),
           ...(formData.get("file") ? [formData.get("file")] : [])
         ].filter((entry): entry is File => entry instanceof File);
         if(!files.length){
            return NextResponse.json(
                {error : "Image file not found"},
                {status : 401}
            )
         } 

         const images = await Promise.all(files.map(async (file) => {
           const buffer = Buffer.from(await file.arrayBuffer());
           return await new Promise<CloudinaryUploadResult>((resolve,reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                  {folder : "social-media-uploads"},
                  (error,result)=>{
                      if(error) reject(error);
                      else if (!result) reject(new Error("Cloudinary returned no upload result"));
                      else resolve(result as CloudinaryUploadResult);
                  }
              )
              uploadStream.end(buffer)
           })
         }));
          return NextResponse.json(
                   {
                    images: images.map(({public_id, secure_url}) => ({
                      publicId: public_id,
                      imageUrl: secure_url
                    })),
                    publicId : images[0].public_id,
                    imageUrl: images[0].secure_url
                   },
                     {status : 200})
       } catch (error) {
          console.log("error msg -",error)
          return NextResponse.json(
            {error : "Error uploading image on cloudinary"},
            {status : 400})
       }
}