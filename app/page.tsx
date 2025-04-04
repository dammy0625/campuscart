"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Eye, ExternalLink, MapPin } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toTitleCase } from "@/app/utils/stringUtils";
import { useRouter } from "next/navigation";
import { ListingCardSkeleton } from "@/components/listing-card-skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  // Listings state and pagination states for infinite scroll
  const [listings, setListings] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const limit = 10; // Number of listings to fetch per call
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // For the dialog that shows individual listing details
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement>(null);

  // Fetch listings with pagination
  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/listings?skip=${skip}&limit=${limit}`);
      if (!res.ok) {
        throw new Error("Failed to fetch listings");
      }
      const data = await res.json();
      //console.log(data)
      // Expecting data.listings to be returned from your backend
      const newListings = data.listings || data;
      if (newListings.length < limit) {
        setHasMore(false);
      }
      setListings((prev) => [...prev, ...newListings]);
      setSkip((prev) => prev + newListings.length);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [skip]);

  // Initial load
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Intersection Observer to load more listings on scroll
  useEffect(() => {
    if (isLoading || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchListings();
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, hasMore, fetchListings]);

  return (
    <>
      <div className="space-y-4 p-4 pb-20 md:pb-4">
        <h1 className="text-2xl font-bold text-center text-foreground mt-2 mb-4">Featured Listings</h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.length === 0 && isLoading
            ? Array(8)
                .fill(0)
                .map((_, index) => <ListingCardSkeleton key={index} />)
            : listings.map((listing) => (
                <Card key={listing._id} className="overflow-hidden group relative border-none shadow-sm">
                  <Link href={`/listing/${listing._id}`} className="block h-full">
                    <div className="relative aspect-video">
                      <Image
                        src={
                         // listing.images.length ? listing.images[listing.images.length - 1] : "/placeholder.svg"}
                         listing.images[0]|| "/placeholder.svg"}
                        alt={listing.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity group-hover:bg-opacity-30" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-10 bg-black/70 text-white hover:bg-black"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedListing(listing);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-3">
                      <h2 className="text-sm font-semibold line-clamp-2 text-foreground mb-1">
                        {toTitleCase(listing.title)}
                      </h2>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {listing.location}
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          ₦{Number(listing.price).toLocaleString("en-NG")}
                        </span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
        </div>
      </div>

      {isLoading && (
        <div className="text-center my-4">
          <p>Loading...</p>
        </div>
      )}
      {!isLoading && !hasMore && (
        <div className="text-center my-4">
          <p>No more listings</p>
        </div>
      )}

      {/* Sentinel div for triggering infinite scroll */}
      <div ref={observerRef} className="h-4"></div>

      {selectedListing && (
        <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
          <DialogContent className="sm:max-w-[425px] w-[70vw] max-h-[80vh] h-auto overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {toTitleCase(selectedListing.title)}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-grow flex flex-col gap-4 py-4">
              <div className="relative aspect-square w-full flex-shrink-0" style={{ maxHeight: "40vh" }}>
                <Image
                  src={selectedListing.images[0] || "/placeholder.svg"}
                  alt={selectedListing.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-3 flex-shrink overflow-y-auto pr-2">
                <p className="text-sm text-muted-foreground">
                  {toTitleCase(selectedListing.description)}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {toTitleCase(selectedListing.category)}
                  </Badge>
                  <span className="font-bold text-lg">
                    ₦{Number(selectedListing.price).toLocaleString("en-NG")}
                  </span>
                </div>
                <p className="text-sm">📍 {toTitleCase(selectedListing.location)}</p>
              </div>
            </div>
            <DialogFooter>
              <Link href={`/listing/${selectedListing._id}`} className="w-full">
                <Button className="w-full" size="lg">
                  View Full Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
