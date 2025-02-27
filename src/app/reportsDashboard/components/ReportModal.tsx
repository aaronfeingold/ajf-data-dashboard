"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
//   TableBody,
//   TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Report, PropertyComparison } from "@/types/report";
import type { ReportRequest } from "@/types/reportRequest";
// import BoxWhiskerChart from "@/app/reportsDashboard/report/[id]/BoxAndWhiskerChart";
import { PropertyRecordCard } from "@/types/property";
import { parsePropertyComparison } from "@/utils/parsePropertyComparison"; // Adjust the import path as necessary
import { useAppSelector } from "@/store/hooks";
import formatSql from "@/utils/formatSql";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportRequestId: number;
  sourceParcelNumber: number;
}

export default function ReportModal({
  isOpen,
  onClose,
  reportRequestId,
  sourceParcelNumber,
}: ReportModalProps) {
  const { data: reportData } = useAppSelector((state) => state.report.data);
  const { data: propertyData } = useAppSelector((state) => state.property.data);
  const { data: reportRequestData } = useAppSelector(
    (state) => state.reportRequest.data
  );

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Find the report request in data where the value for reportRequest is equal to the reportRequestId prop
  const reportRequest = reportRequestData.find(
    (r) => r.id === reportRequestId
  ) as ReportRequest;

  // Find the report in data where the value for reportRequest is equal to the reportRequestId prop
  const report = reportData.find(
    (r) => r.reportRequest === reportRequestId
  ) as Report;

  let latestComparable = {} as PropertyComparison;
  if (report && typeof report.result === "string") {
    try {
      ({ latestComparable } = parsePropertyComparison(report));
    } catch (error) {
      console.error("Failed to parse report result:", error);
      return null; // or handle the error appropriately
    }
  }

  // Find the property record card from state where the parcel number matches the sourceParcelNumber prop
  const sourceProperty = propertyData.find(
    (p) => p.parcelNumber === sourceParcelNumber
  ) as PropertyRecordCard;

  if (!report || !sourceProperty) {
    return null; // or handle the error appropriately
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Report Analysis- {sourceProperty.parcelNumber}
          </DialogTitle>
        </DialogHeader>

        {/* Source Property Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Source Property</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="font-medium">Parcel:</dt>
                    <dd>{sourceProperty.parcelNumber}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Address:</dt>
                    <dd>{`${sourceProperty.propertyStreetNumber} ${sourceProperty.propertyStreetName}`}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Owner:</dt>
                    <dd>{sourceProperty.ownerName}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="font-medium">2024 Assessed Value:</dt>
                    <dd>{formatCurrency(latestComparable.totalValue2024)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Total S.F.:</dt>
                    <dd>{latestComparable.totalSf.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">$/SF:</dt>
                    <dd>
                      {formatCurrency(latestComparable.valuePerSquareFoot)}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <dl className="space-y-2">
                  <div>
                    <dt className="font-medium">Market Value:</dt>
                    <dd>{formatCurrency(sourceProperty.marketValue)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Potential Change:</dt>
                    <dd>
                      {formatCurrency(
                        sourceProperty.prediction.potentialChange
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Percent Change:</dt>
                    <dd>{sourceProperty.prediction.percentChange}%</dd>
                  </div>
                </dl> */}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparable Parcel Distribution Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Comparable Parcel Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Square Feet Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Total Square Feet</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <BoxWhiskerChart
                  title="Total Square Feet"
                  stats={latestComparable.totalSf}
                  formatter={(value: number) => value.toLocaleString()}
                  color="#4169E1"
                /> */}
              </CardContent>
            </Card>

            {/* Assessed Value Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Total Assessed Value</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <BoxWhiskerChart
                  title="Assessed Value"
                  stats={parsedReports[0].assessedValue}
                  formatter={formatCurrency}
                  color="#4169E1"
                /> */}
              </CardContent>
            </Card>

            {/* Price per SF Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Price per SF</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <BoxWhiskerChart
                  title="Value / SF"
                  stats={report.result.distribution.pricePerSF}
                  formatter={formatCurrency}
                  color="#4169E1"
                /> */}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparable Parcel List Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Comparable Parcel List</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parcel Number</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Total SF</TableHead>
                  <TableHead>Sale Amount</TableHead>
                  <TableHead>Price/SF</TableHead>
                  <TableHead>YoY Change</TableHead>
                </TableRow>
              </TableHeader>
              {/* <TableBody>
                {report.result.parcels.map((parcel) => (
                  <TableRow key={parcel.parcelNumber}>
                    <TableCell>{parcel.parcelNumber}</TableCell>
                    <TableCell>{parcel.address}</TableCell>
                    <TableCell>{parcel.ownerName}</TableCell>
                    <TableCell>{parcel.totalSF.toLocaleString()}</TableCell>
                    <TableCell>{formatCurrency(parcel.saleAmount)}</TableCell>
                    <TableCell>{formatCurrency(parcel.pricePerSF)}</TableCell>
                    <TableCell>{parcel.yoyChange}%</TableCell>
                  </TableRow>
                ))}
              </TableBody> */}
            </Table>
          </div>
        </div>

        {/* Query Parameters Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Report Configuration</h2>
          <Card>
            <CardContent className="mt-4">
              <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded">
                {reportRequest.sql && formatSql(reportRequest.sql)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
