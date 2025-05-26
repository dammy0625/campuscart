"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin, Calendar, Tag, Eye } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toTitleCase } from "@/app/utils/stringUtils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// --- fetch listing helper ---
async function getListing(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch listing");
  }
  return res.json();
}

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = React.useState(0);
  if (!images?.length)
    return (
      <div className="flex h-96 items-center justify-center bg-gray-100 rounded-xl">
        <Image src="/placeholder.svg" alt="No image" width={100} height={100} />
      </div>
    );

  return (
    <div className="space-y-4">
      <Carousel opts={{ loop: true }} className="relative">
        <CarouselContent>
          {images.map((src, i) => (
            <CarouselItem key={i}>
              <div className="h-96 w-full relative">
                <Image
                  src={src}
                  alt={`${title} ${i + 1}`}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>
      <div className="flex space-x-2 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg",
              current === i && "ring-2 ring-primary"
            )}
          >
            <Image
              src={src}
              alt={`thumb ${i + 1}`}
              width={64}
              height={64}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ListingDetails({ listing, waLink }: { listing: any; waLink: string | null }) {
  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{toTitleCase(listing.title)}</h1>
          <p className="mt-2 text-2xl font-extrabold text-primary">
            ₦{Number(listing.price).toLocaleString("en-NG")}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        <Badge className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {toTitleCase(listing.location)}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Tag className="w-4 h-4" />
          {toTitleCase(listing.category)}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(listing.createdAt).toLocaleDateString()}
        </Badge>
      </div>

      <Card className="border">
        <CardContent className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">Seller Information</h2>
            <p className="font-medium">
              {toTitleCase(listing.user?.name || "Unknown")}
            </p>
            {listing.user?.email && (
              <p className="text-sm text-muted-foreground">{listing.user.email}</p>
            )}
            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Eye className="w-4 h-4" />
              {listing.views || 0} Views
            </p>
          </div>

          {waLink && (
            <div className="pt-3">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <FaWhatsapp className="mr-2 h-5 w-5" />
                  Contact Seller on WhatsApp
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-muted-foreground whitespace-pre-wrap">
          {toTitleCase(listing.description)}
        </p>
      </section>
    </div>
  );
}


export default function ListingPage({ params }: { params: { id: string } }) {
  const pathname = usePathname();
  const [listing, setListing] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [waLink, setWaLink] = React.useState<string | null>(null);

  React.useEffect(() => {
    getListing(params.id)
      .then((data) => {
        setListing(data);

        const sellerPhone = data.user?.whatsapp?.replace(/\D/g, "");
        if (sellerPhone) {
          const message = encodeURIComponent(
            `Hi! I'm interested in your listing "${data.title}" on CampusCart.\n\nLink: ${window.location.origin}${pathname}`
          );
          const link = `https://wa.me/${sellerPhone}?text=${message}`;
          setWaLink(link);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id, pathname]);

  if (loading) return <p className="p-8 text-center">Loading…</p>;
  if (!listing) return <p className="p-8 text-center">Listing not found.</p>;

  return (
    <>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-start">
          <ImageCarousel images={listing.images || []} title={listing.title} />
          <ListingDetails listing={listing} waLink={waLink} />
        </div>
      </div>

      
    </>
  );
}
