"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiService, Prisoner } from "@/lib/api";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PrisonerFormData {
  name: string;
  prisoner_id: string;
  age: string;
  gender: string;
  cell_number: string;
  sentence_start: string;
  sentence_end: string;
  crime_type: string;
  security_level: "low" | "medium" | "high";
}

export default function PrisonersPage() {
  const [prisoners, setPrisoners] = useState<Prisoner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPrisoner, setEditingPrisoner] = useState<Prisoner | null>(null);
  const [formData, setFormData] = useState<PrisonerFormData>({
    name: "",
    prisoner_id: "",
    age: "",
    gender: "",
    cell_number: "",
    sentence_start: "",
    sentence_end: "",
    crime_type: "",
    security_level: "medium",
  });

  useEffect(() => {
    fetchPrisoners();
  }, []);

  const fetchPrisoners = async () => {
    try {
      const data = await apiService.prisoners.getAll() as Prisoner[];
      setPrisoners(data);
    } catch (error) {
      console.error("Error fetching prisoners:", error);
      toast.error("Failed to load prisoners");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.name || !formData.prisoner_id || !formData.age || !formData.gender || 
          !formData.cell_number || !formData.sentence_start || !formData.sentence_end || 
          !formData.crime_type || !formData.security_level) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate dates
      const startDate = new Date(formData.sentence_start);
      const endDate = new Date(formData.sentence_end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        toast.error("Invalid date format");
        return;
      }
      if (endDate < startDate) {
        toast.error("Sentence end date must be after start date");
        return;
      }

      // Ensure age is a valid number
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 0 || age > 120) {
        toast.error("Please enter a valid age");
        return;
      }

      // Format the data to match backend expectations
      const prisonerData = {
        prisoner_id: formData.prisoner_id.trim(),
        name: formData.name.trim(),
        age: age,
        gender: formData.gender,
        cell_number: formData.cell_number.trim(),
        admission_date: formData.sentence_start,
        expected_release_date: formData.sentence_end,
        status: 'active',
        category: formData.crime_type.trim(),
        health_info: {
          status: 'healthy',
          last_checkup: new Date().toISOString().split('T')[0],
          conditions: [],
          medications: [],
          dietary_restrictions: 'none'
        },
        work_info: {
          assignment: 'none',
          start_date: new Date().toISOString().split('T')[0],
          hours_per_week: 0,
          wage_rate: 0,
          performance: 'pending'
        },
        legal_info: {
          case_number: formData.prisoner_id,
          sentence: `${formData.sentence_start} to ${formData.sentence_end}`,
          next_court_date: formData.sentence_end,
          parole_eligibility_date: formData.sentence_end
        },
        behavior_info: {
          conduct: 'good',
          last_incident: null,
          privileges: ['standard'],
          restrictions: []
        }
      };

      // Log the data being sent
      console.log('Submitting prisoner data:', JSON.stringify(prisonerData, null, 2));

      if (editingPrisoner) {
        const response = await apiService.prisoners.update(editingPrisoner.id, prisonerData);
        console.log('Update response:', response);
        toast.success("Prisoner updated successfully");
      } else {
        const response = await apiService.prisoners.create(prisonerData);
        console.log('Create response:', response);
        toast.success("Prisoner added successfully");
      }
      setIsDialogOpen(false);
      fetchPrisoners();
      resetForm();
    } catch (error: any) {
      console.error("Error saving prisoner:", error);
      // Log the full error details
      console.error("Full error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      const errorMessage = error.response?.data?.message || error.message || "Failed to save prisoner";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (prisoner: Prisoner) => {
    setEditingPrisoner(prisoner);
    setFormData({
      name: prisoner.name,
      prisoner_id: prisoner.prisoner_id,
      age: prisoner.age.toString(),
      gender: prisoner.gender,
      cell_number: prisoner.cell_number,
      sentence_start: prisoner.sentence_start,
      sentence_end: prisoner.sentence_end,
      crime_type: prisoner.crime_type,
      security_level: prisoner.security_level,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this prisoner?")) {
      try {
        await apiService.prisoners.delete(id);
        toast.success("Prisoner deleted successfully");
        fetchPrisoners();
      } catch (error) {
        console.error("Error deleting prisoner:", error);
        toast.error("Failed to delete prisoner");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      prisoner_id: "",
      age: "",
      gender: "",
      cell_number: "",
      sentence_start: "",
      sentence_end: "",
      crime_type: "",
      security_level: "medium",
    });
    setEditingPrisoner(null);
  };

  const filteredPrisoners = prisoners.filter(prisoner =>
    prisoner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prisoner.prisoner_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prisoner.cell_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prisoner Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Prisoner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPrisoner ? "Edit Prisoner" : "Add New Prisoner"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prisoner_id">Prisoner ID</Label>
                <Input
                  id="prisoner_id"
                  value={formData.prisoner_id}
                  onChange={(e) => setFormData({ ...formData, prisoner_id: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cell_number">Cell Number</Label>
                <Input
                  id="cell_number"
                  value={formData.cell_number}
                  onChange={(e) => setFormData({ ...formData, cell_number: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sentence_start">Sentence Start</Label>
                  <Input
                    id="sentence_start"
                    type="date"
                    value={formData.sentence_start}
                    onChange={(e) => setFormData({ ...formData, sentence_start: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sentence_end">Sentence End</Label>
                  <Input
                    id="sentence_end"
                    type="date"
                    value={formData.sentence_end}
                    onChange={(e) => setFormData({ ...formData, sentence_end: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="crime_type">Crime Type</Label>
                <Input
                  id="crime_type"
                  value={formData.crime_type}
                  onChange={(e) => setFormData({ ...formData, crime_type: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="security_level">Security Level</Label>
                <Select
                  value={formData.security_level}
                  onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, security_level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                {editingPrisoner ? "Update Prisoner" : "Add Prisoner"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prisoners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prisoner List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Prisoner ID</TableHead>
                <TableHead>Cell Number</TableHead>
                <TableHead>Security Level</TableHead>
                <TableHead>Sentence End</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrisoners.map((prisoner) => (
                <TableRow key={prisoner.id}>
                  <TableCell>{prisoner.name}</TableCell>
                  <TableCell>{prisoner.prisoner_id}</TableCell>
                  <TableCell>{prisoner.cell_number}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      prisoner.security_level === "high" ? "bg-red-100 text-red-800" :
                      prisoner.security_level === "medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {prisoner.security_level}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(prisoner.sentence_end).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(prisoner)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(prisoner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 