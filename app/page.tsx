"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { Eye, ExternalLink, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toTitleCase } from "@/app/utils/stringUtils";
import { useRouter, useSearchParams } from "next/navigation";
import { ListingCardSkeleton } from "@/components/listing-card-skeleton";
import { motion } from "framer-motion";
import { categories } from "./data/categories";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const schoolLocations = ["UNILAG", "OAU", "UI", "UNIBEN", "LASU", "COVENANT", "BOWEN", "uniosun"];

interface Listing {
  _id: string;
  title: string;
  price: number | string;
  description: string;
  category: string;
  location: string;
  images: string[];
  [key: string]: any;
}

// Separate component that uses useSearchParams
function HomeContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [skip, setSkip] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";

  const fetchListings = async (reset = false) => {
    try {
      const offset = reset ? 0 : skip;
      const params = new URLSearchParams({
        skip: offset.toString(),
        limit: limit.toString(),
      });

      if (selectedLocation) params.append("location", selectedLocation);
      if (selectedCategory) params.append("category", selectedCategory);

      const res = await fetch(`${API_URL}/listings?${params.toString()}`);
      const data = await res.json();
      const newListings = data.listings || data;

      if (newListings.length < limit) setHasMore(false);

      setListings((prev) => (reset ? newListings : [...prev, ...newListings]));
      setSkip((prev) => (reset ? newListings.length : prev + newListings.length));
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setIsInitialLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsInitialLoading(true);
    fetchListings(true);
  }, [selectedLocation, selectedCategory]);

  const fetchMoreListings = useCallback(() => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      fetchListings();
    }
  }, [isLoading, hasMore, skip, selectedLocation, selectedCategory]);

  useEffect(() => {
    if (isInitialLoading || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) fetchMoreListings();
      },
      { rootMargin: "0px 0px 200px 0px" }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [isInitialLoading, isLoading, hasMore, fetchMoreListings]);

  return (
    <>
      <div className="space-y-4 p-4 pb-20 md:pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-foreground">Featured Listings</h1>
          <div className="w-full md:w-[250px]">
            <Select onValueChange={(value) => setSelectedLocation(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by School" />
              </SelectTrigger>
              <SelectContent>
                {schoolLocations.map((school) => (
                  <SelectItem key={school} value={school}>{school}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isInitialLoading
            ? Array(8)
                .fill(0)
                .map((_, index) => <ListingCardSkeleton key={`skeleton-${index}`} />)
            : listings.map((listing) => (
                <Card key={listing._id} className="overflow-hidden group relative border-none shadow-sm">
                  <Link href={`/listing/${listing._id}`} className="block h-full">
                    <div className="relative aspect-video">
                      <Image
                        src={listing.images[0] || "/placeholder.svg"}
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
          {!isInitialLoading && listings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
              <div className="rounded-full bg-muted p-3">
                <MapPin className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">No listings found</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedLocation
                    ? `We couldn't find any listings in ${selectedLocation}. Try another location or check back later.`
                    : `No listings are available at the moment. Please check back later.`}
                </p>
                {selectedLocation && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedLocation("")}
                    className="mt-2"
                  >
                    Clear filter
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-4 my-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <p>Loading more listings...</p>
        </div>
      )}

      {!isLoading && !hasMore && listings.length > 0 && (
        <div className="text-center my-4 text-muted-foreground">
          <p>You've reached the end of the listings</p>
        </div>
      )}

      <div ref={observerRef} className="h-2 mb-4"></div>

      {selectedListing && (
        <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
          <DialogContent className="sm:max-w-[425px] w-[70vw] max-h-[80vh] h-auto overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {toTitleCase(selectedListing.title)}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-grow flex flex-col gap-4 py-4">
              <div
                className="relative aspect-square w-full flex-shrink-0"
                style={{ maxHeight: "40vh" }}
              >
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
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button className="w-full" size="lg">
                    View Full Details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Main component with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={
      <div className="space-y-4 p-4 pb-20 md:pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-foreground">Featured Listings</h1>
          <div className="w-full md:w-[250px]">
            <div className="h-10 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, index) => (
            <ListingCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}