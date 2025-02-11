import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Listing from "@/models/Listing"

export async function GET() {
  try {
    await dbConnect()
    const listings = await Listing.find().sort({ createdAt: -1 })
    return NextResponse.json(listings)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error fetching listings." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const newListing = new Listing(body)
    await newListing.save()
    return NextResponse.json({ success: true, listing: newListing }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Error creating listing" }, { status: 500 })
  }
}

