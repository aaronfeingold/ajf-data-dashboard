import React from "react";
import {
  ComposedChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BoxWhiskerProps {
  title: string;
  stats: {
    min: number;
    max: number;
    mean: number;
    median: number;
    stdDev: number;
  };
  formatter?: (value: number) => string;
  color?: string;
  width?: number;
  height?: number;
  yAxisWidth?: number;
}

interface BoxWhiskerShapeProps {
  cx: number;
  cy: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  median: number;
  color: string;
}

const BoxWhiskerShape: React.FC<BoxWhiskerShapeProps> = ({
  cx,
  cy,
  min,
  max,
  q1,
  q3,
  median,
  color,
}) => {
  const boxWidth = 40;
  const whiskerWidth = boxWidth * 0.7;

  // We need to transform our statistical values to pixel coordinates
  const pixelMin = cy - min;
  const pixelMax = cy - max;
  const pixelQ1 = cy - q1;
  const pixelQ3 = cy - q3;
  const pixelMedian = cy - median;

  return (
    <g>
      {/* Vertical line (whisker) */}
      <line
        x1={cx}
        y1={pixelMin}
        x2={cx}
        y2={pixelMax}
        stroke={color}
        strokeWidth={1.5}
      />

      {/* Top whisker horizontal line */}
      <line
        x1={cx - whiskerWidth / 2}
        y1={pixelMax}
        x2={cx + whiskerWidth / 2}
        y2={pixelMax}
        stroke={color}
        strokeWidth={1.5}
      />

      {/* Bottom whisker horizontal line */}
      <line
        x1={cx - whiskerWidth / 2}
        y1={pixelMin}
        x2={cx + whiskerWidth / 2}
        y2={pixelMin}
        stroke={color}
        strokeWidth={1.5}
      />

      {/* Box */}
      <rect
        x={cx - boxWidth / 2}
        y={pixelQ3}
        width={boxWidth}
        height={pixelQ1 - pixelQ3}
        fill="white"
        stroke={color}
        strokeWidth={1.5}
      />

      {/* Median line */}
      <line
        x1={cx - boxWidth / 2}
        y1={pixelMedian}
        x2={cx + boxWidth / 2}
        y2={pixelMedian}
        stroke={color}
        strokeWidth={1.5}
      />
    </g>
  );
};

const BoxWhiskerChart: React.FC<BoxWhiskerProps> = ({
  title,
  stats,
  formatter = (value) => value.toString(),
  color = "#4169E1",
  yAxisWidth = 80,
}) => {
  // Calculate quartiles and IQR
  const q1 = stats.mean - stats.stdDev;
  const q3 = stats.mean + stats.stdDev;
  const iqr = q3 - q1;

  // Define outlier boundaries
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  // Determine if min/max are outliers
  const effectiveMin = Math.max(stats.min, lowerBound);
  const effectiveMax = Math.min(stats.max, upperBound);

  // Create outlier points
  const outliers = [];
  if (stats.min < lowerBound) {
    outliers.push({ x: 0, y: stats.min });
  }
  if (stats.max > upperBound) {
    outliers.push({ x: 0, y: stats.max });
  }

  // Main chart data
  const chartData = [
    {
      x: 0,
      y: (effectiveMax + effectiveMin) / 2,
      min: effectiveMin,
      max: effectiveMax,
      q1,
      q3,
      median: stats.median,
    },
  ];

  return (
    <div className="w-full">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: yAxisWidth, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number" domain={[-1, 1]} hide />
            <YAxis tickFormatter={formatter} domain={["auto", "auto"]} />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => formatter(value)}
              labelFormatter={() => title}
            />
            <Scatter
              data={chartData}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              shape={(props: any) => {
                const { cx, cy } = props;
                return (
                  <BoxWhiskerShape
                    cx={cx}
                    cy={cy}
                    min={effectiveMin}
                    max={effectiveMax}
                    q1={q1}
                    q3={q3}
                    median={stats.median}
                    color={color}
                  />
                );
              }}
            />
            {outliers.length > 0 && (
              <Scatter
                data={outliers}
                fill="red"
                shape="circle"
                legendType="none"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Min:</dt>
          <dd>{formatter(stats.min)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Max:</dt>
          <dd>{formatter(stats.max)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Mean:</dt>
          <dd>{formatter(stats.mean)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Median:</dt>
          <dd>{formatter(stats.median)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Std. Dev.:</dt>
          <dd>{formatter(stats.stdDev)}</dd>
        </div>
      </dl>
    </div>
  );
};

export default BoxWhiskerChart;
