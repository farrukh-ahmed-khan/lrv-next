"use client"
import React, { useEffect, useRef, useState } from "react";
import { Table, Tag, TableColumnsType } from "antd";
import { Box } from "@mui/material";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import table1 from "@/assets/images/table-1.svg";
import table2 from "@/assets/images/table-2.svg";
import table3 from "@/assets/images/table-3.svg";
import Order1 from "@/assets/images/order-1.svg";
import Order2 from "@/assets/images/order-2.svg";
import Order3 from "@/assets/images/order-3.svg";

// Types
interface TableData {
  key: string;
  icon: string;
  store: string;
  status: "Active" | "NA";
}

interface LineChartData {
  uv: number;
}

interface TicketChartData {
  name: string;
  value: number;
}

const DashStats: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ff323b",
            borderRadius: "10px",
          }}
        >
          <p>Date: {label}</p>
          <p>UV Value: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const columns: TableColumnsType<TableData> = [
    {
      dataIndex: "icon",
      key: "icon",
      render: (icon: string) => (
        <img src={icon} alt="icon" style={{ width: "50px", height: "50px" }} />
      ),
    },
    {
      dataIndex: "store",
      key: "store",
    },
    {
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color="transparent"
          style={{
            background: "transparent",
            color: status === "Active" ? "#57d28e" : "#ed1b24",
          }}
        >
          {status}
        </Tag>
      ),
    },
  ];

  const data: TableData[] = [
    { key: "1", icon: table1, store: "Abstergo Ltd", status: "Active" },
    { key: "2", icon: table2, store: "Bifco Enterprises Ltd.", status: "Active" },
    { key: "3", icon: table3, store: "Acme Co.", status: "NA" },
  ];

  const LineData: LineChartData[] = [
    { uv: 2000 }, { uv: 3000 }, { uv: 2000 }, { uv: 2780 },
    { uv: 1890 }, { uv: 4000 }, { uv: 2390 }, { uv: 3490 },
    { uv: 2000 }, { uv: 4000 },
  ];

  const ticketData: TicketChartData[] = [
    { name: "", value: 50 },
    { name: "", value: 30 },
    { name: "", value: 70 },
    { name: "", value: 40 },
    { name: "", value: 60 },
    { name: "", value: 80 },
    { name: "", value: 15 },
  ];

  return (
    <div className="dashboard-stats">
      <div className="row">
        <div className="col-md-8">
          <div className="chart-container mb-4">
            <div className="tick mt-3">
              <h3>Monthly Revenue</h3>
            </div>
            <Box sx={{ width: "100%", height: 210, marginTop: "45px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={LineData}>
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#ff323b"
                    fill="#ffe8e9"
                  />
                  <Tooltip content={<CustomTooltip />} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card total-card mb-4">
            <div className="card-body">
              <h6>Theft By Tags</h6>
              <div className="total-stores">
                <Table columns={columns} dataSource={data} pagination={false} />
                <div className="span">
                  View all <ArrowRightAltOutlinedIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Unresolved Tickets */}
        <div className="col-md-4">
          <div className="card ticketData">
            <div className="d-flex justify-content-between">
              <div>
                <h5>Total Unresolved <br /> Tickets</h5>
                <h3>200</h3>
              </div>
              <h6>+2.45%</h6>
            </div>
            <Box sx={{ width: "100%", height: 295 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketData}>
                  <CartesianGrid strokeDasharray="1 1" />
                  <Bar dataKey="value" fill="#ff323b" radius={[100, 100, 100, 100]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </div>
        </div>

        {/* No Of Orders */}
        <div className="col-md-4">
          <div className="card NoOfOrders">
            <div className="balance">
              <h4>Total No Of Orders</h4>
              <h3>150</h3>
            </div>
            <p className="mt-3">Recent</p>
            <div className="order-table">
              <img src={Order1} alt="Order1" />
              <div>
                <h5>New Orders</h5>
                <p>Today, 16:36</p>
              </div>
              <span>70</span>
            </div>
            <div className="order-table mt-4">
              <img src={Order2} alt="Order2" />
              <div>
                <h5>Pending Orders</h5>
                <p>23 Jun, 13:06</p>
              </div>
              <span>20</span>
            </div>
            <div className="order-table mt-4">
              <img src={Order3} alt="Order3" />
              <div>
                <h5>Completed Orders</h5>
                <p>21 Jun, 19:04</p>
              </div>
              <span>200</span>
            </div>
          </div>
        </div>

        {/* Total Offenses */}
        <div className="col-md-4">
          <div className="card TotalOffense">
            <p>Total Offenses</p>
            <h3>250</h3>
            <span>+2.45%</span>
            <Box sx={{ width: "100%", height: 200, marginTop: "45px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketData}>
                  <CartesianGrid strokeDasharray="1 1" />
                  <Bar dataKey="value" fill="#ed1b24" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashStats;
