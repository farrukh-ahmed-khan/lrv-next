import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

// Define the data structure
interface ChartData {
  date: string;
  value: number;
}

const data: ChartData[] = [
  { date: "May 2022", value: 40000 },
  { date: "Jun 2022", value: 35000 },
  { date: "Jul 2022", value: 15000 },
  { date: "Aug 2022", value: 55000 },
  { date: "Sep 2022", value: 29333 },
  { date: "Oct 2022", value: 49000 },
];

const timeOptions = ["Day", "Week", "Month", "Year"];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        <p className="value">{`$${payload[0].value?.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const FilterChart: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Month");
  const color = "#0096FF";

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="analytics-chart">
          <div className="chart-header">
            <h2>Analytics Report</h2>
            <div className="chart-tab-wrap">
              <div className="time-options">
                {timeOptions.map((option) => (
                  <button
                    key={option}
                    className={selectedOption === option ? "active" : ""}
                    onClick={() => setSelectedOption(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="filter-options">
                <select>
                  <option>Investment</option>
                </select>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(value: number) =>
                  `$${value.toLocaleString()}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FilterChart;
