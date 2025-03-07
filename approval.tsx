
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function ApprovalPage() {
  const { toast } = useToast();
  
  // Fetch all attendance records
  const { data: attendance, isLoading } = useQuery({
    queryKey: ["/api/attendance/pending"],
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      return apiRequest("PATCH", `/api/attendance/${id}/approve`, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/pending"] });
      toast({
        title: "Berhasil",
        description: "Status presensi telah diperbarui",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Terjadi kesalahan saat memperbarui status presensi",
      });
    },
  });

  const handleApprove = (id: number, approved: boolean) => {
    approveMutation.mutate({ id, approved });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Approval Presensi</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menunggu Approval</CardTitle>
          <CardDescription>Daftar presensi yang menunggu persetujuan</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Memuat data...</div>
          ) : attendance?.records?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Tidak ada presensi yang menunggu persetujuan
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jam Masuk</TableHead>
                  <TableHead>Jam Keluar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance?.records?.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.userName || "John Doe"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.checkInTime), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.checkInTime), "HH:mm")}
                    </TableCell>
                    <TableCell>
                      {record.checkOutTime 
                        ? format(new Date(record.checkOutTime), "HH:mm") 
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "present"
                            ? "default"
                            : record.status === "late"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {record.status === "present"
                          ? "Hadir"
                          : record.status === "late"
                          ? "Terlambat"
                          : "Tidak Hadir"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-green-500"
                          onClick={() => handleApprove(record.id, true)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => handleApprove(record.id, false)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
