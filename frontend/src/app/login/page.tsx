"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role: "jailer" | "family") => {
    setLoading(true);
    try {
      // Here you would typically make an API call to authenticate
      // For now, we'll just redirect based on role
      router.push(role === "jailer" ? "/app/jailer" : "/app/family");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Prison Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="jailer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jailer">
                <Shield className="w-4 h-4 mr-2" />
                Jailer Login
              </TabsTrigger>
              <TabsTrigger value="family">
                <Users className="w-4 h-4 mr-2" />
                Family Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jailer" className="mt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jailer-email">Email</Label>
                  <Input id="jailer-email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jailer-password">Password</Label>
                  <Input id="jailer-password" type="password" placeholder="Enter your password" />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin("jailer")}
                  disabled={loading}
                >
                  Login as Jailer
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="family" className="mt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="family-email">Email</Label>
                  <Input id="family-email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family-password">Password</Label>
                  <Input id="family-password" type="password" placeholder="Enter your password" />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin("family")}
                  disabled={loading}
                >
                  Login as Family Member
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}