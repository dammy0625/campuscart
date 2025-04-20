"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [signupError, setSignupError] = useState("");
  const router = useRouter();
  const { login, user, loading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleGoogleAuth = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSignupError("");

    if (isLogin) {
      const success = await login({ email: formData.email, password: formData.password });
      if (success) router.replace("/dashboard");
    } else {
      try {
        const response = await fetch(`${API_URL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Signup failed");
        }

        await login({ email: formData.email, password: formData.password });
        router.replace("/dashboard");
      } catch (err) {

        if (err instanceof Error) {
          setSignupError(err.message);
        } else {
          // Handle the case where err is not an Error object
          setSignupError("An unknown error occurred");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create a new account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {signupError && <p className="text-red-500 text-sm text-center mb-4">{signupError}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <motion.div whileTap={{ scale: 0.9 }}>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </Button>
            </motion.div>
          </form>
          <motion.div whileTap={{ scale: 0.9 }}>
          <Button variant="outline" className="w-full mt-4" onClick={handleGoogleAuth} disabled={loading}>
            <Icons.google className="mr-2 h-4 w-4" />
            {isLogin ? "Login with Google" : "Sign up with Google"}
          </Button>
          </motion.div>
          {/* Toggle Button */}
          <p className="text-sm text-center mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline">
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
