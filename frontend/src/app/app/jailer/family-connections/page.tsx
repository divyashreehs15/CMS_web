"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { familyApi, prisonersApi } from "@/lib/api";

interface FamilyMember {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface Prisoner {
  id: number;
  prisoner_id: string;
  name: string;
}

interface Connection {
  id: number;
  family_member_id: number;
  prisoner_id: number;
  family_member: FamilyMember;
  prisoner: Prisoner;
}

export default function FamilyConnectionsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connections, setConnections] = useState<Connection[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [prisoners, setPrisoners] = useState<Prisoner[]>([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>("");
  const [selectedPrisoner, setSelectedPrisoner] = useState<string>("");

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    if (user.role !== 'jailer') {
      router.push('/app/family/prisoner-info');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all connections
        const connectionsData = await familyApi.getConnections();
        setConnections(Array.isArray(connectionsData) ? connectionsData : []);

        // Fetch all family members
        const familyResponse = await fetch('http://localhost:5000/api/auth/family-members', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!familyResponse.ok) {
          throw new Error('Failed to fetch family members');
        }
        const familyData = await familyResponse.json();
        setFamilyMembers(Array.isArray(familyData) ? familyData : []);

        // Fetch all prisoners
        try {
          const prisonersData = await prisonersApi.getAll();
          console.log('Prisoners data:', prisonersData); // Debug log
          if (!Array.isArray(prisonersData)) {
            console.error('Prisoners data is not an array:', prisonersData);
            setError('Invalid prisoners data format');
            return;
          }
          setPrisoners(prisonersData);
        } catch (err: any) {
          console.error('Error fetching prisoners:', err);
          if (err.response?.status === 401 || err.response?.status === 403) {
            router.push('/login');
            return;
          }
          setError('Failed to fetch prisoners');
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        if (err.message === 'Unauthorized' || err.message === 'Not authorized') {
          router.push('/login');
          return;
        }
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token, router]);

  const handleCreateConnection = async () => {
    try {
      if (!selectedFamilyMember || !selectedPrisoner) {
        setError("Please select both a family member and a prisoner");
        return;
      }

      await familyApi.connectPrisoner({
        family_member_id: parseInt(selectedFamilyMember),
        prisoner_id: parseInt(selectedPrisoner)
      });
      
      // Refresh connections list
      const connectionsData = await familyApi.getConnections();
      setConnections(Array.isArray(connectionsData) ? connectionsData : []);

      // Reset form
      setSelectedFamilyMember("");
      setSelectedPrisoner("");
      setError("");
    } catch (err: any) {
      console.error('Error creating connection:', err);
      if (err.message === 'Unauthorized' || err.message === 'Not authorized') {
        router.push('/login');
        return;
      }
      setError(err.message || 'Failed to create connection');
    }
  };

  const handleDeleteConnection = async (connectionId: number) => {
    try {
      await familyApi.deleteConnection(connectionId);

      // Refresh connections list
      const connectionsData = await familyApi.getConnections();
      setConnections(Array.isArray(connectionsData) ? connectionsData : []);
    } catch (err: any) {
      console.error('Error deleting connection:', err);
      if (err.message === 'Unauthorized' || err.message === 'Not authorized') {
        router.push('/login');
        return;
      }
      setError(err.message || 'Failed to delete connection');
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Family Connections</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="family-member">Family Member</Label>
              <Select
                value={selectedFamilyMember}
                onValueChange={setSelectedFamilyMember}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a family member" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(familyMembers) && familyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prisoner">Prisoner</Label>
              <Select
                value={selectedPrisoner}
                onValueChange={setSelectedPrisoner}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a prisoner" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(prisoners) && prisoners.map((prisoner) => (
                    <SelectItem key={prisoner.id} value={prisoner.id.toString()}>
                      {prisoner.name} ({prisoner.prisoner_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="mt-6"
            onClick={handleCreateConnection}
            disabled={!selectedFamilyMember || !selectedPrisoner}
          >
            Create Connection
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connections.length === 0 ? (
              <p className="text-gray-500">No connections found</p>
            ) : (
              connections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {connection.family_member.name} ({connection.family_member.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      Connected to: {connection.prisoner.name} ({connection.prisoner.prisoner_id})
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteConnection(connection.id)}
                  >
                    Remove Connection
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 