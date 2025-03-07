import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Success",
      description: "Pengaturan berhasil disimpan",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pengaturan</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Informasi Perusahaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nama Perusahaan</Label>
            <Input id="company-name" defaultValue="PT Example Indonesia" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company-address">Alamat</Label>
            <Input id="company-address" defaultValue="Jl. Contoh No. 123" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company-phone">Nomor Telepon</Label>
            <Input id="company-phone" defaultValue="021-1234567" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Absensi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="late-threshold">Batas Keterlambatan (Menit)</Label>
            <Input 
              id="late-threshold" 
              type="number" 
              defaultValue="15"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location-radius">Radius Lokasi (Meter)</Label>
            <Input 
              id="location-radius" 
              type="number" 
              defaultValue="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="work-days">Hari Kerja</Label>
            <Select defaultValue="mon-fri">
              <SelectTrigger id="work-days">
                <SelectValue placeholder="Pilih hari kerja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mon-fri">Senin - Jumat</SelectItem>
                <SelectItem value="mon-sat">Senin - Sabtu</SelectItem>
                <SelectItem value="custom">Kustom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifikasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-notifications">Email Notifikasi</Label>
            <Input 
              id="email-notifications" 
              type="email" 
              defaultValue="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Jenis Notifikasi</Label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis notifikasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="attendance">Hanya Absensi</SelectItem>
                <SelectItem value="leaves">Hanya Cuti</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
}
