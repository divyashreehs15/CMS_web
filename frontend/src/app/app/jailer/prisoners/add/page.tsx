"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { prisonersApi } from "@/lib/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PrisonerResponse {
  message: string;
  id: number;
}

export default function AddPrisonerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    prisoner_id: "",
    name: "",
    age: "",
    gender: "",
    cell_number: "",
    crime_type: "",
    sentence: "",
    criminalHistory: "",
    arrestDate: "",
    courtName: "",
    healthConditions: "",
    medications: "",
    allergies: "",
    height: "",
    weight: "",
    bodyMarks: "",
    tattoos: "",
    bloodGroup: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelect = (id: string, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // Basic validation
      if (!form.prisoner_id || !form.name || !form.age || !form.gender || !form.cell_number) {
        setError("Please fill all required fields");
        setLoading(false);
        return;
      }

      // Format dates
      const admissionDate = form.arrestDate || new Date().toISOString().split('T')[0];
      const releaseDate = form.sentence || new Date().toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];

      // Prepare payload for backend
      const payload = {
        prisoner_id: form.prisoner_id,
        name: form.name,
        age: parseInt(form.age),
        gender: form.gender,
        cell_number: form.cell_number,
        admission_date: admissionDate,
        expected_release_date: releaseDate,
        status: "active",
        category: form.crime_type || "General",
        health_info: {
          status: "healthy",
          last_checkup: today,
          conditions: form.healthConditions ? [form.healthConditions] : [],
          medications: form.medications ? [form.medications] : [],
          dietary_restrictions: form.allergies || "none"
        },
        work_info: {
          assignment: "none",
          start_date: today,
          hours_per_week: 8, // Default to 8 hours per week
          wage_rate: 5.00, // Default to $5.00 per hour
          performance: "pending"
        },
        legal_info: {
          case_number: form.prisoner_id,
          sentence: `${admissionDate} to ${releaseDate}`, // Format sentence as date range
          next_court_date: admissionDate,
          parole_eligibility_date: releaseDate
        },
        behavior_info: {
          conduct: "good",
          last_incident: null,
          privileges: ["standard"],
          restrictions: []
        }
      };

      // Log the payload for debugging
      console.log('Creating prisoner with data:', JSON.stringify(payload, null, 2));

      const response = await prisonersApi.create(payload) as PrisonerResponse;
      
      if (response.id) {
        setSuccess(`Prisoner added successfully with ID: ${response.id}`);
        // Clear form after successful submission
        setForm({
          prisoner_id: "",
          name: "",
          age: "",
          gender: "",
          cell_number: "",
          crime_type: "",
          sentence: "",
          criminalHistory: "",
          arrestDate: "",
          courtName: "",
          healthConditions: "",
          medications: "",
          allergies: "",
          height: "",
          weight: "",
          bodyMarks: "",
          tattoos: "",
          bloodGroup: "",
          phone: ""
        });
        // Redirect after a short delay
        setTimeout(() => router.push("/app/jailer/prisoners"), 2000);
      } else {
        setError("Failed to get prisoner ID from response");
      }
    } catch (err: any) {
      console.error('Error saving prisoner:', err);
      console.error('Full error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        config: err.config
      });
      setError(err?.response?.data?.message || err.message || "Failed to add prisoner");
    } finally {
      setLoading(false);
    }
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
          <CardTitle>Add New Prisoner</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="id">Prisoner ID</Label>
                  <Input id="prisoner_id" value={form.prisoner_id} onChange={handleChange} placeholder="Enter prisoner ID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={form.name} onChange={handleChange} placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={form.age} onChange={handleChange} placeholder="Enter age" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select value={form.bloodGroup} onValueChange={(v) => handleSelect("bloodGroup", v)}>
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
                  <Input id="cell_number" value={form.cell_number} onChange={handleChange} placeholder="Enter cell number" />
                </div>
              </div>

              {/* Criminal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Criminal Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="crimeType">Crime Type</Label>
                  <Input id="crime_type" value={form.crime_type} onChange={handleChange} placeholder="Enter crime type" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sentence">Sentence Duration</Label>
                  <Input id="sentence" value={form.sentence} onChange={handleChange} placeholder="Enter sentence duration" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criminalHistory">Criminal History</Label>
                  <Textarea id="criminalHistory" value={form.criminalHistory} onChange={handleChange} placeholder="Enter criminal history" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrestDate">Arrest Date</Label>
                  <Input id="arrestDate" type="date" value={form.arrestDate} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courtName">Court Name</Label>
                  <Input id="courtName" value={form.courtName} onChange={handleChange} placeholder="Enter court name" />
                </div>
              </div>

              {/* Health Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Health Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="healthConditions">Previous Health Conditions</Label>
                  <Textarea id="healthConditions" value={form.healthConditions} onChange={handleChange} placeholder="Enter previous health conditions" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea id="medications" value={form.medications} onChange={handleChange} placeholder="Enter current medications" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea id="allergies" value={form.allergies} onChange={handleChange} placeholder="Enter allergies" />
                </div>
              </div>

              {/* Physical Identification */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Physical Identification</h3>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" value={form.height} onChange={handleChange} placeholder="Enter height" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" value={form.weight} onChange={handleChange} placeholder="Enter weight" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyMarks">Body Marks/Scars</Label>
                  <Textarea id="bodyMarks" value={form.bodyMarks} onChange={handleChange} placeholder="Enter body marks and scars" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tattoos">Tattoos</Label>
                  <Textarea id="tattoos" value={form.tattoos} onChange={handleChange} placeholder="Enter tattoos description" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => router.push("/app/jailer/prisoners")}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Prisoner"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 