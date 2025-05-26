"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toTitleCase } from "@/app/utils/stringUtils";
import { motion } from "framer-motion";
import { categories } from "../data/categories"; // Make sure this file exports an array

export default function CategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse by Category</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.slug}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link href={`/?category=${encodeURIComponent(category.slug)}`}>
              <Card className="hover:shadow-md transition-shadow duration-200 h-full">
                <CardHeader className="text-center text-lg font-medium">
                  {category.icon && (
                    <div className="mb-2 text-3xl">{category.icon}</div>
                  )}
                  {toTitleCase(category.name)}
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm text-center">
                  {category.description}
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
