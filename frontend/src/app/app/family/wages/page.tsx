"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Calendar, TrendingUp } from "lucide-react";

// Mock data - replace with actual data from your backend
const mockWages = [
  { id: "W001", date: "2024-03-15", amount: 150, workAssignment: "Kitchen", status: "Paid" },
  { id: "W002", date: "2024-03-08", amount: 120, workAssignment: "Maintenance", status: "Paid" },
  { id: "W003", date: "2024-03-01", amount: 180, workAssignment: "Workshop", status: "Paid" },
];

export default function FamilyWagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Wage Information</h2>
        <p className="text-muted-foreground">
          View wage details and payment history
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$450</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Assignment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Kitchen</div>
            <p className="text-xs text-muted-foreground">
              Started March 1, 2024
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">
              From last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            Recent wage payments and work assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Work Assignment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWages.map((wage) => (
                <TableRow key={wage.id}>
                  <TableCell>{wage.date}</TableCell>
                  <TableCell>{wage.workAssignment}</TableCell>
                  <TableCell>${wage.amount}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      {wage.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wage Information</CardTitle>
          <CardDescription>
            Important details about the wage system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Payment Schedule</h3>
            <p className="text-sm text-muted-foreground">
              Wages are paid weekly on Fridays. The amount is based on the work assignment and hours completed.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Work Assignments</h3>
            <p className="text-sm text-muted-foreground">
              Different work assignments have different wage rates. Kitchen work pays $15/hour, Maintenance pays $12/hour, and Workshop pays $18/hour.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Payment Method</h3>
            <p className="text-sm text-muted-foreground">
              Wages are automatically credited to the prisoner's account. Family members can view the balance and transaction history.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 