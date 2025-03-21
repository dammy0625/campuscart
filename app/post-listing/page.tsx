"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Laptop, SofaIcon as Couch, Shirt, Package, Upload, Tag, Banknote, MapPin, FileText } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "../contexts/AuthContext" // Make sure this path is correct


export default function PostListing() {
  const router = useRouter()
  const { isAuthenticated, loading, checkAuth } = useAuth() // Include checkAuth from context
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    location: "",
    category: "",
    images: [] as File[],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Check authentication when component mounts
  useEffect(() => {
    (async () => {
      const isAuthed = await checkAuth() // Use the checkAuth method from context
    
      if (!isAuthed) {
        toast.error("Please log in to post a listing")
        router.push("/profile")
      }
    })()
  }, [])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    )
  }

  // Don't render the form if user is not authenticated
  if (!isAuthenticated) {
    return null // Will be redirected by the useEffect
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prevState) => ({ ...prevState, images: [...prevState.images, ...e.target.files!] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const listingFormData = new FormData()
      listingFormData.append("id", Date.now().toString())
      listingFormData.append("title", formData.title)
      listingFormData.append("description", formData.description)
      listingFormData.append("price", formData.price.toString())
      listingFormData.append("location", formData.location)
      listingFormData.append("category", formData.category)
      
      formData.images.forEach((image, index) => {
        listingFormData.append("images", image)
      })

      console.log(`Submitting to: ${process.env.NEXT_PUBLIC_API_URL}/listings`)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`, {
        method: "POST",
        body: listingFormData,
        credentials: "include", // Include cookies in the request
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast.success("Listing created successfully!")
  
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 2000) // 2 seconds delay
      } else {
        throw new Error(result.message || "Failed to create listing")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to create listing. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryIcons = {
    books: <Book className="h-4 w-4" />,
    electronics: <Laptop className="h-4 w-4" />,
    furniture: <Couch className="h-4 w-4" />,
    clothing: <Shirt className="h-4 w-4" />,
    other: <Package className="h-4 w-4" />,
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Post a New Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Product Name
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center">
                <Banknote className="h-4 w-4 mr-2" />
                Price (₦)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₦</span>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="text-foreground pl-7"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Category
              </Label>
              <Select onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryIcons).map(([value, icon]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center">
                        {icon}
                        <span className="ml-2 capitalize">{value}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </Label>
              <Select onValueChange={(value) => handleSelectChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uniosun">UNIOSUN</SelectItem>
                  <SelectItem value="leads-university">Leads University</SelectItem>
                  <SelectItem value="oou">OOU</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="text-foreground min-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="images" className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Images
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Label
                htmlFor="images"
                className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md hover:border-primary"
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Upload Images</span>
                </div>
              </Label>
            </div>
            {formData.images.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">{formData.images.length} image(s) selected</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                <span>Posting...</span>
              </div>
            ) : (
              "Post Listing"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}