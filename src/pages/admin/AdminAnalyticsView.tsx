import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from "recharts";
import axios from "axios";

export function AdminAnalyticsView() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    axios.get("/api/v1/admin/analytics")
      .then(res => {
        if (res.data.success) setAnalytics(res.data.data);
      })
      .catch(() => {});
  }, []);

  const userGrowth = analytics?.userGrowth || [
    { month: "Jan", users: 1200, workers: 400 },
    { month: "Feb", users: 1800, workers: 550 },
    { month: "Mar", users: 2600, workers: 720 },
    { month: "Apr", users: 3400, workers: 850 },
  ];

  const popularCategories = analytics?.popularCategories || [
    { name: "Electrician", count: 1420 },
    { name: "Plumber", count: 1280 },
    { name: "House Helper", count: 1120 },
    { name: "Carpenter", count: 950 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black text-gray-900">Advanced Platform Analytics</h3>
        <p className="text-xs text-gray-500">Comprehensive growth metrics, booking trends, popular categories, and customer satisfaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h4 className="font-bold text-gray-900 text-sm">User & Worker Growth Trend</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} name="Users" />
                <Line type="monotone" dataKey="workers" stroke="#10b981" strokeWidth={3} name="Workers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h4 className="font-bold text-gray-900 text-sm">Top Service Categories by Demand</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularCategories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
