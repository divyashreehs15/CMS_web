"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PrisonerDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/app/jailer/prisoners">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Prisoners
          </Button>
        </Link>
        <Button>
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Details
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Prisoner ID</p>
                <p className="font-medium">P001</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">Karthik Y H</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">35</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">+1 234-567-8900</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-medium">O+</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cell Number</p>
                <p className="font-medium">A-101</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Criminal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Criminal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Crime Type</p>
                <p className="font-medium">Robbery</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sentence Duration</p>
                <p className="font-medium">5 years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Arrest Date</p>
                <p className="font-medium">2024-01-15</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Court Name</p>
                <p className="font-medium">District Court</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Criminal History</p>
              <p className="mt-1">Previous conviction for theft in 2019. Current charge for armed robbery.</p>
            </div>
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card>
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Previous Health Conditions</p>
                <p className="mt-1">Hypertension, Type 2 Diabetes</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Medications</p>
                <p className="mt-1">Lisinopril 10mg, Metformin 500mg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Allergies</p>
                <p className="mt-1">Penicillin, Shellfish</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Identification */}
        <Card>
          <CardHeader>
            <CardTitle>Physical Identification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="font-medium">175 cm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-medium">75 kg</p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Body Marks/Scars</p>
                <p className="mt-1">Scar on left forearm, birthmark on right shoulder</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tattoos</p>
                <p className="mt-1">Dragon tattoo on chest, tribal design on right arm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 