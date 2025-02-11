import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

async function getListing(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`, { cache: "no-store" })
    if (!res.ok) {
      throw new Error(`Failed to fetch listing: ${res.status}`)
    }
    return res.json()
  } catch (error) {
    console.error("Error fetching listing:", error)
    return null
  }
}

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id)

  if (!listing) {
    return <div className="text-center p-4">Listing not found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative aspect-square">
              <Image
                src={listing.images[0] || "/placeholder.svg"}
                alt={listing.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">{listing.title}</h1>
              <p className="text-xl font-semibold text-foreground">${listing.price}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{listing.category}</Badge>
                <Badge variant="outline">{listing.condition}</Badge>
              </div>
              <p className="text-muted-foreground">{listing.description}</p>
              <p className="text-sm text-muted-foreground">Location: {listing.location}</p>
              <p className="text-sm text-muted-foreground">
                Posted on: {new Date(listing.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-white text-black hover:bg-black hover:text-white transition-colors">
            Contact Seller
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

