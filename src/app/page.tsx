"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      switch (user.role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "host":
          router.push("/landlord/dashboard");
          break;
        case "guest":
          router.push("/tenant/search");
          break;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect based on useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Find Your Perfect Property
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Browse through our curated selection of properties, book your stay, or list your own property.
              Join our community of hosts and guests today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                onClick={() => router.push("/login")}
                className="rounded-md px-6 py-2.5"
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/register")}
                className="rounded-md px-6 py-2.5"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Why Choose Us
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage properties
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  For Guests
                </div>
                <div className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p>Browse and book properties with ease. Filter by location, amenities, and price.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  For Hosts
                </div>
                <div className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p>List and manage your properties. Track bookings and communicate with guests.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  For Admins
                </div>
                <div className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p>Monitor platform activity, manage users, and view comprehensive analytics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
