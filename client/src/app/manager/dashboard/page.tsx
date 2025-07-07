"use client";

import { Calendar, CheckCircle, Mail, MessageSquare, Plus, Users, TrendingUp, Clock } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
// Recharts imports updated for BarChart
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for Recent Leads (can be expanded for manager view if needed)
const leads = [
  {
    name: "John Smith",
    company: "Tech Corp",
    status: "New",
    priority: "High",
    category: "Sales",
    assignedBy: "Worker A", // Changed to Worker A for manager context
    id: "lead-1"
  },
  {
    name: "Sarah Wilson",
    company: "Design Studio",
    status: "In Progress",
    priority: "Medium",
    category: "Marketing",
    assignedBy: "Worker B",
    id: "lead-2"
  },
  {
    name: "Mike Brown",
    company: "Retail Chain",
    status: "Qualified",
    priority: "High",
    category: "Support",
    assignedBy: "Worker C",
    id: "lead-3"
  },
  {
    name: "Emily White",
    company: "Health Innovations",
    status: "New",
    priority: "Low",
    category: "Healthcare",
    assignedBy: "Worker A",
    id: "lead-4"
  },
  {
    name: "David Green",
    company: "Finance Hub",
    status: "In Progress",
    priority: "High",
    category: "Banking",
    assignedBy: "Worker B",
    id: "lead-5"
  },
];

// Mock data for the Bar Chart (updated for Positive, Negative, Follow-up leads)
const chartData = [
  { month: 'Jan', positive: 150, negative: 30, followUp: 50 },
  { month: 'Feb', positive: 180, negative: 25, followUp: 60 },
  { month: 'Mar', positive: 200, negative: 40, followUp: 75 },
  { month: 'Apr', positive: 170, negative: 35, followUp: 65 },
  { month: 'May', positive: 220, negative: 30, followUp: 80 },
  { month: 'Jun', positive: 190, negative: 28, followUp: 70 },
  { month: 'Jul', positive: 250, negative: 45, followUp: 90 },
];


const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-blue-100 dark:bg-blue-300 text-blue-700";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700";
    case "Qualified":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 dark:bg-red-300 text-red-700";
    case "Medium":
      return "bg-orange-100 dark:bg-orange-300 text-orange-700";
    case "Low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const ManagerDashboardPage = () => {
  const router = useRouter();

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Manager Dashboard
          </h1>
          <p className="text-md sm:text-lg text-gray-600 mt-1 dark:text-gray-300">
            Overview of team performance and lead pipeline.
          </p>
        </div>
        <button
          onClick={() => router.push("/leads/upload-leads")} // Assuming this is your "Add Lead" page
          className="mt-4 sm:mt-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-base font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <Plus className="w-5 h-5" />
          Add New Lead
        </button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
        {[
          {
            title: "Total Leads",
            value: 156,
            change: "+12% from last month",
            icon: <Users className="w-8 h-8 sm:w-10 sm:h-10" />,
            color: "text-blue-500 dark:text-blue-400",
          },
          {
            title: "Active Conversations",
            value: 43,
            change: "+8% from last month",
            icon: <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10" />,
            color: "text-green-500 dark:text-green-400",
          },
          {
            title: "Conversion Rate",
            value: "24%",
            change: "+3% from last month",
            icon: <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10" />,
            color: "text-purple-500 dark:text-purple-400",
          },
          {
            title: "Pending Follow-ups",
            value: 18,
            change: "-5% from last month",
            icon: <Clock className="w-8 h-8 sm:w-10 sm:h-10" />,
            color: "text-orange-500 dark:text-orange-400",
          },
        ].map(({ title, value, change, icon, color }, i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6 rounded-xl shadow-sm transition-transform transform hover:scale-[1.02] cursor-default"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-white">
                  {title}
                </p>
                <h2 className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{change}</p>
              </div>
              <div className={`flex-shrink-0 ${color}`}>{icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Lead Status Breakdown
        </h2>
        <div className="h-64 sm:h-80 lg:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 0,
                left: -20, // Adjust left margin for Y-axis labels
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#ccc' }} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400" />
              <YAxis tickLine={false} axisLine={{ stroke: '#ccc' }} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ color: '#333', fontWeight: 'bold' }}
              />
              <Bar dataKey="positive" fill="#82ca9d" name="Positive Leads" />
              <Bar dataKey="negative" fill="#ff7300" name="Negative Leads" />
              <Bar dataKey="followUp" fill="#8884d8" name="Follow-up Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-700 rounded-xl p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Recent Leads
          </h2>
          <button
            className="text-sm text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
            onClick={() => {
              router.push("/leads/all-leads");
            }}
          >
            View All
          </button>
        </div>
        <hr className="w-full shadow-sm dark:border-gray-700" />

        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {leads.map((lead, index) => (
            <li
              key={index}
              className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-2"
            >
              <div className="flex flex-col justify-between gap-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
                  <p className="font-semibold text-gray-900 text-lg dark:text-white">
                    {lead.name}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
                        lead.priority
                      )}`}
                    >
                      {lead.priority}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium dark:bg-gray-800 dark:text-gray-200">
                      {lead.category}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {lead.company}
                </p>
              </div>
              <div className="text-sm text-gray-600 text-left sm:text-right dark:text-gray-300">
                <p className="mb-1">Assigned by</p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {lead.assignedBy}
                </p>
                {/* Add an update button for managers */}
                <button
                    onClick={() => router.push(`/update-lead/${lead.id}`)}
                    className="mt-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Update
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManagerDashboardPage;
