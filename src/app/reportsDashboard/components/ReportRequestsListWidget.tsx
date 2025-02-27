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
import { Eye, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";
import ReportModal from "./ReportModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportRequestStatus } from "@/types/reportRequest";
import formatSql from "@/utils/formatSql";

export default function ReportRequestsListWidget() {
  const {
    data: { data },
    status,
  } = useAppSelector((state) => state.reportRequest);
  const [selectedReportRequest, setSelectedReportRequest] =
    useState<ReportRequest | null>(null);

  if (status === "loading") {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </CardContent>
      </Card>
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

      <Card className="w-full h-full">
        <CardHeader className="px-4 py-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Report Request List</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead className="w-32">Source Parcel</TableHead>
                  <TableHead className="w-64">SQL</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-24 text-right">Max Peers</TableHead>
                  <TableHead className="w-24 text-right">Distance</TableHead>
                  <TableHead className="w-32">Created</TableHead>
                  <TableHead className="w-32">Updated</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((reportRequest) => (
                  <TableRow
                    key={reportRequest.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell className="font-mono text-sm">
                      {reportRequest.id}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {reportRequest.sourceParcelNumber}
                    </TableCell>
                    <TableCell>
                      <div className="max-h-20 overflow-y-auto">
                        <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {reportRequest.sql && formatSql(reportRequest.sql)}
                        </pre>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          reportRequest.status === ReportRequestStatus.COMPLETED
                            ? "default"
                            : "secondary"
                        }
                        className="whitespace-nowrap"
                      >
                        {reportRequest.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {reportRequest.maxNumberOfPeers}
                    </TableCell>
                    <TableCell className="text-right">
                      {reportRequest.maxDistanceKm}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {reportRequest.created}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {reportRequest.updated}
                    </TableCell>
                    <TableCell>
                      {reportRequest.status ===
                        ReportRequestStatus.COMPLETED && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              onClick={() =>
                                setSelectedReportRequest(reportRequest)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/report/${reportRequest.id}`}
                                className="flex items-center"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Full Report
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
          </div>
        </CardContent>
      </Card>
    </>
  );
}
