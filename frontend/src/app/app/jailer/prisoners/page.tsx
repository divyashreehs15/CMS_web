"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Edit2, Trash2, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function PrisonersPage() {
  const router = useRouter();

  const handleViewPrisoner = (id: string) => {
    router.push(`/app/jailer/prisoners/${id}`);
  };

  const handleEditPrisoner = (id: string) => {
    router.push(`/app/jailer/prisoners/${id}/edit`);
  };

  const handleAddPrisoner = () => {
    router.push('/app/jailer/prisoners/add');
  };

  const handleDeletePrisoner = (id: string) => {
    // TODO: Implement delete functionality with confirmation dialog
    console.log('Delete prisoner:', id);
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Prisoners</CardTitle>
          <Button onClick={handleAddPrisoner}>
            <UserPlus className="w-4 h-4 mr-2" />
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
                <TableHead>Phone</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Cell Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Crime Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>P001</TableCell>
                <TableCell>Karthik YH</TableCell>
                <TableCell>35</TableCell>
                <TableCell>+1 234-567-8900</TableCell>
                <TableCell>O+</TableCell>
                <TableCell>A-101</TableCell>
                <TableCell>
                  <Badge variant="default">Active</Badge>
                </TableCell>
                <TableCell>Robbery</TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewPrisoner('P001')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditPrisoner('P001')}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600"
                    onClick={() => handleDeletePrisoner('P001')}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
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