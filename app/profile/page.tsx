"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import * as Cookies from "js-cookie";



const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  
  

  const handleGoogleAuth = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/${isLogin ? "login" : "signup"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const token = Cookies.get('jwt');
      console.log('JWT Token:', token);


      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");
      

      if (data.token) {
        console.log("Response data:", data);
        Cookies.set("jwt", data.token, { 
          expires: 7,
          path: "/",
          secure: process.env.NODE_ENV === "production", // Ensures cookies work on HTTPS
          sameSite: "Lax",

        });
        console.log('Cookie after setting:', Cookies.get('token'));
        console.log('All cookies:', document.cookie);
        router.replace("/dashboard");
      }

      useEffect(() => {
        setTimeout(() => {
          const jwtToken = Cookies.get("jwt") || localStorage.getItem("jwt");
          if (jwtToken) {
            router.replace("/dashboard");
          }
        }, 500); // Small delay to ensure the token is set
      }, [router]);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin ? "Enter your credentials to access your account" : "Create a new account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleAuth} disabled={loading}>
              <Icons.google className="mr-2 h-4 w-4" />
              {isLogin ? "Login with Google" : "Sign up with Google"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => setIsLogin(false)} disabled={loading}>
                  Sign up
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => setIsLogin(true)} disabled={loading}>
                  Login
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
