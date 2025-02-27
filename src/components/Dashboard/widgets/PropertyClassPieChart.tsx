"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { logger } from "@/utils/logger";

const propertyClassData = [
  { name: "Residential", value: 400, color: "#4A75BD" },
  { name: "Commercial", value: 300, color: "#37B6A9" },
  { name: "Industrial", value: 300, color: "#F7B844" },
  { name: "Mixed Use", value: 200, color: "#E96D76" },
];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    logger.debug("CustomTooltip", "making tooltip", payload);
    return (
      <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded border border-gray-200 dark:border-gray-700">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-gray-600 dark:text-gray-300">
          Count: {payload[0].value}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {(
            (payload[0].value ??
              0 / propertyClassData.reduce((acc, cur) => acc + cur.value, 0)) *
            100
          ).toFixed(1)}
          %
        </p>
      </div>
    );
  }
  return null;
};

export default function PropertyClassPieChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full w-full overflow-hidden">
      <div className="h-full flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Property Class Breakdown</h2>
        <div className="h-[calc(100%-2rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={propertyClassData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                innerRadius="45%"
                paddingAngle={2}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = 25 + innerRadius + (outerRadius - innerRadius);
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      className="fill-current"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                    >
                      {`${propertyClassData[index].name} (${value})`}
                    </text>
                  );
                }}
              >
                {propertyClassData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
