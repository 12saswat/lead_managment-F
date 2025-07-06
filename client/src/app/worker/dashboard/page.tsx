"use client";

import { Calendar, CheckCircle, Mail, MessageSquare, Plus } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

const leads = [
  {
    name: "John Smith",
    company: "Tech Corp",
    status: "New",
    priority: "High",
    category: "Sales",
    assignedBy: "Manager Alice",
  },
  {
    name: "Sarah Wilson",
    company: "Design Studio",
    status: "In Progress",
    priority: "Medium",
    category: "Marketing",
    assignedBy: "Manager Bob",
  },
  {
    name: "Mike Brown",
    company: "Retail Chain",
    status: "Qualified",
    priority: "High",
    category: "Support",
    assignedBy: "Manager Carol",
  },
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

const WorkerDashboardPage = () => {
  const router = useRouter();

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Worker Dashboard
          </h1>
          <p className="text-md text-gray-600 mt-1 dark:text-gray-300">
            Stay organized, close faster, and stay accountable.
          </p>
        </div>
        {/* <button
          onClick={() => router.push("/leads/upload-leads")}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-md shadow cursor-pointer "
        >
          <Plus className="w-4 h-4" />  
          Add Leads
        </button> */}
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "All Leads",
            value: 28,
            icon: <Mail className="w-10 h-10" />,
            color: "text-blue-500 dark:text-blue-400",
          },
          {
            title: "Assigned Leads",
            value: 12,
            icon: <Calendar className="w-10 h-10" />,
            color: "text-yellow-500 dark:text-yellow-400",
          },
          {
            title: "Upcoming Follow-ups",
            value: 14,
            icon: <CheckCircle className="w-10 h-10" />,
            color: "text-green-500 dark:text-green-400",
          },
          {
            title: "Chats Ongoing",
            value: 7,
            icon: <MessageSquare className="w-10 h-10" />,
            color: "text-indigo-500 dark:text-indigo-400",
          },
        ].map(({ title, value, icon, color }, i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm transition-transform transform hover:scale-[1.02] cursor-default"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-white">
                  {title}
                </p>
                <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
              </div>
              <div className={`w-12 h-12 ${color}`}>{icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
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
              className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
            >
              <div className="flex flex-col justify-between gap-2">
                <div className="flex gap-5">
                  <p className="font-semibold text-gray-900 text-lg dark:text-white">
                    {lead.name}
                  </p>
                  <div className="flex gap-2 mt-1 flex-wrap">
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
              <div className="text-sm text-gray-600 text-right dark:text-gray-300">
                <p className="mb-1">Assigned by</p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {lead.assignedBy}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkerDashboardPage;
