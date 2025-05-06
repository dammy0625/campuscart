"use client";

import * as React from "react";
import Image from "next/image";
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
import {
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  Eye,
  Phone,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { toTitleCase } from "@/app/utils/stringUtils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Async function to fetch listing
async function getListing(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch listing: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
}

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
        <Image src="/placeholder.svg" alt="Placeholder" width={200} height={200} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Carousel
        opts={{ loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-square">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex justify-center space-x-2 overflow-x-auto">
        {images.map((image, index) => (
          <Card
            key={index}
            className={cn(
              "w-16 h-16 overflow-hidden cursor-pointer transition-all",
              index === currentIndex && "ring-2 ring-primary"
            )}
            onClick={() => setCurrentIndex(index)}
          >
            <CardContent className="p-0">
              <img
                src={`${image}?w=300&q=50`}
                alt={`${title} - Thumbnail`}
                width={300}
                height={300}
                className="object-cover rounded-lg"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ListingDetails({ listing }: { listing: any }) {
  const sellerWhatsapp = listing?.user?.whatsapp;
  const [whatsappLink, setWhatsappLink] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (sellerWhatsapp) {
      const message = encodeURIComponent(
        `Hi, I'm interested in your listing: ${toTitleCase(listing.title)}. Here is the link: ${window.location.origin}/listing/${listing._id}`
      );
      setWhatsappLink(`https://wa.me/${sellerWhatsapp}?text=${message}`);
    }
  }, [sellerWhatsapp, listing]);

  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{toTitleCase(listing.title)}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {toTitleCase(listing.location)}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {toTitleCase(listing.category)}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(listing.createdAt).toLocaleDateString()}
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-4 flex items-center">
            ₦{Number(listing.price).toLocaleString("en-NG")}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {toTitleCase(listing.description)}
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          {whatsappLink ? (
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button className="w-full" size="lg">
                  <FaWhatsapp className="h-5 w-5 mr-2" />
                  Contact Seller on WhatsApp
                </Button>
              </motion.div>
            </a>
          ) : (
            <Button className="w-full" size="lg" disabled>
              Seller did not provide WhatsApp contact
            </Button>
          )}

          <Button variant="outline" className="w-full" size="lg">
            <Eye className="mr-2 h-4 w-4" />
            {listing.views || 0} Views
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const [listing, setListing] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null);

  React.useEffect(() => {
    params.then((resolved) => {
      setResolvedParams(resolved);
    });
  }, [params]);

  React.useEffect(() => {
    if (resolvedParams) {
      getListing(resolvedParams.id)
        .then((data) => {
          setListing(data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [resolvedParams]);

  if (!resolvedParams) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!listing) {
    return <div className="container mx-auto px-4 py-8">Listing not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <ImageCarousel images={listing.images || []} title={listing.title} />
        <ListingDetails listing={listing} />
      </div>
    </div>
  );
}
