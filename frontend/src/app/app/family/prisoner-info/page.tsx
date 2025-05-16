"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { prisonersApi } from "@/lib/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Prisoner {
  id: number;
  prisoner_id: string;
  name: string;
  age: number;
  gender: string;
  cell_number: string;
  admission_date: string;
  expected_release_date: string;
  status: string;
  category: string;
  health_info: {
    status: string;
    last_checkup: string;
    conditions: string[];
    medications: string[];
    dietary_restrictions: string;
  };
  work_info: {
    assignment: string;
    start_date: string;
    hours_per_week: number;
    wage_rate: number;
    performance: string;
  };
  legal_info: {
    case_number: string;
    sentence: string;
    next_court_date: string;
    parole_eligibility_date: string;
  };
  behavior_info: {
    conduct: string;
    last_incident: string | null;
    privileges: string[];
    restrictions: string[];
  };
}

export default function PrisonerInfoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [prisoner, setPrisoner] = useState<Prisoner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connectedPrisoners, setConnectedPrisoners] = useState<Prisoner[]>([]);

  useEffect(() => {
    // Redirect if not logged in or not a family member
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'family') {
      router.push('/app/jailer/prisoners');
      return;
    }

    const fetchConnectedPrisoners = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/family/prisoners', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch connected prisoners');
        }
        const data = await response.json();
        setConnectedPrisoners(data);
        
        // If there are connected prisoners, fetch the first one's details
        if (data.length > 0) {
          fetchPrisoner(data[0].id);
        } else {
          setLoading(false);
          setError("No prisoners connected to your account. Please contact the jailer to connect a prisoner.");
        }
      } catch (err: any) {
        console.error('Error fetching connected prisoners:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchPrisoner = async (prisonerId: number) => {
      try {
        setLoading(true);
        const data = await prisonersApi.getById(prisonerId) as Prisoner;
        setPrisoner(data);
      } catch (err: any) {
        console.error('Error fetching prisoner:', err);
        setError(err.response?.data?.message || err.message || "Failed to fetch prisoner details");
      } finally {
        setLoading(false);
      }
    };

    fetchConnectedPrisoners();
  }, [user, router]);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!prisoner) {
    return (
      <div className="p-8">
        <Alert>
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Prisoner information not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prisoner Information</h1>
        {connectedPrisoners.length > 1 && (
          <div className="flex gap-2">
            {connectedPrisoners.map((p) => (
              <Button
                key={p.id}
                variant={p.id === prisoner.id ? "default" : "outline"}
                onClick={() => router.push(`/app/family/prisoner-info?id=${p.id}`)}
              >
                {p.name}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Prisoner ID</p>
                <p>{prisoner.prisoner_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{prisoner.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p>{prisoner.age}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p>{prisoner.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cell Number</p>
                <p>{prisoner.cell_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p>{prisoner.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p>{prisoner.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Admission Date</p>
                <p>{new Date(prisoner.admission_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Expected Release Date</p>
                <p>{new Date(prisoner.expected_release_date).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card>
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p>{prisoner.health_info?.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Checkup</p>
                <p>{new Date(prisoner.health_info?.last_checkup).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Conditions</p>
                <p>{prisoner.health_info?.conditions?.join(", ") || "None"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Medications</p>
                <p>{prisoner.health_info?.medications?.join(", ") || "None"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Dietary Restrictions</p>
                <p>{prisoner.health_info?.dietary_restrictions || "None"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle>Work Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Assignment</p>
                <p>{prisoner.work_info?.assignment}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p>{new Date(prisoner.work_info?.start_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Hours per Week</p>
                <p>{prisoner.work_info?.hours_per_week}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Wage Rate</p>
                <p>${prisoner.work_info?.wage_rate?.toFixed(2)}/hour</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Performance</p>
                <p>{prisoner.work_info?.performance}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Legal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Case Number</p>
                <p>{prisoner.legal_info?.case_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sentence</p>
                <p>{prisoner.legal_info?.sentence}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Next Court Date</p>
                <p>{new Date(prisoner.legal_info?.next_court_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Parole Eligibility Date</p>
                <p>{new Date(prisoner.legal_info?.parole_eligibility_date).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Behavior Information */}
        <Card>
          <CardHeader>
            <CardTitle>Behavior Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Conduct</p>
                <p>{prisoner.behavior_info?.conduct}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Incident</p>
                <p>{prisoner.behavior_info?.last_incident || "None"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Privileges</p>
                <p>{prisoner.behavior_info?.privileges?.join(", ") || "None"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Restrictions</p>
                <p>{prisoner.behavior_info?.restrictions?.join(", ") || "None"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 