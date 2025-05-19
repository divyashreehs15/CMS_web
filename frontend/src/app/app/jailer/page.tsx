"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, DollarSign, Stethoscope, Calendar, Gavel, Plus, Trash2, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function JailerDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("prisoners");

  const renderContent = () => {
    switch (activeSection) {
      case "prisoners":
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Manage Prisoners</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Prisoner
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Cell Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>P001</TableCell>
                    <TableCell>Karthik Y H</TableCell>
                    <TableCell>35</TableCell>
                    <TableCell>A-101</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      case "wages":
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Wage Management</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Wage Record
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prisoner ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Work Type</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>P001</TableCell>
                    <TableCell>Karthik Y H</TableCell>
                    <TableCell>Kitchen</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>$50</TableCell>
                    <TableCell>2024-03-20</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      case "medical":
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Medical Records</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Medical Record
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prisoner ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Last Checkup</TableHead>
                    <TableHead>Next Appointment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>P001</TableCell>
                    <TableCell>Karthik Y H</TableCell>
                    <TableCell>Hypertension</TableCell>
                    <TableCell>Lisinopril</TableCell>
                    <TableCell>2024-03-15</TableCell>
                    <TableCell>2024-04-15</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      case "appointments":
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Appointment Management</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prisoner ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>P001</TableCell>
                    <TableCell>Karthik Y H</TableCell>
                    <TableCell>Suhaib Kng</TableCell>
                    <TableCell>Spouse</TableCell>
                    <TableCell>2024-03-25</TableCell>
                    <TableCell>14:00</TableCell>
                    <TableCell>Approved</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      case "hearings":
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Court Hearing Schedule</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Hearing
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prisoner ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Case Number</TableHead>
                    <TableHead>Court</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>P001</TableCell>
                    <TableCell>Karthik Y H</TableCell>
                    <TableCell>CR-2024-001</TableCell>
                    <TableCell>District Court</TableCell>
                    <TableCell>2024-04-01</TableCell>
                    <TableCell>10:00</TableCell>
                    <TableCell>Bail Hearing</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
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
    <div className="p-8">
      {renderContent()}
    </div>
  );
} 