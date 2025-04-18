"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { IconMoneybag, IconTrident, IconUser } from "@tabler/icons-react";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalTributes: 0,
    pendingApprovals: 0,
    totalFund: 0,
    fundMonthly: [],
    userMonthly: [],
    topUsers: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/admin/dashboard");
      console.log(res.data);
      setData(res.data);
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Stats */}
      <div className="stats shadow bg-base-300 w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconUser size={40} />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{data.totalUsers}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconTrident size={40} />
          </div>
          <div className="stat-title">Tribute Posts</div>
          <div className="stat-value text-secondary">{data.totalTributes}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-warning">
            <IconUser size={40} />
          </div>
          <div className="stat-title">Pending Approvals</div>
          <div className="stat-value text-warning">{data.pendingApprovals}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-success">
            <IconMoneybag size={40} />
          </div>
          <div className="stat-title">Total Fund Raised</div>
          <div className="stat-value text-success">₹{data.totalFund}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="bg-base-300 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Monthly Fund Raised</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.fundMonthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* New Users Chart */}
        <div className="bg-base-300 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">New Users per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.userMonthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Users Pie Chart */}
      <div className="bg-base-300 p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Top Fund-Raising Users</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.topUsers}
              dataKey="totalFund"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.topUsers.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default AdminDashboard;
