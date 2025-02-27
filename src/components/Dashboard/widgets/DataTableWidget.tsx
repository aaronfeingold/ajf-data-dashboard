"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnOrderState,
  ColumnResizeMode,
} from "@tanstack/react-table";
import { Search, SlidersHorizontal } from "lucide-react";
import { FiBarChart2 } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PropertyRecordCard } from "@/types/property";
import DataTableLoading from "@/components/Loading/DataTableLoading";
import PropertyDetailModal, {
  ViewDetailsButton,
} from "@/components/Dashboard/widgets/PropertyDetailModal";
import {
  AdvancedSearch,
  type AdvancedSearchForm,
} from "@/components/Dashboard/widgets/PropertyMap/AdvancedSearch/AdvancedSearch";
import { useAppSelector } from "@/store/hooks";
import { selectAdvancedSearchResults } from "@/store/propertySelectors";
import { selectAllProperties } from "@/store/propertySlice";
import { usePropertyData } from "@/components/Providers/PropertyDataProvider";

const DataTableWidget = () => {
  const { isLoading } = usePropertyData();
  const { status } = useAppSelector((state) => state.property);
  const [advancedSearchParams, setAdvancedSearchParams] =
    useState<AdvancedSearchForm | null>(null);
  const filteredResults = useAppSelector((state) =>
    advancedSearchParams
      ? selectAdvancedSearchResults(state, advancedSearchParams)
      : selectAllProperties(state)
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyRecordCard | null>(null);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  const tableColumns = useMemo<ColumnDef<PropertyRecordCard, unknown>[]>(
    () => [
      { accessorKey: "parcelNumber", header: "Parcel Number" },
      { accessorKey: "propertyClassCode", header: "Property Class Code" },
      {
        id: "address",
        header: "Address",
        cell: (info) => {
          const { propertyStreetNumber, propertyStreetName } =
            info.row.original;
          return `${propertyStreetNumber} ${propertyStreetName}`;
        },
      },
      { accessorKey: "propertyCity", header: "Property City" },
      { accessorKey: "ownerName", header: "Owner Name" },
      { accessorKey: "acreage", header: "Acreage" },
      { accessorKey: "totalSf", header: "Total SF" },
      {
        accessorKey: "mostRecentValuation",
        header: "Most Recent Valuation",
        sortingFn: "basic",
        cell: (info) => `$${info.getValue<string>()}`,
      },
      {
        accessorKey: "pricePerSf",
        header: "Price per SF",
        sortingFn: "basic",
        cell: (info) => `$${info.getValue<string>()}`,
      },
      {
        accessorKey: "mostRecentPtoboaDate",
        header: "Most Recent PTOboa Date",
      },
      {
        accessorKey: "mostRecentPtoboaAmount",
        header: "Most Recent PTOboa Amount",
        sortingFn: "basic",
        cell: (info) => `$${info.getValue<string>()}`,
      },
      {
        id: "analyze",
        header: "Analyze",
        size: 100,
        cell: (info) => (
          <Link
            href={`/reportsDashboard/report?parcel=${info.row.original.parcelNumber}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-9 px-3"
          >
            <FiBarChart2 className="w-4 h-4 mr-2" />
            Analyze
          </Link>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        cell: (info) => (
          <ViewDetailsButton
            property={info.row.original}
            onView={(property) => setSelectedProperty(property)}
          />
        ),
      },
    ],
    []
  );
  const initialColumnOrder: ColumnOrderState = [
    "parcelNumber",
    "propertyClassCode",
    "address",
    "propertyCity",
    "ownerName",
    "acreage",
    "totalSf",
    "mostRecentValuation",
    "pricePerSf",
    "mostRecentPtoboaDate",
    "mostRecentPtoboaAmount",
    "analyze",
    "actions",
  ];

  // Initialize default column order if not set
  useEffect(() => {
    if (columnOrder.length === 0) {
      setColumnOrder(initialColumnOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableColumns]);

  const defaultColumn = {
    minSize: 100,
    size: 150,
  };

  const displayData = useMemo(() => filteredResults, [filteredResults]);

  const table = useReactTable({
    data: displayData.data,
    columns: tableColumns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnOrder,
      globalFilter,
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    columnResizeMode,
    enableColumnResizing: true,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater(table.getState().pagination);
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
  });

  // Calculate total pages
  const totalPages = table.getPageCount();
  const currentPage = pageIndex + 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleAdvancedSearch = (searchParams: AdvancedSearchForm) => {
    setAdvancedSearchParams(searchParams);
    setGlobalFilter(""); // Clear the simple search when using advanced search
  };

  // Clear advanced search
  const clearAdvancedSearch = () => {
    setAdvancedSearchParams(null);
  };

  const clearAllFilters = () => {
    setGlobalFilter("");
    setAdvancedSearchParams(null);
    // Reset to first page when clearing filters
    setPageIndex(0);
  };

  if (isLoading || status === "loading") {
    return <DataTableLoading />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-gray-800">
      <div className="flex-none border-b">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  if (advancedSearchParams) clearAdvancedSearch();
                }}
                className="pl-10 pr-4 py-2 border rounded text-gray-900 placeholder-gray-500 bg-white dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <Button
              onClick={() => setIsAdvancedSearchOpen(true)}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Advanced Search
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-700 dark:text-gray-200">
              Rows per page:
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                table.setPageSize(newSize);
              }}
              className="border rounded py-2 px-3 text-gray-900 bg-white dark:bg-gray-700 dark:text-gray-100"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Add the AdvancedSearch component */}
      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        onOpenChange={setIsAdvancedSearchOpen}
        onSearch={handleAdvancedSearch}
        initialValues={advancedSearchParams ?? undefined}
        onClear={clearAllFilters}
      />

      {/* Table Section - Scrollable */}
      <div className="flex-1 overflow-auto min-h-0">
        <table
          className="w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed"
          style={{ minWidth: "100%" }}
        >
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      position: "relative",
                      width: header.getSize(),
                      minWidth: "100px",
                    }}
                    className="group px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider cursor-pointer select-none first:pl-4 last:pr-4"
                    onClick={header.column.getToggleSortingHandler()}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", header.id);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const fromId = e.dataTransfer.getData("text/plain");
                      const toId = header.id;
                      const fromIndex = table
                        .getAllColumns()
                        .findIndex((col) => col.id === fromId);
                      const toIndex = table
                        .getAllColumns()
                        .findIndex((col) => col.id === toId);

                      if (fromIndex !== -1 && toIndex !== -1) {
                        const newColumnOrder = [...columnOrder];
                        const [removed] = newColumnOrder.splice(fromIndex, 1);
                        newColumnOrder.splice(toIndex, 0, removed);
                        setColumnOrder(newColumnOrder);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : header.column.getIsSorted() === "desc"
                          ? " 🔽"
                          : ""}
                      </div>
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`
                          w-1 h-full cursor-col-resize select-none touch-none absolute right-0 top-0
                          ${
                            header.column.getIsResizing()
                              ? "bg-blue-500"
                              : "bg-gray-200 dark:bg-gray-600"
                          }
                          hover:bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity
                        `}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 first:pl-4 last:pr-4"
                    style={{
                      width: cell.column.getSize(),
                      minWidth: "100px",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex-none border-t bg-white dark:bg-gray-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`px-3 py-1 rounded ${
                !table.getCanPreviousPage()
                  ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 border"
              }`}
            >
              Previous
            </button>

            <div
              className="flex gap-1 overflow-x-auto"
              style={{ maxWidth: "calc(100vw - 400px)" }}
            >
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => table.setPageIndex(number - 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === number
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 border"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`px-3 py-1 rounded ${
                !table.getCanNextPage()
                  ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 border"
              }`}
            >
              Next
            </button>
          </div>

          <div className="text-sm text-gray-700 dark:text-gray-200">
            Showing {pageIndex * pageSize + 1} to{" "}
            {Math.min(
              (pageIndex + 1) * pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
        </div>
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
};

export default DataTableWidget;
