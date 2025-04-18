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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { IconHeart, IconMoneybag, IconTrident } from "@tabler/icons-react";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

const UserDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalLikesGiven: 0,
    totalFundRaised: 0,
    totalTributes: 0,
    fundingData: [],
    topLiked: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/user/dashboard`);
      setDashboard(res.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="stats shadow w-full bg-base-300">
        <div className="stat">
          <div className="stat-figure text-primary">
            <IconHeart size={40} />
          </div>
          <div className="stat-title">Likes Given</div>
          <div className="stat-value text-primary">
            {dashboard.totalLikesGiven}
          </div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            <IconMoneybag size={40} />
          </div>
          <div className="stat-title">Total Fund Raised</div>
          <div className="stat-value text-secondary">
            ₹{dashboard.totalFundRaised}
          </div>
        </div>
        <div className="stat">
          <div className="stat-figure text-success">
            <IconTrident size={40} />
          </div>
          <div className="stat-title text-success">Your Tributes</div>
          <div className="stat-value text-success">
            {dashboard.totalTributes}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-base-300 p-4 rounded-lg shadow w-full">
          <h2 className="text-xl font-bold mb-4">Monthly Funding Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.fundingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Liked Tributes Pie Chart */}
        <div className="bg-base-300 p-4 rounded-lg shadow w-full">
          <h2 className="text-xl font-bold mb-4">Top Liked Tributes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboard.topLiked}
                dataKey="likes"
                nameKey="name"
                outerRadius={100}
                label
              >
                {dashboard.topLiked.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
