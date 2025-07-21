"use client";

import {
  Users,
  Activity,
  AlertTriangle,
  Plus,
  CheckCircle,
  CalendarClock,
  Clock,
  Target,
  Timer,
  Star,
  AlertCircle,
  List,
  BarChart as BarChartIcon,
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import axios from "@/lib/Axios"; // Assuming you have a configured axios instance
import { Button } from "@/components/ui/button"; // Assuming a shadcn/ui Button component
import { Calendar } from "@/components/ui/calendar"; // Assuming a shadcn/ui Calendar component

// --- MOCK DATA (to be replaced by API calls) ---
const kpiData = {
  totalAssignedLeads: { value: 45, change: 5 },
  pendingFollowUp: { value: 12, change: -3 },
  leadsFollowUpToday: { value: 8, change: 2 },
  leadsMissingFollowUp: { value: 3, change: 1 },
};

const categoryProfitableData = [
  { name: "Sales", profitable: 20, nonProfitable: 10 },
  { name: "Marketing", profitable: 15, nonProfitable: 8 },
  { name: "Healthcare", profitable: 12, nonProfitable: 5 },
  { name: "Services", profitable: 10, nonProfitable: 7 },
];

const PIE_COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

const todayFollowUpList = [
  { id: "f1", name: "John Smith", company: "Tech Corp", time: "10:00 AM", status: "Pending" },
  { id: "f2", name: "Sarah Wilson", company: "Design Studio", time: "2:00 PM", status: "Scheduled" },
  { id: "f3", name: "Mike Brown", company: "Retail Chain", time: "4:00 PM", status: "Pending" },
];

const recentAssignments = [
  { id: "a1", name: "Alice Johnson", company: "InnoTech", assignedDate: "2025-07-20", status: "New" },
  { id: "a2", name: "Bob Lee", company: "MarketPros", assignedDate: "2025-07-19", status: "In Progress" },
  { id: "a3", name: "Carol Davis", company: "HealthPlus", assignedDate: "2025-07-18", status: "New" },
];

const upcomingFollowUps = [
  { date: new Date("2025-07-22"), events: [{ name: "Tech Corp Follow-up", time: "11:00 AM" }] },
  { date: new Date("2025-07-23"), events: [{ name: "Design Studio Call", time: "3:00 PM" }, { name: "Retail Meeting", time: "5:00 PM" }] },
];

const overdueFollowUps = [
  { id: "o1", name: "David Evans", company: "FinServe", dueDate: "2025-07-19" },
  { id: "o2", name: "Eva Foster", company: "AdAgency", dueDate: "2025-07-18" },
];

// --- Helper Components ---
const KpiCard = ({ title, value, change, icon, unit = "" }: { title: string, value: number, change: number, icon: React.ReactNode, unit?: string }) => {
  const isPositive = change >= 0;
  return (
    <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="flex justify-between items-center">
        <div className="text-gray-400">{icon}</div>
        <div className={`flex items-center text-sm font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "▲" : "▼"} {Math.abs(change)}%
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{value}{unit}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Scheduled": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "New": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "In Progress": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const formatDateRelative = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const WorkerDashboardPage = () => {
  const router = useRouter();

  // In a real app, you would fetch data here using useEffect
  // For example:
  // useEffect(() => {
  //   axios.get('/api/worker/dashboard/kpis').then(res => setKpiData(res.data));
  //   // ... fetch other data points
  // }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Worker Dashboard
          </h1>
          <p className="text-md text-gray-500 mt-1 dark:text-gray-400">
            Welcome back, manage your assigned leads and follow-ups.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <Button onClick={() => router.push("/leads/upload-leads")}>
            <Plus className="w-4 h-4 mr-2" /> Add Lead
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Assigned Leads" value={kpiData.totalAssignedLeads.value} change={kpiData.totalAssignedLeads.change} icon={<Users className="w-6 h-6" />} />
        <KpiCard title="Pending Follow-Ups" value={kpiData.pendingFollowUp.value} change={kpiData.pendingFollowUp.change} icon={<Activity className="w-6 h-6" />} />
        <KpiCard title="Follow-Ups Today" value={kpiData.leadsFollowUpToday.value} change={kpiData.leadsFollowUpToday.change} icon={<CalendarClock className="w-6 h-6" />} />
        <KpiCard title="Leads with Missing Follow-Up" value={kpiData.leadsMissingFollowUp.value} change={kpiData.leadsMissingFollowUp.change} icon={<AlertCircle className="w-6 h-6" />} />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Category Wise Profitable and Non-Profitable Leads Graph */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Category Wise Profitable vs Non-Profitable Leads</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryProfitableData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="profitable" fill="#82ca9d" name="Profitable" />
                  <Bar dataKey="nonProfitable" fill="#ff7300" name="Non-Profitable" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today Follow-Up List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Today's Follow-Up List</h3>
              <button onClick={() => router.push('/worker/follow-ups')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">View All</button>
            </div>
            <ul className="space-y-4">
              {todayFollowUpList.map(item => (
                <li key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.company} - {item.time}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Assignment Table */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Assignments</h3>
              <button onClick={() => router.push('/worker/assignments')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Company</th>
                    <th className="p-3">Assigned Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssignments.map(item => (
                    <tr key={item.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3 font-medium text-gray-900 dark:text-white">{item.name}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-300">{item.company}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-300">{formatDateRelative(item.assignedDate)}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Calendar Style Upcoming Follow-Ups */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Upcoming Follow-Ups</h3>
            <Calendar
              mode="single"
              className="rounded-md border"
              modifiers={{
                booked: upcomingFollowUps.map(up => up.date),
              }}
              modifiersStyles={{
                booked: { color: 'white', backgroundColor: '#6366f1' },
              }}
            />
            <ul className="mt-4 space-y-2">
              {upcomingFollowUps.map((up, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>{formatDateRelative(up.date.toISOString())}:</strong> {up.events.map(e => `${e.name} at ${e.time}`).join(', ')}
                </li>
              ))}
            </ul>
          </div>

          {/* Overdue Follow-Ups */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Overdue Follow-Ups</h3>
              <button onClick={() => router.push('/worker/overdue')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">View All</button>
            </div>
            <ul className="space-y-4">
              {overdueFollowUps.map(item => (
                <li key={item.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.company} - Due: {formatDateRelative(item.dueDate)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboardPage;
