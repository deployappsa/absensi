import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertShiftSchema } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function AdminShifts() {
  const { toast } = useToast();
  const { data: shifts } = useQuery({
    queryKey: ["/api/shifts"],
  });

  const form = useForm({
    resolver: zodResolver(insertShiftSchema),
    defaultValues: {
      name: "",
      startTime: "",
      endTime: "",
      allowedLocations: [],
    },
  });

  const createShiftMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/shifts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shifts"] });
      form.reset();
      toast({
        title: "Success",
        description: "Shift created successfully",
      });
    },
  });

  async function onSubmit(data: any) {
    try {
      // Convert comma-separated locations to array
      const locations = data.allowedLocations
        .split(",")
        .map((loc: string) => loc.trim())
        .filter(Boolean);

      await createShiftMutation.mutateAsync({
        ...data,
        allowedLocations: locations,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Shifts</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Shift</CardTitle>
          <CardDescription>Create a new work shift schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Morning Shift" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="allowedLocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Locations (comma separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. -6.2088,106.8456, -6.2089,106.8457"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={createShiftMutation.isPending}>
                <Plus className="mr-2 h-4 w-4" />
                {createShiftMutation.isPending ? "Creating..." : "Create Shift"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Shifts</CardTitle>
          <CardDescription>All configured work shifts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Allowed Locations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts?.shifts.map((shift: any) => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium">{shift.name}</TableCell>
                  <TableCell>{shift.startTime}</TableCell>
                  <TableCell>{shift.endTime}</TableCell>
                  <TableCell>
                    {shift.allowedLocations.join(", ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
