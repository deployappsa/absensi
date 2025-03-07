import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CameraComponent } from "@/components/camera";
import { GeoLocation } from "@/components/geo-location";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shift } from "@shared/schema";

type ShiftsResponse = {
  shifts: Shift[];
};

export default function Attendance() {
  const { toast } = useToast();
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);

  const { data: shifts } = useQuery<ShiftsResponse>({ 
    queryKey: ["/api/shifts"]
  });

  const checkInMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/attendance/check-in", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      toast({
        title: "Success",
        description: "Check-in recorded successfully",
      });
    },
  });

  const handleCheckIn = async () => {
    if (!photo || !location || !shifts?.shifts[0]) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please capture photo and allow location access",
      });
      return;
    }

    await checkInMutation.mutateAsync({
      shiftId: shifts.shifts[0].id,
      checkInTime: new Date().toISOString(),
      checkInPhoto: photo,
      checkInLocation: `${location.lat},${location.lng}`,
      status: "present",
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl">Absensi</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs defaultValue="camera" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="camera" className="flex-1">Foto</TabsTrigger>
              <TabsTrigger value="location" className="flex-1">Lokasi</TabsTrigger>
            </TabsList>
            <TabsContent value="camera">
              <CameraComponent onCapture={setPhoto} />
            </TabsContent>
            <TabsContent value="location">
              <GeoLocation onLocation={setLocation} />
            </TabsContent>
          </Tabs>

          <Button 
            className="w-full mt-4 py-6 text-lg" 
            onClick={handleCheckIn}
            disabled={checkInMutation.isPending || !photo || !location}
          >
            {checkInMutation.isPending ? "Memproses..." : "Absen Sekarang"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}