import { useQuery } from "@tanstack/react-query";
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
import { format } from "date-fns";

export default function AdminEmployees() {
  const { data: employees } = useQuery({
    queryKey: ["/api/users"],
  });

  const { data: attendance } = useQuery({
    queryKey: ["/api/attendance"],
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Kelola Karyawan</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Karyawan</CardTitle>
          <CardDescription>Menampilkan semua karyawan aktif</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status Hari Ini</TableHead>
                <TableHead>Terakhir Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees?.users?.map((employee: any) => {
                const todayAttendance = attendance?.records?.find(
                  (record: any) => record.userId === employee.id
                );

                return (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.username}</TableCell>
                    <TableCell>
                      <Badge variant={employee.role === "admin" ? "default" : "secondary"}>
                        {employee.role === "admin" ? "Administrator" : "Karyawan"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {todayAttendance ? (
                        <Badge
                          variant={
                            todayAttendance.status === "present"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {todayAttendance.status === "present"
                            ? "Hadir"
                            : "Terlambat"}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Belum Hadir</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(), "dd/MM/yyyy HH:mm")}
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
