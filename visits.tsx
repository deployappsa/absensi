
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
import { format } from "date-fns";

export default function ClientVisits() {
  // This is a placeholder as the API endpoint doesn't exist yet
  const { data: visits, isLoading } = useQuery({
    queryKey: ["/api/visits"],
    enabled: false, // Disabled until API endpoint exists
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Kunjungan Klien</h1>
        <Button>Tambah Kunjungan</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kunjungan</CardTitle>
          <CardDescription>Seluruh jadwal kunjungan ke klien</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            Fitur kunjungan klien sedang dalam pengembangan
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
