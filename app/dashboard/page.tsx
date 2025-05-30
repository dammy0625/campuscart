"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  ListPlus,
  LogOut,
} from "lucide-react";
import { toTitleCase } from "@/app/utils/stringUtils";
//import Cookies from "js-cookie";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

// Import Dialog components from your UI library
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://campuscart-backend-ee42358f2a62.herokuapp.com";

// Define types to replace `any`
interface UserType {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  whatsapp?: string;
}

interface ListingType {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  images: string[];
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  //const [activeListings, setActiveListings] = useState([]);
  const [activeListings, setActiveListings] = useState<ListingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [updatingWhatsapp, setUpdatingWhatsapp] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUser(data);
        if (data.whatsapp) {
          setWhatsappNumber(data.whatsapp);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Fetch active listings for the logged-in user
  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const response = await fetch(`${API_URL}/user-listings`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch user listings");
        const data = await response.json();
        setActiveListings(data.listings || data);
      } catch (error) {
        console.error("Error fetching user listings:", error);
        toast.error("Failed to load your listings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserListings();
  }, []);

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleUpdateWhatsapp = async () => {
    setUpdatingWhatsapp(true);
    try {
      // Ensure the number starts with "+234"
      let formattedNumber = whatsappNumber.trim();
      if (!formattedNumber.startsWith("+234")) {
        if (formattedNumber.startsWith("0")) {
          formattedNumber = formattedNumber.substring(1);
        }
        formattedNumber = "+234" + formattedNumber;
      }

      const response = await fetch(`${API_URL}/api/auth/update-whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ whatsapp: formattedNumber }),
      });
      if (!response.ok) {
        throw new Error("Failed to update WhatsApp number");
      }
      const data = await response.json();
      toast.success("WhatsApp number updated successfully!");
      setUser((prev: any) => ({ ...prev, whatsapp: formattedNumber }));
    } catch (error: any) {
      console.error("WhatsApp update error:", error);
      toast.error(
        error.message || "Failed to update WhatsApp number. Please try again."
      );
    } finally {
      setUpdatingWhatsapp(false);
    }
  };
    

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-8 mb-8 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-2xl font-bold">{user?.name || "Loading..."}</p>
                <p className="text-sm text-muted-foreground">{user?.email || "Loading..."}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button onClick={() => router.push("/post-listing")}>
              <ListPlus className="mr-2 h-4 w-4" /> New Listing
            </Button>
            </motion.div>
            
<motion.div whileTap={{ scale: 0.9 }}>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Update Dialog */}
      <Card className="mb-8 max-w-md mx-auto">
        <CardHeader>
          <CardTitle>WhatsApp Contact</CardTitle>
          <CardDescription>
            {user?.whatsapp
              ? "Your WhatsApp number is set. Update it if needed."
              : "Add your WhatsApp number for notifications and support."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              {user?.whatsapp ? `Current: ${user.whatsapp}` : "No WhatsApp number provided."}
            </p>
            <Dialog>
              <DialogTrigger asChild>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button variant="outline" size="sm">
                  Update WhatsApp
                </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update WhatsApp Number</DialogTitle>
                  <DialogDescription>
                    Enter your WhatsApp number. It will be automatically prefixed with +234.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  placeholder="Enter your WhatsApp number"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
                <DialogFooter>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button onClick={handleUpdateWhatsapp} disabled={updatingWhatsapp}>
                    {updatingWhatsapp ? "Updating..." : "Update"}
                  </Button>
                  </motion.div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Listings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Listings</CardTitle>
              <CardDescription>Your current active listings on the marketplace.</CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : activeListings.length > 0 ? (
                <div className="space-y-4">
                  {activeListings.map((listing) => (
                    <div key={listing._id} 
                    className="flex items-center justify-between border-b pb-2 cursor-pointer overflow-hidden group relative border-none shadow-sm"
                    onClick={() => router.push(`/listing/${listing._id}`)}
                    >
                      <div>
                        <p className="font-medium">{toTitleCase(listing.title)}</p>
                        <Badge variant="secondary">{listing.category}</Badge>
                      </div>
                      <p className="font-bold">₦{Number(listing.price).toLocaleString("en-NG")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No listings found.</p>
              )}
            </CardContent>
            
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Your listing performance over time.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <BarChart className="h-60 w-full text-muted-foreground" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
