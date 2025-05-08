"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditPrisonerPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update functionality
    console.log('Update prisoner:', params.id);
    router.push('/app/jailer/prisoners');
  };

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
          <CardTitle>Edit Prisoner Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="id">Prisoner ID</Label>
                  <Input id="id" defaultValue="P001" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Karthik Y H" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" defaultValue="35" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 234-567-8900" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select defaultValue="O+">
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
                  <Input id="cellNumber" defaultValue="A-101" />
                </div>
              </div>

              {/* Criminal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Criminal Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="crimeType">Crime Type</Label>
                  <Input id="crimeType" defaultValue="Robbery" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sentence">Sentence Duration</Label>
                  <Input id="sentence" defaultValue="5 years" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criminalHistory">Criminal History</Label>
                  <Textarea id="criminalHistory" defaultValue="Previous conviction for theft in 2019. Current charge for armed robbery." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrestDate">Arrest Date</Label>
                  <Input id="arrestDate" type="date" defaultValue="2024-01-15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courtName">Court Name</Label>
                  <Input id="courtName" defaultValue="District Court" />
                </div>
              </div>

              {/* Health Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Health Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="healthConditions">Previous Health Conditions</Label>
                  <Textarea id="healthConditions" defaultValue="Hypertension, Type 2 Diabetes" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea id="medications" defaultValue="Lisinopril 10mg, Metformin 500mg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea id="allergies" defaultValue="Penicillin, Shellfish" />
                </div>
              </div>

              {/* Physical Identification */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Physical Identification</h3>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" defaultValue="175" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" defaultValue="75" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyMarks">Body Marks/Scars</Label>
                  <Textarea id="bodyMarks" defaultValue="Scar on left forearm, birthmark on right shoulder" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tattoos">Tattoos</Label>
                  <Textarea id="tattoos" defaultValue="Dragon tattoo on chest, tribal design on right arm" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => router.push('/app/jailer/prisoners')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 