
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Download, Upload, Filter } from "lucide-react";

export default function Payroll() {
  const [month, setMonth] = useState<string>(format(new Date(), "MMMM"));
  const [year, setYear] = useState<string>(format(new Date(), "yyyy"));
  
  const { data: employees } = useQuery({
    queryKey: ["/api/users"],
  });

  // Data penggajian dummy
  const payrollData = [
    {
      id: 1,
      name: "Ahmad Fauzi",
      position: "Software Engineer",
      department: "IT",
      basicSalary: 5000000,
      allowances: 1500000,
      overtime: 750000,
      deductions: 250000,
      netSalary: 7000000,
      status: "paid"
    },
    {
      id: 2,
      name: "Siti Rahayu",
      position: "Finance Manager",
      department: "Finance",
      basicSalary: 7000000,
      allowances: 2000000,
      overtime: 0,
      deductions: 350000,
      netSalary: 8650000,
      status: "paid"
    },
    {
      id: 3,
      name: "Budi Santoso",
      position: "Marketing Officer",
      department: "Marketing",
      basicSalary: 4500000,
      allowances: 1200000,
      overtime: 500000,
      deductions: 200000,
      netSalary: 6000000,
      status: "pending"
    },
    {
      id: 4,
      name: "Dewi Lestari",
      position: "HR Specialist",
      department: "HR",
      basicSalary: 4800000,
      allowances: 1300000,
      overtime: 0,
      deductions: 240000,
      netSalary: 5860000,
      status: "pending"
    }
  ];

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = ["2023", "2024", "2025"];

  const totalPaid = payrollData
    .filter(item => item.status === "paid")
    .reduce((sum, item) => sum + item.netSalary, 0);
  
  const totalPending = payrollData
    .filter(item => item.status === "pending")
    .reduce((sum, item) => sum + item.netSalary, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">Penggajian</h1>
        <div className="flex flex-wrap gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg md:text-xl">Total Penggajian</CardTitle>
            <CardDescription>{month} {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-primary">
              Rp {(totalPaid + totalPending).toLocaleString('id-ID')}
            </div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <span className="text-green-500 mr-1">↑ 4%</span>
              dari bulan sebelumnya
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg md:text-xl">Sudah Dibayar</CardTitle>
            <CardDescription>{month} {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-500">
              Rp {totalPaid.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              {payrollData.filter(item => item.status === "paid").length} karyawan
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg md:text-xl">Tertunda</CardTitle>
            <CardDescription>{month} {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-amber-500">
              Rp {totalPending.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              {payrollData.filter(item => item.status === "pending").length} karyawan
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle>Daftar Penggajian {month} {year}</CardTitle>
        </CardHeader>
        <CardContent className="-mx-4 sm:mx-0">
          <div className="min-w-[800px] sm:min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead className="text-right">Gaji Pokok</TableHead>
                  <TableHead className="text-right">Tunjangan</TableHead>
                  <TableHead className="text-right">Lembur</TableHead>
                  <TableHead className="text-right">Potongan</TableHead>
                  <TableHead className="text-right">Gaji Bersih</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.position}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell className="text-right">Rp {item.basicSalary.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">Rp {item.allowances.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">Rp {item.overtime.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">Rp {item.deductions.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-semibold">Rp {item.netSalary.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === "paid" ? "default" : "outline"}
                      >
                        {item.status === "paid" ? "Dibayar" : "Tertunda"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
