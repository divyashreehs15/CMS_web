"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Clock, LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function FamilyDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("prisoner-info");

  const handleLogout = () => {
    router.push("/login");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "prisoner-info":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Prisoner Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">Karthik Y H</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-medium">P001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cell Number:</span>
                      <span className="font-medium">A-101</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium">Active</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Medical Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Condition:</span>
                      <span className="font-medium">Stable</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Checkup:</span>
                      <span className="font-medium">2024-03-15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Next Appointment:</span>
                      <span className="font-medium">2024-04-15</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case "appointments":
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Visit Appointments</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Request New Appointment
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-03-25</TableCell>
                    <TableCell>14:00</TableCell>
                    <TableCell>1 hour</TableCell>
                    <TableCell>Approved</TableCell>
                    <TableCell>Regular visit</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-04-01</TableCell>
                    <TableCell>15:30</TableCell>
                    <TableCell>1 hour</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>Family visit</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      case "hearings":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Court Hearings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Court</TableHead>
                    <TableHead>Case Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-04-01</TableCell>
                    <TableCell>10:00</TableCell>
                    <TableCell>District Court</TableCell>
                    <TableCell>CR-2024-001</TableCell>
                    <TableCell>Bail Hearing</TableCell>
                    <TableCell>Scheduled</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-04-15</TableCell>
                    <TableCell>14:30</TableCell>
                    <TableCell>High Court</TableCell>
                    <TableCell>CR-2024-001</TableCell>
                    <TableCell>Preliminary</TableCell>
                    <TableCell>Scheduled</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">Family Dashboard</h2>
        <Button
          variant={activeSection === "prisoner-info" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("prisoner-info")}
        >
          <FileText className="w-4 h-4 mr-2" />
          Prisoner Information
        </Button>
        <Button
          variant={activeSection === "appointments" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("appointments")}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Appointments
        </Button>
        <Button
          variant={activeSection === "hearings" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("hearings")}
        >
          <Clock className="w-4 h-4 mr-2" />
          Court Hearings
        </Button>
        <div className="pt-4 mt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
} 