"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconUsers,
  IconHeart,
  IconCash,
  IconSettings,
} from "@tabler/icons-react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, tributes: 0, funds: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/api/admin");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  return (
    <>
      <main>
        <h1 className="text-3xl font-bold text-base-content text-center uppercase">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <div className="bg-primary text-primary-content p-6 rounded-lg shadow-lg flex flex-col items-center">
            <IconUsers size={40} />
            <h3 className="text-xl font-semibold mt-3">Total Users</h3>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>
          <div className="bg-accent text-accent-content p-6 rounded-lg shadow-lg flex flex-col items-center">
            <IconHeart size={40} />
            <h3 className="text-xl font-semibold mt-3">Total Tributes</h3>
            <p className="text-3xl font-bold">{stats.tributes}</p>
          </div>
          <div className="bg-success text-success-content p-6 rounded-lg shadow-lg flex flex-col items-center">
            <IconCash size={40} />
            <h3 className="text-xl font-semibold mt-3">Total Funds</h3>
            <p className="text-3xl font-bold">${stats.funds}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
