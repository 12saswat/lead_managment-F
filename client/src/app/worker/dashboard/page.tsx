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
  TrendingUp,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  ArrowRight,
  Eye,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter }  from "next/navigation";

// Mock data
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

const todayFollowUpList = [
  { id: "f1", name: "John Smith", company: "Tech Corp", time: "10:00 AM", status: "Pending", priority: "High" },
  { id: "f2", name: "Sarah Wilson", company: "Design Studio", time: "2:00 PM", status: "Scheduled", priority: "Medium" },
  { id: "f3", name: "Mike Brown", company: "Retail Chain", time: "4:00 PM", status: "Pending", priority: "Low" },
];

const recentAssignments = [
  { id: "a1", name: "Alice Johnson", company: "InnoTech", assignedDate: "2025-07-20", status: "New", value: "$25,000" },
  { id: "a2", name: "Bob Lee", company: "MarketPros", assignedDate: "2025-07-19", status: "In Progress", value: "$18,500" },
  { id: "a3", name: "Carol Davis", company: "HealthPlus", assignedDate: "2025-07-18", status: "New", value: "$32,000" },
];

const overdueFollowUps = [
  { id: "o1", name: "David Evans", company: "FinServe", dueDate: "2025-07-19", daysOverdue: 3 },
  { id: "o2", name: "Eva Foster", company: "AdAgency", dueDate: "2025-07-18", daysOverdue: 4 },
];

// Enhanced KPI Card Component
const KpiCard = ({ title, value, change, icon, unit = "", gradient }: {
  title: string,
  value: number,
  change: number,
  icon: React.ReactNode,
  unit?: string,
  gradient: string
}) => {
  const isPositive = change >= 0;
  
  return (
    <div className="group relative overflow-hidden rounded-b-xl">
      <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
            {icon}
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-bold ${isPositive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}>
            {isPositive ? "↗" : "↘"} {Math.abs(change)}%
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-gray-800">{value}{unit}</h3>
          <p className="text-sm font-medium text-gray-600">{title}</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      </div>
    </div>
  );
};

// Enhanced Status Badge
const StatusBadge = ({ status, priority }: { status: string, priority?: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Pending": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
      case "Scheduled": return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
      case "New": return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
      case "In Progress": return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" };
      default: return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${config.border} border`}>
        {status}
      </span>
      {priority && (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priority === "High" ? "bg-red-100 text-red-600" :
            priority === "Medium" ? "bg-yellow-100 text-yellow-600" :
              "bg-green-100 text-green-600"
          }`}>
          {priority}
        </span>
      )}
    </div>
  );
};

// Chart Component
const SimpleBarChart = ({ data }: { data: typeof categoryProfitableData }) => (
  <div className="space-y-4">
    {data.map((item, index) => (
      <div key={item.name} className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{item.name}</span>
          <span className="text-sm text-gray-500">{item.profitable + item.nonProfitable} total</span>
        </div>
        <div className="relative">
          <div className="flex rounded-lg overflow-hidden bg-gray-100 h-3">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000 ease-out"
              style={{ width: `${(item.profitable / (item.profitable + item.nonProfitable)) * 100}%` }}
            ></div>
            <div
              className="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-1000 ease-out"
              style={{ width: `${(item.nonProfitable / (item.profitable + item.nonProfitable)) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>✓ {item.profitable} profitable</span>
          <span>✗ {item.nonProfitable} non-profitable</span>
        </div>
      </div>
    ))}
  </div>
);

const WorkerDashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Worker Dashboard
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  Tuesday, July 22, 2025 • Good Morning!
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 cursor-pointer" onClick={() => router.push("/leads/all-leads")}>
              <Eye className="w-4 h-4" />
              View All Leads
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push("/leads/upload-leads")
            }>
              <Plus className="w-4 h-4" />
              Add New Lead
            </button>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 rounded-lg">
          <KpiCard
            title="Total Assigned Leads"
            value={kpiData.totalAssignedLeads.value}
            change={kpiData.totalAssignedLeads.change}
            icon={<Users className="w-6 h-6" />}
            gradient="from-blue-500 to-blue-600"
          />
          <KpiCard
            title="Pending Follow-Ups"
            value={kpiData.pendingFollowUp.value}
            change={kpiData.pendingFollowUp.change}
            icon={<Activity className="w-6 h-6" />}
            gradient="from-amber-500 to-orange-500"
          />
          <KpiCard
            title="Follow-Ups Today"
            value={kpiData.leadsFollowUpToday.value}
            change={kpiData.leadsFollowUpToday.change}
            icon={<CalendarClock className="w-6 h-6" />}
            gradient="from-emerald-500 to-teal-500"
          />
          <KpiCard
            title="Missing Follow-Up"
            value={kpiData.leadsMissingFollowUp.value}
            change={kpiData.leadsMissingFollowUp.change}
            icon={<AlertCircle className="w-6 h-6" />}
            gradient="from-red-500 to-pink-500"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Category Chart */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <BarChartIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Lead Performance by Category</h3>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-600">Profitable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Non-Profitable</span>
                  </div>
                </div>
              </div>
              <SimpleBarChart data={categoryProfitableData} />
            </div>

            {/* Enhanced Today's Follow-ups */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Today's Follow-Ups</h3>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {todayFollowUpList.map((item, index) => (
                  <div key={item.id} className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-gray-100 hover:border-indigo-200 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center font-bold text-gray-600">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-indigo-700">{item.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{item.company}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={item.status} priority={item.priority} />
                        <div className="flex gap-2">
                          <button className="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg flex items-center justify-center transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Recent Assignments */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Recent Assignments</h3>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {recentAssignments.map((item, index) => (
                  <div key={item.id} className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 border border-gray-100 hover:border-emerald-200 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center font-bold text-gray-600">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-emerald-700">{item.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{item.company}</span>
                            <span className="font-medium text-emerald-600">{item.value}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={item.status} />
                        <span className="text-sm text-gray-500">
                          {new Date(item.assignedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Enhanced Calendar */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Upcoming Schedule</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-blue-800">Today</span>
                  </div>
                  <p className="text-sm text-blue-600">Tech Corp Follow-up at 11:00 AM</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium text-purple-800">Tomorrow</span>
                  </div>
                  <p className="text-sm text-purple-600">Design Studio Call at 3:00 PM</p>
                  <p className="text-sm text-purple-600">Retail Meeting at 5:00 PM</p>
                </div>
              </div>
            </div>

            {/* Enhanced Overdue Follow-ups */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Overdue Follow-Ups</h3>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-500 transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {overdueFollowUps.map((item) => (
                  <div key={item.id} className="group p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 hover:border-red-200 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                        <span className="font-bold text-red-600">{item.daysOverdue}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 group-hover:text-red-700">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.company}</p>
                        <p className="text-xs text-red-600 font-medium">{item.daysOverdue} days overdue</p>
                      </div>
                      <button className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl text-white shadow-xl">
              <h3 className="text-xl font-bold mb-6">This Week's Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Calls Made</span>
                  <span className="font-bold text-2xl">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Meetings Scheduled</span>
                  <span className="font-bold text-2xl">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Conversion Rate</span>
                  <span className="font-bold text-2xl">68%</span>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-indigo-100">15% improvement from last week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboardPage;