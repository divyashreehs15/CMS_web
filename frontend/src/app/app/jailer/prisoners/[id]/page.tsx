"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { prisonersApi } from "@/lib/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

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
  health_status: string;
  current_assignment: string;
  case_number: string;
  conduct: string;
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

export default function PrisonerDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [prisoner, setPrisoner] = useState<Prisoner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrisoner = async () => {
      try {
        const data = await prisonersApi.getById(parseInt(params.id)) as Prisoner;
        setPrisoner(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch prisoner details");
      } finally {
        setLoading(false);
      }
    };

    fetchPrisoner();
  }, [params.id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this prisoner?")) {
      try {
        await prisonersApi.delete(parseInt(params.id));
        router.push("/app/jailer/prisoners");
      } catch (err: any) {
        setError(err.message || "Failed to delete prisoner");
      }
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
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
    return <div className="p-8">Prisoner not found</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/app/jailer/prisoners">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Prisoners
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/app/jailer/prisoners/${params.id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" className="gap-2" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
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