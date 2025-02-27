"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Eye } from "lucide-react";
import type { PropertyRecordCard } from "@/types/property";
import PropertyMap from "./PropertyMap/PropertyMap";

interface PropertyDetailModalProps {
  property: PropertyRecordCard | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const mapContainerId = `map-${property?.parcelNumber}`;

  // Sample valuation data
  const valuationData = property
    ? [
        {
          year: "2022",
          value: (parseInt(property.mostRecentValuation) ?? 0) * 0.8,
        },
        {
          year: "2023",
          value: (parseInt(property.mostRecentValuation) ?? 0) * 0.9,
        },
        { year: "2024", value: property.mostRecentValuation },
      ]
    : [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!property) return null;
  if (!isMounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Property Details - {property.parcelNumber}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="font-medium">Address</dt>
                  <dd>
                    {`${property.propertyStreetNumber} ${property.propertyStreetName}`}
                    , {property.propertyCity}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Owner</dt>
                  <dd>{property.ownerName}</dd>
                </div>
                <div>
                  <dt className="font-medium">Property Class</dt>
                  <dd>{property.propertyClassCode}</dd>
                </div>
                <div>
                  <dt className="font-medium">Size</dt>
                  <dd>
                    {property.totalSf.toLocaleString()} sq ft (
                    {property.acreage.toFixed(2)} acres)
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Latest Valuation</dt>
                  <dd>${property.mostRecentValuation.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="font-medium">Price per SF</dt>
                  <dd>${parseInt(property.pricePerSf).toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="font-medium">Recent PTOBOA</dt>
                  <dd>
                    {property.mostRecentPtaboaDate} - $
                    {(property.mostRecentPtaboaAmount ?? 0).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Map Card */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <React.Suspense
                fallback={
                  <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />
                }
              >
                <PropertyMap
                  property={property}
                  mapContainerId={mapContainerId}
                  isOpen={isOpen}
                />
              </React.Suspense>
            </CardContent>
          </Card>

          {/* Valuation History Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Valuation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={valuationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [
                        `$${value.toLocaleString()}`,
                        "Value",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ViewDetailsButton: React.FC<{
  property: PropertyRecordCard;
  onView: (property: PropertyRecordCard) => void;
}> = ({ property, onView }) => (
  <button
    onClick={() => onView(property)}
    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
  >
    <Eye className="w-4 h-4 mr-2" />
    View Details
  </button>
);

export default PropertyDetailModal;
