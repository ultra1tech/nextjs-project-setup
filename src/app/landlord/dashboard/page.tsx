"use client";

import { useState } from "react";
import { useProperties } from "@/hooks/useProperties";
import { useProtectedRoute } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Property } from "@/lib/api";

interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: string;
  imageUrl: string;
}

export default function LandlordDashboard() {
  useProtectedRoute(["host"]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: 0,
    location: "",
    amenities: "",
    imageUrl: "",
  });

  const { useLandlordProperties, useCreateProperty, useUpdateProperty, useDeleteProperty } = useProperties();
  
  const { data: properties, isLoading } = useLandlordProperties();
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const propertyData = {
      ...formData,
      price: Number(formData.price),
      amenities: formData.amenities.split(",").map(item => item.trim()),
    };

    try {
      if (selectedProperty) {
        await updatePropertyMutation.mutateAsync({
          id: selectedProperty.id,
          data: propertyData,
        });
      } else {
        await createPropertyMutation.mutateAsync(propertyData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving property:", error);
    }
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      amenities: property.amenities.join(", "),
      imageUrl: property.imageUrl,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (propertyId: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deletePropertyMutation.mutateAsync(propertyId);
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };

  const resetForm = () => {
    setSelectedProperty(null);
    setFormData({
      title: "",
      description: "",
      price: 0,
      location: "",
      amenities: "",
      imageUrl: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Properties</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}>
                Add New Property
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedProperty ? "Edit Property" : "Add New Property"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  name="title"
                  render={() => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  render={() => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="price"
                  render={() => (
                    <FormItem>
                      <FormLabel>Price per night</FormLabel>
                      <FormControl>
                        <Input
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          min="0"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="location"
                  render={() => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="amenities"
                  render={() => (
                    <FormItem>
                      <FormLabel>Amenities (comma-separated)</FormLabel>
                      <FormControl>
                        <Input
                          name="amenities"
                          value={formData.amenities}
                          onChange={handleChange}
                          placeholder="WiFi, Parking, Pool"
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="imageUrl"
                  render={() => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleChange}
                          placeholder="https://example.com/image.jpg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}
                  >
                    {createPropertyMutation.isPending || updatePropertyMutation.isPending
                      ? "Saving..."
                      : selectedProperty
                      ? "Update Property"
                      : "Add Property"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties?.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            {properties?.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No properties yet. Click "Add New Property" to get started.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
