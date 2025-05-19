"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService, User } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface LoginResponse {
  token: string;
  user: User;
}

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"jailer" | "family">("jailer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiService.auth.login(email, password) as LoginResponse;
      
      // Store token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      // Set default authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      
      // Redirect based on role
      if (response.user.role === "jailer") {
        router.push("/app/jailer");
      } else {
        router.push("/app/family/analytics");
      }
      
      toast.success("Login successful!");
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px] border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Prison Management System</CardTitle>
          <CardDescription className="text-muted-foreground">Login to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="jailer" value={activeTab} onValueChange={(value) => setActiveTab(value as "jailer" | "family")}>
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="jailer">Jailer</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background border-border"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}