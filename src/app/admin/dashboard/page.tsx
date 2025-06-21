"use client";

import { useQuery } from "@tanstack/react-query";
import { api, DashboardKPI } from "@/lib/api";
import { useProtectedRoute } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  // Protect the route for admin only
  useProtectedRoute(["admin"]);

  const { data: kpiData, isLoading, error } = useQuery<DashboardKPI>({
    queryKey: ["dashboard-kpi"],
    queryFn: async () => {
      const response = await api.get<DashboardKPI>("/api/dashboard/kpi");
      if (response.error) throw new Error(response.error.message);
      return response.data!;
    },
  });

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error loading dashboard data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-3">
          {/* Total Bookings Card */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Bookings
              </CardTitle>
              <div className="text-2xl font-bold">
                {kpiData?.totalBookings || 0}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                Total number of bookings across all properties
              </p>
            </CardContent>
          </Card>

          {/* Occupancy Rate Card */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500">
                Occupancy Rate
              </CardTitle>
              <div className="text-2xl font-bold">
                {kpiData?.occupancyRate || 0}%
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                Average occupancy rate across all properties
              </p>
            </CardContent>
          </Card>

          {/* Total Revenue Card */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Revenue
              </CardTitle>
              <div className="text-2xl font-bold">
                {formatCurrency(kpiData?.totalRevenue || 0)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                Total revenue from all bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional analytics or charts can be added here */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Coming soon: Detailed analytics and activity logs
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
