"use client";

import { useQuery } from "@tanstack/react-query";
import { useProtectedRoute } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { api, Booking } from "@/lib/api";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TenantBookingsPage() {
  useProtectedRoute(["guest"]);

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await api.get<Booking[]>("/api/bookings");
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
  });

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await api.put(`/api/bookings/${bookingId}`, { status: "cancelled" });
      // Refetch bookings after cancellation
      // React Query will automatically refetch the bookings query
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
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
            Error loading bookings
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        <div className="space-y-4">
          {bookings?.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Booking #{booking.id.slice(0, 8)}</CardTitle>
                    <CardDescription>
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Price</p>
                      <p className="text-lg font-semibold">{formatCurrency(booking.totalPrice)}</p>
                    </div>
                    {booking.status === "pending" && (
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {bookings?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven&apos;t made any bookings yet.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.href = "/tenant/search"}
              >
                Browse Properties
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
