"use client";

import { useState } from "react";
import { useProperties } from "@/hooks/useProperties";
import { useProtectedRoute } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { PropertyCard } from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const AMENITIES_OPTIONS = [
  "WiFi",
  "Parking",
  "Pool",
  "Gym",
  "Air Conditioning",
  "Kitchen",
  "Washer",
  "Dryer",
];

export default function TenantSearchPage() {
  useProtectedRoute(["guest"]);
  const router = useRouter();

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    location: "",
    amenities: [] as string[],
  });

  const { useAllProperties } = useProperties();
  const { data: properties, isLoading } = useAllProperties({
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    location: filters.location || undefined,
    amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleBook = (propertyId: string) => {
    router.push(`/tenant/bookings/new?propertyId=${propertyId}`);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      location: "",
      amenities: [],
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-1/2"
                    />
                    <Input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-1/2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    name="location"
                    placeholder="Search by location"
                    value={filters.location}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="space-y-2">
                    {AMENITIES_OPTIONS.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={filters.amenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityToggle(amenity)}
                        />
                        <label
                          htmlFor={amenity}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Available Properties</h1>
              {properties && (
                <p className="text-gray-500">
                  {properties.length} properties found
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {properties?.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onBook={handleBook}
                  />
                ))}
                {properties?.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No properties found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
