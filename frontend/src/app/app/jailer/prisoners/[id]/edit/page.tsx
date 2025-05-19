"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { prisonersApi, Prisoner } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface PageProps {
  params: {
    id: string;
  };
}

interface PrisonerFormData {
  name: string;
  age: string;
  gender: string;
  cell_number: string;
  sentence_start: string;
  sentence_end: string;
  security_level: string;
  crime_type: string;
}

export default function EditPrisonerPage({ params }: PageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [prisoner, setPrisoner] = useState<Prisoner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<PrisonerFormData>({
    name: "",
    age: "",
    gender: "",
    cell_number: "",
    sentence_start: "",
    sentence_end: "",
    security_level: "",
    crime_type: ""
  });

  useEffect(() => {
    if (!user || user.role !== "jailer") {
      router.push("/login");
      return;
    }

    const fetchPrisoner = async () => {
      try {
        const data = await prisonersApi.getById(parseInt(params.id)) as Prisoner;
        setPrisoner(data);
        setFormData({
          name: data.name,
          age: data.age.toString(),
          gender: data.gender,
          cell_number: data.cell_number,
          sentence_start: data.sentence_start,
          sentence_end: data.sentence_end,
          security_level: data.security_level,
          crime_type: data.crime_type
        });
      } catch (err: any) {
        console.error("Error fetching prisoner:", err);
        setError(err.response?.data?.message || "Failed to fetch prisoner details");
      } finally {
        setLoading(false);
      }
    };

    fetchPrisoner();
  }, [params.id, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 0) {
        throw new Error("Age must be a positive number");
      }

      const updateData: Partial<Prisoner> = {
        name: formData.name.trim(),
        age,
        gender: formData.gender,
        cell_number: formData.cell_number.trim(),
        sentence_start: formData.sentence_start,
        sentence_end: formData.sentence_end,
        security_level: formData.security_level as "low" | "medium" | "high",
        crime_type: formData.crime_type.trim()
      };

      await prisonersApi.update(parseInt(params.id), updateData);

      toast.success("Prisoner updated successfully");
      router.push("/app/jailer/prisoners");
    } catch (err: any) {
      console.error("Error updating prisoner:", err);
      toast.error(err.response?.data?.message || "Failed to update prisoner");
    } finally {
      setLoading(false);
    }
  };

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
          <AlertDescription>Prisoner not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Prisoner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
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
                <Input
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                />
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
              <div className="space-y-2">
                <Label htmlFor="sentence_start">Sentence Start Date</Label>
                <Input
                  id="sentence_start"
                  type="date"
                  value={formData.sentence_start}
                  onChange={(e) => setFormData({ ...formData, sentence_start: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sentence_end">Expected Release Date</Label>
                <Input
                  id="sentence_end"
                  type="date"
                  value={formData.sentence_end}
                  onChange={(e) => setFormData({ ...formData, sentence_end: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="security_level">Security Level</Label>
                <Input
                  id="security_level"
                  value={formData.security_level}
                  onChange={(e) => setFormData({ ...formData, security_level: e.target.value })}
                  required
                />
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
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/app/jailer/prisoners")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 