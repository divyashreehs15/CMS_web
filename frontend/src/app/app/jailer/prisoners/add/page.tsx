"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddPrisonerPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/app/jailer/prisoners">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Prisoners
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Prisoner</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="id">Prisoner ID</Label>
                  <Input id="id" placeholder="Enter prisoner ID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Enter age" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cellNumber">Cell Number</Label>
                  <Input id="cellNumber" placeholder="Enter cell number" />
                </div>
              </div>

              {/* Criminal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Criminal Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="crimeType">Crime Type</Label>
                  <Input id="crimeType" placeholder="Enter crime type" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sentence">Sentence Duration</Label>
                  <Input id="sentence" placeholder="Enter sentence duration" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criminalHistory">Criminal History</Label>
                  <Textarea id="criminalHistory" placeholder="Enter criminal history" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrestDate">Arrest Date</Label>
                  <Input id="arrestDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courtName">Court Name</Label>
                  <Input id="courtName" placeholder="Enter court name" />
                </div>
              </div>

              {/* Health Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Health Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="healthConditions">Previous Health Conditions</Label>
                  <Textarea id="healthConditions" placeholder="Enter previous health conditions" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea id="medications" placeholder="Enter current medications" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea id="allergies" placeholder="Enter allergies" />
                </div>
              </div>

              {/* Physical Identification */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Physical Identification</h3>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" placeholder="Enter height" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" placeholder="Enter weight" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyMarks">Body Marks/Scars</Label>
                  <Textarea id="bodyMarks" placeholder="Enter body marks and scars" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tattoos">Tattoos</Label>
                  <Textarea id="tattoos" placeholder="Enter tattoos description" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit">
                Add Prisoner
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 