"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiService, Prisoner, Wage } from "@/lib/api";
import { DollarSign, Plus } from "lucide-react";
import { toast } from "sonner";

export default function JailerWagesPage() {
  const [prisoners, setPrisoners] = useState<Prisoner[]>([]);
  const [wages, setWages] = useState<Wage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPrisoner, setSelectedPrisoner] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prisonersData, wagesData] = await Promise.all([
          apiService.prisoners.getAll() as Promise<Prisoner[]>,
          apiService.wages.getAll() as Promise<Wage[]>,
        ]);
        setPrisoners(prisonersData);
        setWages(wagesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddWage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.wages.create({
        prisoner_id: parseInt(selectedPrisoner),
        amount: parseFloat(amount),
        payment_date: date,
        status: "pending",
      }) as Wage;

      setWages([...wages, response]);
      setIsDialogOpen(false);
      toast.success("Wage record added successfully");
      
      // Reset form
      setSelectedPrisoner("");
      setAmount("");
      setDate("");
    } catch (error) {
      console.error("Error adding wage:", error);
      toast.error("Failed to add wage record");
    }
  };

  const handleUpdateStatus = async (wageId: number, newStatus: string) => {
    try {
      await apiService.wages.update(wageId, newStatus);
      setWages(wages.map(wage => 
        wage.id === wageId ? { ...wage, status: newStatus } : wage
      ));
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalWages = wages.reduce((sum, wage) => sum + wage.amount, 0);
  const pendingWages = wages.filter(wage => wage.status === "pending");
  const averageWage = wages.length > 0 ? totalWages / wages.length : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Wage Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Wage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Wage Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddWage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prisoner">Prisoner</Label>
                <Select value={selectedPrisoner} onValueChange={setSelectedPrisoner}>
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
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Payment Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Wage Record
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wages Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWages.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {wages.length} records
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingWages.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Wage</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageWage.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Per payment
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Wage Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prisoner</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wages.map((wage) => {
                const prisoner = prisoners.find(p => p.id === wage.prisoner_id);
                return (
                  <TableRow key={wage.id}>
                    <TableCell>{prisoner?.name}</TableCell>
                    <TableCell>${wage.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(wage.payment_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        wage.status === "paid" ? "bg-green-100 text-green-800" :
                        wage.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {wage.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {wage.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(wage.id, "paid")}
                        >
                          Mark as Paid
                        </Button>
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