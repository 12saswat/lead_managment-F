"use client";

import {
  Users,
  TrendingUp,
  Activity,
  AlertTriangle,
  Plus,
  CheckCircle,
  UserPlus,
  Send,
  CalendarClock,
  Briefcase,
  GitBranch,
  Zap,
  Award,
  Clock,
  Rocket,
  Target,
  Timer,
  Star,
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
  FunnelChart,
  Funnel,
  LabelList,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import axios from "@/lib/Axios"; // Assuming you have a configured axios instance
import { Button } from "@/components/ui/button"; // Assuming a shadcn/ui Button component

// --- MOCK DATA (to be replaced by API calls) ---
const kpiData = {
  totalLeads: { value: 258, change: 12 },
  conversionRate: { value: 18, change: 2.5 },
  engagedLeads: { value: 78, change: 8 },
  overdueTasks: { value: 8, change: 10 },
};

const leadFunnelData = [
  { status: "New Leads", value: 2, fill: "#6366f1" },
  { status: "Follow up", value: 9, fill: "#818cf8" },
  { status: "In Progress", value: 7, fill: "#a5b4fc" },
  { status: "Closed", value: 1, fill: "#c7d2fe" },
];

const leadsByCategoryData = [
  { name: "Sales", value: 85 },
  { name: "Marketing", value: 62 },
  { name: "Healthcare", value: 45 },
  { name: "Services", value: 38 },
];

const leadSourceData = [
  { name: "Website", value: 92 },
  { name: "Referrals", value: 75 },
  { name: "Social Media", value: 55 },
  { name: "Advertisement", value: 36 },
];
const PIE_COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];


const campaignPerformanceData = [
  { id: "c1", title: "Q3 Product Launch", leadsTargeted: 500, leadsConverted: 25, conversionRate: 5 },
  { id: "c2", title: "Summer Sale Promo", leadsTargeted: 1200, leadsConverted: 60, conversionRate: 5 },
  { id: "c3", title: "New Feature Update", leadsTargeted: 850, leadsConverted: 72, conversionRate: 8.5 },
];

const workerLeaderboardData = [
    { id: "w1", name: "Aarav Sharma", assigned: 45, converted: 12, avatar: "AS" },
    { id: "w2", name: "Priya Patel", assigned: 52, converted: 10, avatar: "PP" },
    { id: "w3", name: "Rohan Mehta", assigned: 38, converted: 9, avatar: "RM" },
    { id: "w4", name: "Sanya Verma", assigned: 35, converted: 7, avatar: "SV" },
];

const recentActivityData = [
    { id: "a1", type: "CONVERSION", text: "John Doe was marked as 'Qualified'.", user: "Aarav Sharma", timestamp: "2 hours ago", icon: <CheckCircle className="w-5 h-5 text-green-500" />},
    { id: "a2", type: "ASSIGNMENT", text: "3 new leads assigned to 'Priya Patel'.", user: "System", timestamp: "5 hours ago", icon: <UserPlus className="w-5 h-5 text-blue-500" />},
    { id: "a3", type: "CAMPAIGN", text: "Campaign 'Q3 Product Launch' was sent.", user: "Manager", timestamp: "1 day ago", icon: <Send className="w-5 h-5 text-purple-500" />},
];

const recentLeadsData = [
  { id: "lead-1", name: "John Smith", company: "Tech Corp", status: "New", assignedTo: "Aarav Sharma" },
  { id: "lead-2", name: "Sarah Wilson", company: "Design Studio", status: "In Progress", assignedTo: "Priya Patel" },
  { id: "lead-3", name: "Mike Brown", company: "Retail Chain", status: "Qualified", assignedTo: "Rohan Mehta" },
];

const upcomingDeadlinesData = [
    { id: "d1", leadName: "Tech Corp Inquiry", assignedTo: "Aarav Sharma", dueDate: "2025-07-22T17:00:00.000Z" },
    { id: "d2", leadName: "Design Studio Follow-up", assignedTo: "Priya Patel", dueDate: "2025-07-23T17:00:00.000Z" },
    { id: "d3", leadName: "Retail Chain Demo", assignedTo: "Rohan Mehta", dueDate: "2025-07-23T18:00:00.000Z" },
];

const businessInsightsData = {
    leadVelocity: { value: 15, unit: "% MoM", description: "Lead Velocity Rate" },
    avgResponseTime: { value: 4, unit: "hours", description: "Avg. Lead Response Time" },
    topCampaign: { value: "New Feature Update", description: "Top Converting Campaign" },
    mostEngagedWorker: { value: "Aarav Sharma", description: "Most Engaged Worker" },
    topLeadSource: { value: "Website", description: "Top Lead Source" },
    salesCycleDuration: { value: 12, unit: "days", description: "Avg. Sales Cycle Duration" },
    topCategory: { value: "Healthcare", description: "Highest Performing Category" },
};

const leadsGeneratedData = [
  { date: "20 Jan", leads: 200 },
  { date: "21 Jan", leads: 220 },
  { date: "22 Jan", leads: 180 },
  { date: "23 Jan", leads: 140 },
  { date: "24 Jan", leads: 210 },
  { date: "25 Jan", leads: 100 },
  { date: "26 Jan", leads: 150 },
];
const totalLeadsGenerated = leadsGeneratedData.reduce((acc, curr) => acc + curr.leads, 0);


// --- Helper Components ---
const KpiCard = ({ title, value, change, icon, unit = "" } : { title: string, value: number, change: number, icon: React.ReactNode, unit?: string }) => {
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

const InsightCard = ({ value, description, icon, unit = "" } : { value: string | number, description: string, icon: React.ReactNode, unit?: string }) => {
    return (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg flex items-center space-x-4 border border-indigo-200 dark:border-indigo-800">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                {icon}
            </div>
            <div>
                <p className="text-xl font-bold text-indigo-800 dark:text-white">{value}{unit}</p>
                <p className="text-sm text-indigo-600 dark:text-indigo-300">{description}</p>
            </div>
        </div>
    );
};


const getStatusColor = (status: string) => {
  switch (status) {
    case "New": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "In Progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Qualified": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
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


const ManagerDashboardPage = () => {
  const router = useRouter();
  
  // In a real app, you would fetch data here using useEffect
  // For example:
  // useEffect(() => {
  //   axios.get('/api/dashboard/kpis').then(res => setKpiData(res.data));
  //   // ... fetch other data points
  // }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Business Dashboard
          </h1>
          <p className="text-md text-gray-500 mt-1 dark:text-gray-400">
            Welcome back, here's your performance overview.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
             <Button variant="outline" onClick={() => router.push("/manager/campaigns/new")}>
                <Plus className="w-4 h-4 mr-2" /> New Campaign
             </Button>
             <Button onClick={() => router.push("/leads/upload-leads")}>
                <Plus className="w-4 h-4 mr-2" /> Add Lead
             </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Leads" value={kpiData.totalLeads.value} change={kpiData.totalLeads.change} icon={<Users className="w-6 h-6" />} />
        <KpiCard title="Conversion Rate" value={kpiData.conversionRate.value} change={kpiData.conversionRate.change} icon={<TrendingUp className="w-6 h-6" />} unit="%" />
        <KpiCard title="Engaged Leads" value={kpiData.engagedLeads.value} change={kpiData.engagedLeads.change} icon={<Activity className="w-6 h-6" />} />
        <KpiCard title="Overdue Tasks" value={kpiData.overdueTasks.value} change={kpiData.overdueTasks.change} icon={<AlertTriangle className="w-6 h-6" />} />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
            {/* Leads Generated Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Leads Generated (Past 7 Days)</h3>
                <div className="flex items-start gap-4">
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalLeadsGenerated.toLocaleString()}</p>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={leadsGeneratedData}>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs text-gray-500" />
                                <Tooltip
                                    cursor={{fill: 'rgba(239, 246, 255, 0.5)'}}
                                    contentStyle={{
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.5rem',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                />
                                <Bar dataKey="leads" fill="#818cf8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            {/* Business Insights */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Business Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InsightCard value={businessInsightsData.leadVelocity.value} unit={businessInsightsData.leadVelocity.unit} description={businessInsightsData.leadVelocity.description} icon={<Rocket className="w-6 h-6"/>} />
                    <InsightCard value={businessInsightsData.avgResponseTime.value} unit={businessInsightsData.avgResponseTime.unit} description={businessInsightsData.avgResponseTime.description} icon={<Clock className="w-6 h-6"/>} />
                    <InsightCard value={businessInsightsData.topCampaign.value} description={businessInsightsData.topCampaign.description} icon={<Award className="w-6 h-6"/>} />
                    <InsightCard value={businessInsightsData.mostEngagedWorker.value} description={businessInsightsData.mostEngagedWorker.description} icon={<Zap className="w-6 h-6"/>} />
                    <InsightCard value={businessInsightsData.topLeadSource.value} description={businessInsightsData.topLeadSource.description} icon={<Target className="w-6 h-6"/>} />
                    <InsightCard value={businessInsightsData.salesCycleDuration.value} unit={businessInsightsData.salesCycleDuration.unit} description={businessInsightsData.salesCycleDuration.description} icon={<Timer className="w-6 h-6"/>} />
                    <InsightCard value={businessInsightsData.topCategory.value} description={businessInsightsData.topCategory.description} icon={<Star className="w-6 h-6"/>} />
                </div>
            </div>
            {/* Lead Funnel */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Lead Pipeline</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <FunnelChart>
                            <Tooltip />
                            <Funnel dataKey="value" data={leadFunnelData} isAnimationActive>
                                <LabelList position="right" fill="#000" stroke="none" dataKey="status" className="font-semibold text-gray-700 dark:text-gray-200" />
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                </div>
            </div>
             
            {/* Campaign Performance */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Campaign Performance</h3>
                    <button onClick={() => router.push('/manager/campaigns')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Campaign Title</th>
                                <th className="p-3 text-center">Leads Targeted</th>
                                <th className="p-3 text-center">Leads Converted</th>
                                <th className="p-3 text-center">Conversion Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaignPerformanceData.map(c => (
                                <tr key={c.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 font-medium text-gray-900 dark:text-white">{c.title}</td>
                                    <td className="p-3 text-center text-gray-600 dark:text-gray-300">{c.leadsTargeted}</td>
                                    <td className="p-3 text-center text-gray-600 dark:text-gray-300">{c.leadsConverted}</td>
                                    <td className="p-3 text-center font-semibold text-green-600 dark:text-green-400">{c.conversionRate.toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             {/* Recent Leads */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Leads</h3>
                    <button onClick={() => router.push('/manager/leads')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">View All</button>
                </div>
                <ul className="space-y-4">
                    {recentLeadsData.map(lead => (
                       <li key={lead.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                           <div className="flex-1">
                               <p className="font-semibold text-gray-900 dark:text-white">{lead.name}</p>
                               <p className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</p>
                           </div>
                           <div className="flex items-center gap-4">
                               <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(lead.status)}`}>
                                 {lead.status}
                               </span>
                               <div className="text-sm text-gray-600 dark:text-gray-300">
                                   <p className="font-medium text-gray-800 dark:text-white">{lead.assignedTo}</p>
                               </div>
                           </div>
                       </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
                </div>
                <ul className="space-y-4">
                    {recentActivityData.map(item => (
                       <li key={item.id} className="flex items-start space-x-4">
                           <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">{item.icon}</div>
                           <div className="flex-1">
                               <p className="text-sm text-gray-800 dark:text-white" dangerouslySetInnerHTML={{ __html: item.text.replace(/'([^']*)'/g, "'<span class=\"font-semibold text-indigo-500\">$1</span>'") }}></p>
                               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.user} • {item.timestamp}</p>
                           </div>
                       </li>
                    ))}
                </ul>
            </div>
            {/* Leads by Category */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Leads by Category</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={leadsByCategoryData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                                {leadsByCategoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* Lead Source */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Lead Source</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={leadSourceData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                                {leadSourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* Team Leaderboard */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Team Leaderboard</h3>
                     <button onClick={() => router.push('/manager/team')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Manage Team</button>
                </div>
                <ul className="space-y-4">
                    {workerLeaderboardData.map(w => (
                       <li key={w.id} className="flex items-center space-x-4">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">{w.avatar}</div>
                           <div className="flex-1">
                               <p className="font-semibold text-gray-800 dark:text-white">{w.name}</p>
                               <p className="text-sm text-gray-500 dark:text-gray-400">{w.assigned} leads assigned</p>
                           </div>
                           <div className="text-right">
                               <p className="font-bold text-lg text-green-500">{Math.round((w.converted / w.assigned) * 100)}%</p>
                               <p className="text-xs text-gray-500">Converted</p>
                           </div>
                       </li>
                    ))}
                </ul>
            </div>
            {/* Upcoming Deadlines */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Upcoming Deadlines</h3>
                    <button onClick={() => router.push('/manager/assignments')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">All Tasks</button>
                </div>
                <ul className="space-y-4">
                    {upcomingDeadlinesData.map(item => (
                       <li key={item.id} className="flex items-center space-x-4">
                           <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                                <CalendarClock className="w-5 h-5 text-amber-600 dark:text-amber-400"/>
                           </div>
                           <div className="flex-1">
                               <p className="font-medium text-gray-800 dark:text-white">{item.leadName}</p>
                               <p className="text-sm text-gray-500 dark:text-gray-400">Assigned to {item.assignedTo}</p>
                           </div>
                           <div className="text-sm font-semibold text-amber-700 dark:text-amber-500">{formatDateRelative(item.dueDate)}</div>
                       </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardPage;
