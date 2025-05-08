"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Check, X, MessageSquare } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type AppointmentStatus = 'pending' | 'approved' | 'denied';

interface Appointment {
  id: string;
  prisonerName: string;
  visitorName: string;
  relationship: string;
  requestedDate: string;
  requestedTime: string;
  status: AppointmentStatus;
  purpose: string;
  notes: string;
}

const initialAppointments: Appointment[] = [
  {
    id: "AP001",
    prisonerName: "Karthik YH",
    visitorName: "Jane Doe",
    relationship: "Spouse",
    requestedDate: "2024-04-01",
    requestedTime: "14:00",
    status: "pending" as AppointmentStatus,
    purpose: "Regular family visit",
    notes: "Bringing necessary documents for legal proceedings"
  }
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [comment, setComment] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'deny' | null>(null);

  const handleAction = (appointment: Appointment, type: 'approve' | 'deny') => {
    setSelectedAppointment(appointment);
    setActionType(type);
    setComment("");
    setIsDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedAppointment) return;

    const updatedAppointments = appointments.map(app => {
      if (app.id === selectedAppointment.id) {
        return {
          ...app,
          status: actionType === 'approve' ? 'approved' : 'denied',
          notes: comment ? `${app.notes}\n\n${actionType === 'approve' ? 'Approval' : 'Denial'} Comment: ${comment}` : app.notes
        };
      }
      return app;
    });

    setAppointments(updatedAppointments);
    setIsDialogOpen(false);
    setSelectedAppointment(null);
    setComment("");
    setActionType(null);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'denied':
        return <Badge variant="destructive">Denied</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Appointment Management</CardTitle>
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
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.prisonerName}</TableCell>
                  <TableCell>{appointment.visitorName}</TableCell>
                  <TableCell>{appointment.relationship}</TableCell>
                  <TableCell>{appointment.requestedDate}</TableCell>
                  <TableCell>{appointment.requestedTime}</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="space-x-2">
                    {appointment.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(appointment, 'approve')}
                        >
                          <Check className="w-4 h-4 mr-2 text-green-600" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(appointment, 'deny')}
                        >
                          <X className="w-4 h-4 mr-2 text-red-600" />
                          Deny
                        </Button>
                      </>
                    )}
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
                            <p className="font-medium">{appointment.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Prisoner</p>
                            <p className="font-medium">{appointment.prisonerName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Visitor</p>
                            <p className="font-medium">{appointment.visitorName} ({appointment.relationship})</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Requested Time</p>
                            <p className="font-medium">{appointment.requestedDate} at {appointment.requestedTime}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Purpose of Visit</p>
                            <p className="font-medium">{appointment.purpose}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Additional Notes</p>
                            <p className="font-medium">{appointment.notes}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Deny'} Appointment
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'Add a comment for the approval (optional)'
                : 'Please provide a reason for denying this appointment'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder={`Enter your ${actionType === 'approve' ? 'comment' : 'reason'}...`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required={actionType === 'deny'}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={handleConfirmAction}
              disabled={actionType === 'deny' && !comment}
            >
              Confirm {actionType === 'approve' ? 'Approval' : 'Denial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 