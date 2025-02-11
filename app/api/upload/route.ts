import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { IncomingForm } from "formidable"
import { promises as fs } from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: Request) {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm()

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })

  const { files } = data as any

  try {
    const uploadPromises = Object.values(files).map(async (file: any) => {
      const contents = await fs.readFile(file.filepath)
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "listings" }, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          })
          .end(contents)
      })
      return (result as any).secure_url
    })

    const urls = await Promise.all(uploadPromises)

    return NextResponse.json({
      success: true,
      message: "Images uploaded successfully",
      urls,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload images",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}

