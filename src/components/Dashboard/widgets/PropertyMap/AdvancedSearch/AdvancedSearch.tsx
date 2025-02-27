"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export interface AdvancedSearchForm {
  parcelNumber: number | null;
  propertyClassCode: number | null;
  pricePerSfMin: number | null;
  pricePerSfMax: number | null;
  totalSfMin: number | null;
  totalSfMax: number | null;
  acreageMin: number | null;
  acreageMax: number | null;
  valuationMin: number | null;
  valuationMax: number | null;
  excludePtaboa: boolean;
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (searchParams: AdvancedSearchForm) => void;
  onClear: () => void;
  initialValues?: Partial<AdvancedSearchForm>;
}

const defaultSearchValues: AdvancedSearchForm = {
  parcelNumber: null,
  propertyClassCode: null,
  pricePerSfMin: null,
  pricePerSfMax: null,
  totalSfMin: null,
  totalSfMax: null,
  acreageMin: null,
  acreageMax: null,
  valuationMin: null,
  valuationMax: null,
  excludePtaboa: false,
};

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onOpenChange,
  onSearch,
  onClear,
  initialValues = {},
}) => {
  const [searchParams, setSearchParams] = React.useState<AdvancedSearchForm>({
    ...defaultSearchValues,
    ...initialValues,
  });

  const parseNumberInput = (value: string): number | null => {
    if (value === "") return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
    onOpenChange(false);
  };

  const handleClear = () => {
    setSearchParams(defaultSearchValues);
    onClear();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Advanced Search
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Parcel Number */}
            <div className="space-y-2">
              <Label htmlFor="parcelNumber">Parcel Number</Label>
              <Input
                id="parcelNumber"
                placeholder="Enter parcel number"
                className="bg-gray-700 border-gray-600 text-white"
                value={searchParams.parcelNumber?.toString() ?? ""}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    parcelNumber: parseNumberInput(e.target.value),
                  })
                }
              />
            </div>

            {/* Property Class Code */}
            <div className="space-y-2">
              <Label>Property Class Code</Label>
              <Select
                value={searchParams.propertyClassCode?.toString() ?? ""}
                onValueChange={(value) =>
                  setSearchParams({
                    ...searchParams,
                    propertyClassCode: parseNumberInput(value),
                  })
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select code" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="400">400</SelectItem>
                  <SelectItem value="401">401</SelectItem>
                  <SelectItem value="402">402</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price per SF Range */}
            <div className="space-y-2">
              <Label>Price per SF Range</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={searchParams.pricePerSfMin?.toString() ?? ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      pricePerSfMin: parseNumberInput(e.target.value),
                    })
                  }
                />
                <Input
                  placeholder="Max"
                  type="number"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={searchParams.pricePerSfMax?.toString() ?? ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      pricePerSfMax: parseNumberInput(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Total SF Range */}
            <div className="space-y-2">
              <Label>Total SF Range</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={searchParams.totalSfMin?.toString() ?? ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      totalSfMin: parseNumberInput(e.target.value),
                    })
                  }
                />
                <Input
                  placeholder="Max"
                  type="number"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={searchParams.totalSfMax?.toString() ?? ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      totalSfMax: parseNumberInput(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Acreage Range */}
            <div className="space-y-2">
              <Label>Acreage Range</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={searchParams.acreageMin?.toString() ?? ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      acreageMin: parseNumberInput(e.target.value),
                    })
                  }
                />
                <Input
                  placeholder="Max"
                  type="number"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={searchParams.acreageMax?.toString() ?? ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      acreageMax: parseNumberInput(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Valuation Range */}
            <div className="space-y-2">
              <Label>Most Recent Valuation Range</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={searchParams.valuationMin?.toString() ?? ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      valuationMin: parseNumberInput(e.target.value),
                    })
                  }
                />
                <Input
                  placeholder="Max"
                  type="number"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={searchParams.valuationMax?.toString() ?? ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      valuationMax: parseNumberInput(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="excludePtaboa"
              checked={searchParams.excludePtaboa}
              onCheckedChange={(checked) =>
                setSearchParams({
                  ...searchParams,
                  excludePtaboa: checked as boolean,
                })
              }
            />
            <Label htmlFor="excludePtaboa">Does NOT have PTABOA data</Label>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-white hover:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="text-white hover:text-gray-300"
            >
              Clear
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearch;
