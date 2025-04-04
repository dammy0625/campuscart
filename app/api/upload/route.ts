import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { IncomingForm, File as FormidableFile } from "formidable";
import { promises as fs } from "fs";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js built-in body parser
  },
};

export async function POST(req: Request) {
  // Parse the incoming form data using formidable
  const data = await new Promise<{ fields: Record<string, unknown>; files: Record<string, FormidableFile> }>((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const { files } = data;

  try {
    // Process all uploaded images
    const uploadPromises = Object.values(files).map(async (file) => {
      // Cast the file as FormidableFile for proper typing
      const f = file as FormidableFile;
      const contents = await fs.readFile(f.filepath);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "listings" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(contents);
      });
      // Assuming result has a secure_url property
      return (result as { secure_url: string }).secure_url;
    });

    const urls = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      message: "Images uploaded successfully",
      urls,
    });
  } catch (error) {
    console.error("Upload error:", (error as Error).message);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload images",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
