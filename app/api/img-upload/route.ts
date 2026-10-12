import { v2 as cloudinary } from "cloudinary"
import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGES_PER_POST,
  MAX_TOTAL_IMAGE_BYTES,
  MAX_UPLOAD_REQUEST_BYTES,
} from "@/lib/imageUploadLimits";


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
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    || !process.env.CLOUDINARY_API_KEY
    || !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json({ error: "Cloudinary credentials not found" }, { status: 500 });
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_UPLOAD_REQUEST_BYTES) {
    return NextResponse.json({ error: "The total upload size cannot exceed 100 MB" }, { status: 413 });
  }

  let files: File[];
  try {
    const formData = await request.formData();
    files = [
      ...formData.getAll("files"),
      ...(formData.get("file") ? [formData.get("file")] : []),
    ].filter((entry): entry is File => entry instanceof File);
  } catch (error) {
    console.error("Failed to read upload form data:", error);
    return NextResponse.json({ error: "Invalid upload form data" }, { status: 400 });
  }

  if (!files.length) {
    return NextResponse.json({ error: "At least one image file is required" }, { status: 400 });
  }
  if (files.length > MAX_IMAGES_PER_POST) {
    return NextResponse.json(
      { error: `You can upload at most ${MAX_IMAGES_PER_POST} images per post` },
      { status: 413 },
    );
  }
  if (files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_IMAGE_BYTES) {
    return NextResponse.json({ error: "The total upload size cannot exceed 100 MB" }, { status: 413 });
  }

  for (const file of files) {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as typeof ALLOWED_IMAGE_MIME_TYPES[number])) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are supported" },
        { status: 415 },
      );
    }
    if (file.size === 0 || file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Each image must be non-empty and no larger than 10 MB" },
        { status: 413 },
      );
    }
  }

  try {
    const images: CloudinaryUploadResult[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "social-media-uploads",
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
            max_bytes: MAX_IMAGE_SIZE_BYTES,
          },
          (error, result) => {
            if (error) reject(error);
            else if (!result) reject(new Error("Cloudinary returned no upload result"));
            else resolve(result as CloudinaryUploadResult);
          },
        );
        uploadStream.end(buffer);
      });
      images.push(uploaded);
    }

    return NextResponse.json({
      images: images.map(({ public_id, secure_url }) => ({
        publicId: public_id,
        imageUrl: secure_url,
      })),
      publicId: images[0].public_id,
      imageUrl: images[0].secure_url,
    });
  } catch (error) {
    console.error("Cloudinary image upload failed:", error);
    return NextResponse.json({ error: "Error uploading image on Cloudinary" }, { status: 502 });
  }
}