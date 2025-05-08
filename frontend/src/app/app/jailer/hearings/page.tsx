"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function HearingsPage() {
  return (
    <div className="p-8">
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
    </div>
  );
} 