"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { submitNewReportRequest } from "@/store/reportRequestSlice";
import { propertyClasses } from "@/types/property";
import type { ReportRequest } from "@/types/reportRequest";

export default function NewReportRequestWidget() {
  const searchParams = useSearchParams();
  const [parcelNumber, setParcelNumber] = useState<number>(0);
  const [maxPeers, setMaxPeers] = useState("10");
  const [maxDistance, setMaxDistance] = useState("10");
  const [sqftRange, setSqftRange] = useState({ min: "", max: "" });
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<Omit<
    ReportRequest,
    "id" | "status" | "created" | "updated"
  > | null>(null);
  //   const router = useRouter();
  const dispatch = useAppDispatch();
  // Set initial parcel number from URL params
  useEffect(() => {
    const parcelParam = searchParams.get("parcel");
    if (parcelParam) {
      setParcelNumber(parseInt(parcelParam));
    }
  }, [searchParams]);

  const addRule = () => {
    // Implement rule addition logic
    console.log("Adding new rule");
  };

  const addGroup = () => {
    // Implement group addition logic
    console.log("Adding new group");
  };

  const handlePropertyClassChange = (code: string) => {
    setSelectedClasses((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  };

  const handleSubmit = async (
    data: Omit<ReportRequest, "id" | "status" | "created" | "updated">
  ) => {
    setFormData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    // TODO Validate form data:
    // - Ensure parcel number is not empty
    // - Ensure maxPeers and maxDistance are valid numbers
    // - Check is list of property classes
    if (formData) {
      await dispatch(submitNewReportRequest(formData)).unwrap();
      //   router.push("/reports");
      // now rather than go from page to page, we just update the list of report request
      // and see the new one in the list in other widget
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Parcel Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parcelNumber">Parcel Number</Label>
                <Input
                  id="parcelNumber"
                  value={parcelNumber}
                  onChange={(e) => setParcelNumber(parseInt(e.target.value))}
                  placeholder="Enter parcel number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxPeers">Max Number of Peers</Label>
                  <Input
                    id="maxPeers"
                    type="number"
                    value={maxPeers}
                    onChange={(e) => setMaxPeers(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxDistance">Max Distance (km)</Label>
                  <Input
                    id="maxDistance"
                    type="number"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Filter Rules Section */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <div className="flex justify-between mb-4">
                <div className="space-x-2">
                  <Button variant="secondary" size="sm">
                    AND
                  </Button>
                  <Button variant="outline" size="sm">
                    OR
                  </Button>
                </div>
                <div className="space-x-2">
                  <Button onClick={addRule} variant="outline" size="sm">
                    Add rule
                  </Button>
                  <Button onClick={addGroup} variant="outline" size="sm">
                    Add group
                  </Button>
                </div>
              </div>

              {/* Filter Rules */}
              <div className="space-y-4">
                {/* Parcel Number Rule */}
                <div className="flex items-center gap-2">
                  <Select defaultValue="parcelNumber">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parcelNumber">
                        Parcel Number
                      </SelectItem>
                      <SelectItem value="totalSqFt">
                        Total Square Feet
                      </SelectItem>
                      <SelectItem value="propertyClass">
                        Property Class
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="notEqual">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">equals</SelectItem>
                      <SelectItem value="notEqual">not equal</SelectItem>
                      <SelectItem value="between">between</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Value"
                    className="w-[200px]"
                    value={parcelNumber}
                    onChange={(e) => setParcelNumber(parseInt(e.target.value))}
                  />

                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>

                {/* Square Feet Rule */}
                <div className="flex items-center gap-2">
                  <Select defaultValue="totalSqFt">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parcelNumber">
                        Parcel Number
                      </SelectItem>
                      <SelectItem value="totalSqFt">
                        Total Square Feet
                      </SelectItem>
                      <SelectItem value="propertyClass">
                        Property Class
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="between">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">equals</SelectItem>
                      <SelectItem value="notEqual">not equal</SelectItem>
                      <SelectItem value="between">between</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      className="w-[95px]"
                      value={sqftRange.min}
                      onChange={(e) =>
                        setSqftRange((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="Max"
                      className="w-[95px]"
                      value={sqftRange.max}
                      onChange={(e) =>
                        setSqftRange((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>

                {/* Property Class Rule */}
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(propertyClasses).map(([k, v], i) => (
                    <div
                      key={`${i}-${k}`}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`class-${k}`}
                        checked={selectedClasses.includes(k)}
                        onCheckedChange={() => handlePropertyClassChange(k)}
                      />
                      <Label htmlFor={`class-${k}`} className="text-sm">
                        {v}-{k}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Report Request</AlertDialogTitle>
            <AlertDialogDescription>
              The report may take up to 10 minutes to complete. You&apos;ll be
              redirected to the reports dashboard where you can monitor its
              progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Generate Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        onClick={() =>
          handleSubmit({
            sourceParcelNumber: parcelNumber,
            sql: JSON.stringify({
              condition: "AND",
              rules: [
                // TODO: HANDLE current rules here
              ],
              valid: true,
              parcelNumber: parcelNumber,
              maxNumberOfPeers: maxPeers,
              maxDistanceKm: maxDistance,
            }),
            maxNumberOfPeers: parseInt(maxPeers),
            maxDistanceKm: parseInt(maxDistance),
          })
        }
        className="mt-4"
      >
        Run Analysis
      </Button>
    </div>
  );
}
