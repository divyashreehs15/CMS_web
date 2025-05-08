"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ScheduleAppointmentPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement appointment scheduling
    console.log('Schedule appointment');
    router.push('/app/family/appointments');
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/app/family/appointments">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Appointments
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule Visit Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prisoner Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Prisoner Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="prisonerId">Prisoner ID</Label>
                  <Input id="prisonerId" placeholder="Enter prisoner ID" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prisonerName">Prisoner Name</Label>
                  <Input id="prisonerName" placeholder="Enter prisoner name" required />
                </div>
              </div>

              {/* Visitor Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visitor Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="visitorName">Your Name</Label>
                  <Input id="visitorName" placeholder="Enter your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship with Prisoner</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="Enter phone number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idProof">ID Proof Number</Label>
                  <Input id="idProof" placeholder="Enter ID proof number" required />
                </div>
              </div>

              {/* Visit Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visit Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="visitDate">Preferred Date</Label>
                  <Input id="visitDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitTime">Preferred Time</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="15:00">03:00 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Visit Duration</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Visit</Label>
                  <Textarea id="purpose" placeholder="Enter purpose of visit" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" placeholder="Enter any additional notes or requirements" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => router.push('/app/family/appointments')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 