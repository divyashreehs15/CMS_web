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

interface LoginResponse {
  token: string;
  user: User;
}

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"jailer" | "family">("jailer");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiService.auth.login(username, password) as LoginResponse;
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      // Redirect based on role
      if (response.user.role === "jailer") {
        router.push("/app/jailer/analytics");
      } else {
        router.push("/app/family/analytics");
      }
      
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Prison Management System</CardTitle>
          <CardDescription>Login to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="jailer" value={activeTab} onValueChange={(value) => setActiveTab(value as "jailer" | "family")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jailer">Jailer</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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