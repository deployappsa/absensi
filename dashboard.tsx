import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Clock, Wallet, Calendar, DollarSign, X, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns"; //Import from original file


export default function Dashboard() {
  const { data: userData } = useQuery({ queryKey: ["/api/users/me"] });
  const { data: attendanceData } = useQuery({ queryKey: ["/api/attendance"] });
  const { data: leavesData } = useQuery({ queryKey: ["/api/leaves"] });

  const user = userData?.user;
  const isAdmin = user?.role === "admin";

  // Mendapatkan data untuk hari ini
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Get last attendance (for check-in status)
  const lastAttendance = attendanceData?.records?.[0];
  const isCheckedIn = lastAttendance && !lastAttendance.checkOutTime && 
                       new Date(lastAttendance.checkInTime).toDateString() === today.toDateString();

  async function handleCheckIn() {
    // Implement check-in functionality
    alert("Fitur check-in akan diimplementasikan");
  }

  async function handleCheckOut() {
    // Implement check-out functionality
    alert("Fitur check-out akan diimplementasikan");
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Silakan login terlebih dahulu</h1>
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </p>
        </div>
      </div>

      {/* Attendance Card */}
      <Card className="border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Presensi Hari Ini</CardTitle>
          <CardDescription>
            Rekam presensi masuk dan keluar kantor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Jam Masuk</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">
                      {isCheckedIn 
                        ? new Date(lastAttendance.checkInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                        : "--:--"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Jam Keluar</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">
                      {isCheckedIn && lastAttendance.checkOutTime
                        ? new Date(lastAttendance.checkOutTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                        : "--:--"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isCheckedIn ? "outline" : "default"}
                className={!isCheckedIn ? "bg-blue-600 hover:bg-blue-700" : ""}
                onClick={handleCheckIn}
                disabled={isCheckedIn}
              >
                <Check className="mr-2 h-4 w-4" />
                Check In
              </Button>
              <Button 
                variant={!isCheckedIn || (isCheckedIn && lastAttendance.checkOutTime) ? "outline" : "default"}
                className={isCheckedIn && !lastAttendance.checkOutTime ? "bg-blue-600 hover:bg-blue-700" : ""}
                onClick={handleCheckOut}
                disabled={!isCheckedIn || (isCheckedIn && lastAttendance.checkOutTime)}
              >
                <X className="mr-2 h-4 w-4" />
                Check Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sisa Cuti Tahunan</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">12 <span className="text-xs text-muted-foreground">hari</span></div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">dari 12 hari</span>
              </div>
            </div>
            <Progress value={100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Kasbon</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp0</div>
            <p className="text-xs text-muted-foreground">Tidak ada kasbon aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Slip Gaji</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mei 2024</div>
            <p className="text-xs text-muted-foreground">Slip gaji terakhir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pengumuman</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">Tidak ada pengumuman</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceData?.records?.slice(0, 5).map((record, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">
                    {record.checkOutTime ? "Check Out" : "Check In"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.checkOutTime || record.checkInTime).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}

            {(!attendanceData?.records || attendanceData.records.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada aktivitas
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}