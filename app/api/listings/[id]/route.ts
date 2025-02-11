import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Listing from "@/models/Listing"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const product = await Listing.findOne({ id: params.id })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while fetching the product." }, { status: 500 })
  }
}

