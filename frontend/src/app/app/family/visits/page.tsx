"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function VisitsPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Visit Requests</CardTitle>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Request Visit
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Prisoner Name</TableHead>
                <TableHead>Visitor Name</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead>Requested Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>VR001</TableCell>
                <TableCell>Karthik Y H</TableCell>
                <TableCell>Suhaib King</TableCell>
                <TableCell>Spouse</TableCell>
                <TableCell>2024-04-01</TableCell>
                <TableCell>10:00 AM</TableCell>
                <TableCell>Pending</TableCell>
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