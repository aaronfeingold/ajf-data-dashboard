"use client";

import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import type { ReportRequest } from "@/types/reportRequest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import ReportModal from "./ReportModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportRequestStatus } from "@/types/reportRequest";

/*
 * ReportsDashboard: shows a list of Report Requests (status etc), and a Widget to create a new report
 */
export default function ReportRequestsListWidget() {
  const {
    data: { data },
    status,
  } = useAppSelector((state) => state.reportRequest);
  const [selectedReportRequest, setSelectedReportRequest] =
    useState<ReportRequest | null>(null);

  const formatSql = (sql: string) => {
    try {
      const parsed = JSON.parse(sql);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return sql;
    }
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Reports Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {selectedReportRequest && (
        <ReportModal
          isOpen={!!selectedReportRequest}
          onClose={() => setSelectedReportRequest(null)}
          reportRequestId={selectedReportRequest.id}
          sourceParcelNumber={selectedReportRequest.sourceParcelNumber}
        />
      )}

      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Reports Dashboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Source Parcel</TableHead>
                  <TableHead>SQL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Max Peers</TableHead>
                  <TableHead>Max Distance</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((reportRequest) => (
                  <TableRow key={reportRequest.id}>
                    <TableCell>{reportRequest.id}</TableCell>
                    <TableCell>{reportRequest.sourceParcelNumber}</TableCell>
                    <TableCell className="max-w-md">
                      <pre className="whitespace-pre-wrap text-xs">
                        {reportRequest.sql && formatSql(reportRequest.sql)}
                      </pre>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          reportRequest.status === ReportRequestStatus.COMPLETED
                            ? "default"
                            : "secondary"
                        }
                      >
                        {reportRequest.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{reportRequest.maxNumberOfPeers}</TableCell>
                    <TableCell>{reportRequest.maxDistanceKm}</TableCell>
                    <TableCell>{reportRequest.created}</TableCell>
                    <TableCell>{reportRequest.updated}</TableCell>
                    <TableCell>
                      {reportRequest.status ===
                        ReportRequestStatus.COMPLETED && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                setSelectedReportRequest(reportRequest)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Quick Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/reportsDashboard/reportRequests/${reportRequest.id}`}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Full Report Request
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
