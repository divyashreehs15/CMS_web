"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MessageSquare } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function FamilyAppointmentsPage() {
  const router = useRouter();

  const handleScheduleAppointment = () => {
    router.push('/app/family/appointments/schedule');
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Visit Appointments</CardTitle>
          <Button onClick={handleScheduleAppointment}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Visit
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Prisoner Name</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>AP001</TableCell>
                <TableCell>Karthik YH</TableCell>
                <TableCell>2024-04-01</TableCell>
                <TableCell>14:00</TableCell>
                <TableCell>1 hour</TableCell>
                <TableCell>
                  <Badge variant="secondary">Pending</Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Appointment Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Request ID</p>
                          <p className="font-medium">AP001</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Prisoner</p>
                          <p className="font-medium">Karthik YH</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Visit Time</p>
                          <p className="font-medium">April 1, 2024 at 14:00</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">1 hour</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Purpose of Visit</p>
                          <p className="font-medium">Regular family visit</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Additional Notes</p>
                          <p className="font-medium">Bringing necessary documents for legal proceedings</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 