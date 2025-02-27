"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  //   TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RootState } from "@/store/store";
// import BoxWhiskerChart from "@/app/reportsDashboard/report/[id]/BoxAndWhiskerChart";
import { ArrowLeft } from "lucide-react";
import { parsePropertyComparison } from "@/utils/parsePropertyComparison";
import { useAppSelector } from "@/store/hooks";
import type { ReportRequest } from "@/types/reportRequest";
import type { PropertyComparison } from "@/types/report";
import type { PropertyRecordCard } from "@/types/property";
import formatSql from "@/utils/formatSql";

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

/*
 * Report Page: shows a detailed analysis report by id, and allow update (feature not implemented)
 */
export default function ReportPage() {
  const router = useRouter();
  const { id } = useParams();
  // find the report in state that matches the id from params
  const report = useAppSelector((state: RootState) =>
    state.report.data.data.find((r) => r.id === Number(id))
  );
  const reportRequest = useAppSelector(
    (state: RootState) =>
      state.reportRequest.data.data.find(
        (r) => r.id === report?.reportRequest
      ) as ReportRequest
  );
  const sourceProperty = useAppSelector(
    (state: RootState) =>
      state.property.data.data.find(
        (p) => p.parcelNumber === reportRequest.sourceParcelNumber
      ) as PropertyRecordCard
  );

  if (!report?.result) {
    return (
      <div className="p-4">
        <h1>Report not found</h1>
      </div>
    );
  }

  // todo: the return type of the report comparison is an array of results
  // one from each time the report was run
  // so, parse the string into a JSON array and get the last result, which should be the newest
  let latestComparable = {} as PropertyComparison;
  if (report && typeof report.result === "string") {
    try {
      ({ latestComparable } = parsePropertyComparison(report));
    } catch (error) {
      console.error("Failed to parse report result:", error);
      return null; // or handle the error appropriately
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">
          Analysis Report - {latestComparable.id}
        </h1>
      </div>

      {/* Source Property Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Source Property</h2>
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
                  <dd>{formatCurrency(latestComparable.valuePerSquareFoot)}</dd>
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
                  <dd>{formatCurrency(sourceProperty.potentialChange)}</dd>
                </div>
                <div>
                  <dt className="font-medium">Percent Change:</dt>
                  <dd>{sourceProperty.percentChange}%</dd>
                </div>
              </dl> */}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Distribution Charts Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Comparable Parcel Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Square Feet</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <BoxWhiskerChart
                title="Total Square Feet"
                stats={latestComparable.totalSf}
                formatter={(value) => value.toLocaleString()}
                color="#4169E1"
              /> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Assessed Value</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <BoxWhiskerChart
                title="Assessed Value"
                stats={latestComparable.assessedValue}
                formatter={formatCurrency}
                color="#4169E1"
              /> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price per SF</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <BoxWhiskerChart
                title="Value / SF"
                stats={latestComparable.pricePerSF}
                formatter={formatCurrency}
                color="#4169E1"
              /> */}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Comparable Parcels Table Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Comparable Parcel List</h2>
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
            <TableBody>
              {/* {latestComparable.map((parcel) => (
                <TableRow key={parcel.parcelNumber}>
                  <TableCell>{parcel.parcelNumber}</TableCell>
                  <TableCell>{parcel.address}</TableCell>
                  <TableCell>{parcel.ownerName}</TableCell>
                  <TableCell>{parcel.totalSF.toLocaleString()}</TableCell>
                  <TableCell>{formatCurrency(parcel.saleAmount)}</TableCell>
                  <TableCell>{formatCurrency(parcel.pricePerSF)}</TableCell>
                  <TableCell>{parcel.yoyChange}%</TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Configuration Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Report Configuration</h2>
        <Card>
          <CardContent className="mt-4">
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded">
              {reportRequest.sql && formatSql(reportRequest.sql)}
            </pre>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
