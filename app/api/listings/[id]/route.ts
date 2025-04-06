import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Listing from "@/models/Listing"

export async function GET(
  request: Request, 
  context: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    // Extract id from context.params
    const { id } = context.params
    
    // First try to find by MongoDB _id
    let listing = await Listing.findById(id)

    // If not found, try to find by custom id field
    if (!listing) {
      listing = await Listing.findOne({ id: id })
    }

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error("Error fetching listing:", error)
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
  }
}


