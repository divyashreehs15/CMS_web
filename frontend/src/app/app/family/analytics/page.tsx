"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService, Prisoner, VisitRequest, Wage, LegalInfo } from "@/lib/api";
import { User, Calendar, DollarSign, FileText } from "lucide-react";

interface FamilyStats {
  prisoner: Prisoner | null;
  visits: VisitRequest[];
  wages: Wage[];
  legalInfo: {
    next_hearing_date: string;
    case_status: string;
  };
}

export default function FamilyAnalyticsPage() {
  const [stats, setStats] = useState<FamilyStats>({
    prisoner: null,
    visits: [],
    wages: [],
    legalInfo: {
      next_hearing_date: "",
      case_status: "",
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get user from localStorage
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          throw new Error("User not found");
        }
        const user = JSON.parse(userStr);

        // Fetch prisoner info (assuming first prisoner for now)
        const prisoners = await apiService.prisoners.getAll() as Prisoner[];
        const prisoner = prisoners[0]; // In a real app, you'd get the specific prisoner

        // Fetch related data
        const [visits, wages, legal] = await Promise.all([
          apiService.visits.getByPrisonerId(prisoner.id) as Promise<VisitRequest[]>,
          apiService.wages.getByPrisonerId(prisoner.id) as Promise<Wage[]>,
          apiService.legal.getByPrisonerId(prisoner.id) as Promise<LegalInfo>,
        ]);

        setStats({
          prisoner,
          visits,
          wages,
          legalInfo: {
            next_hearing_date: legal.next_hearing_date || "",
            case_status: legal.status || "",
          },
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Family Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prisoner Info</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prisoner?.name}</div>
            <p className="text-xs text-muted-foreground">
              Cell: {stats.prisoner?.cell_number}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Visit</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.visits[0]?.visit_date || "No visits scheduled"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.visits[0]?.status || "No pending visits"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Wages</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.wages[0]?.amount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Last payment: {stats.wages[0]?.payment_date || "No payments"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Legal Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.legalInfo.case_status}</div>
            <p className="text-xs text-muted-foreground">
              Next hearing: {stats.legalInfo.next_hearing_date || "Not scheduled"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 