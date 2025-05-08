"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, FileText, Heart, Briefcase, Scale, Award } from "lucide-react";

// Mock data - replace with actual data from your backend
const prisonerData = {
  basicInfo: {
    id: "P12345",
    name: "John Doe",
    age: 35,
    gender: "Male",
    cellNumber: "B-102",
    admissionDate: "2023-06-15",
    expectedReleaseDate: "2025-06-15",
    status: "Incarcerated",
    category: "Medium Security",
  },
  healthInfo: {
    status: "Good",
    lastCheckup: "2024-03-01",
    conditions: ["None"],
    medications: ["None"],
    dietaryRestrictions: "None",
  },
  workInfo: {
    currentAssignment: "Kitchen",
    startDate: "2023-07-01",
    hoursPerWeek: 30,
    wage: "$15/hour",
    performance: "Excellent",
  },
  legalInfo: {
    caseNumber: "CR-2023-123",
    sentence: "2 years",
    remainingTime: "1 year, 3 months",
    nextCourtDate: "2024-04-15",
    paroleEligibility: "2024-12-15",
  },
  behaviorInfo: {
    conduct: "Good",
    lastIncident: "None",
    privileges: ["Library Access", "Gym Access", "Educational Programs"],
    restrictions: "None",
  },
  visitHistory: [
    {
      date: "2024-03-15",
      duration: "1 hour",
      type: "Regular Visit",
      status: "Completed",
    },
    {
      date: "2024-03-01",
      duration: "45 minutes",
      type: "Special Visit",
      status: "Completed",
    },
    {
      date: "2024-02-15",
      duration: "1 hour",
      type: "Regular Visit",
      status: "Completed",
    },
  ],
};

export default function PrisonerInfoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Prisoner Information</h2>
        <p className="text-muted-foreground">
          Detailed information about the prisoner
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              {prisonerData.basicInfo.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prisonerData.basicInfo.category}</div>
            <p className="text-xs text-muted-foreground">
              Cell: {prisonerData.basicInfo.cellNumber}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prisonerData.healthInfo.status}</div>
            <p className="text-xs text-muted-foreground">
              Last checkup: {prisonerData.healthInfo.lastCheckup}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Assignment</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prisonerData.workInfo.currentAssignment}</div>
            <p className="text-xs text-muted-foreground">
              {prisonerData.workInfo.hoursPerWeek} hours/week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Court Date</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prisonerData.legalInfo.nextCourtDate}</div>
            <p className="text-xs text-muted-foreground">
              {prisonerData.legalInfo.remainingTime} remaining
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="work">Work & Education</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="visits">Visit History</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Personal details and current status</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Prisoner ID</span>
                  <span>{prisonerData.basicInfo.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Name</span>
                  <span>{prisonerData.basicInfo.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Age</span>
                  <span>{prisonerData.basicInfo.age} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gender</span>
                  <span>{prisonerData.basicInfo.gender}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Admission Date</span>
                  <span>{prisonerData.basicInfo.admissionDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Expected Release</span>
                  <span>{prisonerData.basicInfo.expectedReleaseDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Security Category</span>
                  <span>{prisonerData.basicInfo.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cell Number</span>
                  <span>{prisonerData.basicInfo.cellNumber}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <CardDescription>Medical status and conditions</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Status</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {prisonerData.healthInfo.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Checkup</span>
                  <span>{prisonerData.healthInfo.lastCheckup}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Medical Conditions</span>
                  <span>{prisonerData.healthInfo.conditions.join(", ") || "None"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Medications</span>
                  <span>{prisonerData.healthInfo.medications.join(", ") || "None"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Dietary Restrictions</span>
                  <span>{prisonerData.healthInfo.dietaryRestrictions}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work & Education</CardTitle>
              <CardDescription>Current assignments and performance</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Assignment</span>
                  <span>{prisonerData.workInfo.currentAssignment}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Start Date</span>
                  <span>{prisonerData.workInfo.startDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hours per Week</span>
                  <span>{prisonerData.workInfo.hoursPerWeek}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Wage Rate</span>
                  <span>{prisonerData.workInfo.wage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Performance</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {prisonerData.workInfo.performance}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Legal Information</CardTitle>
              <CardDescription>Case details and sentence information</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Case Number</span>
                  <span>{prisonerData.legalInfo.caseNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sentence</span>
                  <span>{prisonerData.legalInfo.sentence}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Remaining Time</span>
                  <span>{prisonerData.legalInfo.remainingTime}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Next Court Date</span>
                  <span>{prisonerData.legalInfo.nextCourtDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Parole Eligibility</span>
                  <span>{prisonerData.legalInfo.paroleEligibility}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Behavior & Privileges</CardTitle>
              <CardDescription>Conduct and available privileges</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conduct</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {prisonerData.behaviorInfo.conduct}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Incident</span>
                  <span>{prisonerData.behaviorInfo.lastIncident}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Privileges</span>
                  <div className="flex flex-wrap gap-1">
                    {prisonerData.behaviorInfo.privileges.map((privilege) => (
                      <Badge key={privilege} variant="secondary">
                        {privilege}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Restrictions</span>
                  <span>{prisonerData.behaviorInfo.restrictions}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visit History</CardTitle>
              <CardDescription>Recent visits and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prisonerData.visitHistory.map((visit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{visit.type}</p>
                      <p className="text-sm text-muted-foreground">{visit.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{visit.duration}</p>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {visit.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 