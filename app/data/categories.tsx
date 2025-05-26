import { Laptop, Shirt, Phone, Book, Home } from "lucide-react";

export const categories = [
  {
    name: "electronics",
    slug: "electronics",
    description: "Phones, gadgets, accessories and more",
    icon: <Phone />,
  },
  {
    name: "laptops",
    slug: "laptops",
    description: "New and used laptops for sale",
    icon: <Laptop />,
  },
  {
    name: "clothing",
    slug: "clothing",
    description: "Fashion, shoes, and accessories",
    icon: <Shirt />,
  },
  {
    name: "books",
    slug: "books",
    description: "Textbooks and study materials",
    icon: <Book />,
  },
  {
    name: "furniture",
    slug: "furniture",
    description: "Beds, chairs, desks and more",
    icon: <Home />,
  },
];
