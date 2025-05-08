"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiService, Prisoner, VisitRequest } from "@/lib/api";
import { Plus, Search, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

export default function VisitsPage() {
  const [prisoners, setPrisoners] = useState<Prisoner[]>([]);
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    prisoner_id: "",
    visitor_name: "",
    visitor_phone: "",
    relationship: "",
    visit_date: "",
    visit_time: "",
    duration: "30",
    purpose: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prisonersData, visitsData] = await Promise.all([
        apiService.prisoners.getAll() as Promise<Prisoner[]>,
        apiService.visits.getAll() as Promise<VisitRequest[]>,
      ]);
      setPrisoners(prisonersData);
      setVisits(visitsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.visits.create({
        prisoner_id: parseInt(formData.prisoner_id),
        visitor_name: formData.visitor_name,
        visitor_phone: formData.visitor_phone,
        relationship: formData.relationship,
        visit_date: formData.visit_date,
        visit_time: formData.visit_time,
        duration: parseInt(formData.duration),
        purpose: formData.purpose,
        status: "pending",
      });

      setIsDialogOpen(false);
      fetchData();
      resetForm();
      toast.success("Visit request added successfully");
    } catch (error) {
      console.error("Error adding visit:", error);
      toast.error("Failed to add visit request");
    }
  };

  const handleUpdateStatus = async (visitId: number, newStatus: string) => {
    try {
      await apiService.visits.update(visitId, newStatus);
      setVisits(visits.map(visit => 
        visit.id === visitId ? { ...visit, status: newStatus } : visit
      ));
      toast.success("Visit status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update visit status");
    }
  };

  const resetForm = () => {
    setFormData({
      prisoner_id: "",
      visitor_name: "",
      visitor_phone: "",
      relationship: "",
      visit_date: "",
      visit_time: "",
      duration: "30",
      purpose: "",
    });
  };

  const filteredVisits = visits.filter(visit => {
    const prisoner = prisoners.find(p => p.id === visit.prisoner_id);
    return (
      prisoner?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.visitor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.visitor_phone.includes(searchQuery)
    );
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Visit Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Visit Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Visit Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prisoner">Prisoner</Label>
                <Select
                  value={formData.prisoner_id}
                  onValueChange={(value) => setFormData({ ...formData, prisoner_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select prisoner" />
                  </SelectTrigger>
                  <SelectContent>
                    {prisoners.map((prisoner) => (
                      <SelectItem key={prisoner.id} value={prisoner.id.toString()}>
                        {prisoner.name} ({prisoner.prisoner_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitor_name">Visitor Name</Label>
                <Input
                  id="visitor_name"
                  value={formData.visitor_name}
                  onChange={(e) => setFormData({ ...formData, visitor_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitor_phone">Visitor Phone</Label>
                <Input
                  id="visitor_phone"
                  value={formData.visitor_phone}
                  onChange={(e) => setFormData({ ...formData, visitor_phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="lawyer">Lawyer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visit_date">Visit Date</Label>
                  <Input
                    id="visit_date"
                    type="date"
                    value={formData.visit_date}
                    onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visit_time">Visit Time</Label>
                  <Input
                    id="visit_time"
                    type="time"
                    value={formData.visit_time}
                    onChange={(e) => setFormData({ ...formData, visit_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
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
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Visit</Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Visit Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search visits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visit Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prisoner</TableHead>
                <TableHead>Visitor</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.map((visit) => {
                const prisoner = prisoners.find(p => p.id === visit.prisoner_id);
                return (
                  <TableRow key={visit.id}>
                    <TableCell>{prisoner?.name}</TableCell>
                    <TableCell>
                      <div>{visit.visitor_name}</div>
                      <div className="text-sm text-muted-foreground">{visit.visitor_phone}</div>
                    </TableCell>
                    <TableCell>{visit.relationship}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(visit.visit_date).toLocaleDateString()}</span>
                        <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                        <span>{visit.visit_time}</span>
                      </div>
                    </TableCell>
                    <TableCell>{visit.duration} minutes</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        visit.status === "approved" ? "bg-green-100 text-green-800" :
                        visit.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {visit.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {visit.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(visit.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(visit.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 