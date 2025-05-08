"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UserPlus, Calendar, Stethoscope, DollarSign, Gavel } from "lucide-react";

export default function JailerDashboard() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Jailer Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prisoners" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="prisoners">
                <UserPlus className="w-4 h-4 mr-2" />
                Prisoners
              </TabsTrigger>
              <TabsTrigger value="wages">
                <DollarSign className="w-4 h-4 mr-2" />
                Wages
              </TabsTrigger>
              <TabsTrigger value="medical">
                <Stethoscope className="w-4 h-4 mr-2" />
                Medical
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <Calendar className="w-4 h-4 mr-2" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="hearings">
                <Gavel className="w-4 h-4 mr-2" />
                Court Hearings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prisoners" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Prisoners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add New Prisoner
                    </Button>
                    {/* Prisoner list will go here */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wages" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wage Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Wage management interface will go here */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Medical records interface will go here */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Appointment scheduling interface will go here */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hearings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Court Hearing Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Court hearing management interface will go here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 