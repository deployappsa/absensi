import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/sidebar";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Attendance from "@/pages/attendance";
import Payroll from "@/pages/payroll";
import Timeline from "@/pages/timeline";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminShifts from "@/pages/admin/shifts";
import AdminEmployees from "@/pages/admin/employees";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import ApprovalPage from "@/pages/admin/approval"; // Added import
import ClientVisits from "@/pages/admin/visits"; // Added import

export default function App() {
  const [location] = useLocation();
  const isLoginPage = location === "/login";

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`flex min-h-screen ${isLoginPage ? 'bg-white' : ''}`}>
        {!isLoginPage && <Sidebar />}
        <div className={`${isLoginPage ? 'w-full' : 'flex-1'}`}>
          {!isLoginPage && <MobileNav />}
          <main className={`${isLoginPage ? 'w-full' : 'container mx-auto py-6 px-4'}`}>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/attendance" component={Attendance} />
              <Route path="/payroll" component={Payroll} />
              <Route path="/timeline" component={Timeline} />
              <Route path="/admin/dashboard" component={AdminDashboard} />
              <Route path="/admin/shifts" component={AdminShifts} />
              <Route path="/admin/employees" component={AdminEmployees} />
              <Route path="/login" component={Login} />
              <Route path="/settings" component={Settings} />
              <Route path="/admin/approval" component={ApprovalPage} /> {/* Added route */}
              <Route path="/admin/visits" component={ClientVisits} /> {/* Added route */}
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}