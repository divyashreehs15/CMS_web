"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MedicalPage() {
  return (
    <div className="p-8">
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
    </div>
  );
} 