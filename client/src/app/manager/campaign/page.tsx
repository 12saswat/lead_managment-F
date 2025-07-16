"use client";
import React, { useState, useEffect } from 'react';
import {
  Mail,
  MessageSquare,
  TrendingUp,
  Send,
  Clock,
  Users,
  BarChart3,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import NewCampaignDialog from '../../../../components/CampaignDialog';

// Define TS interfaces for better type safety
interface Campaign {
  id: number;
  title: string;
  description: string;
  type: 'email' | 'sms';
  category: string;
  status: 'sent' | 'draft';
  sentCount: number;
  totalCount: number;
  openRate: number;
  createdBy: string;
  createdAt: string;
  lastSent: string | null;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType; // Use React.ElementType for component type
  color: string;
  trend?: 'up' | 'down'; // trend is optional
  trendValue?: string;   // trendValue is optional
}

interface CampaignCardProps {
  campaign: Campaign;
}

// Mock data for campaigns
const mockCampaigns: Campaign[] = [
  {
    id: 1,
    title: "Welcome Email Campaign",
    description: "Welcome to Our SCM Solutions",
    type: "email",
    category: "Welcome",
    status: "sent",
    sentCount: 25,
    totalCount: 25,
    openRate: 72,
    createdBy: "John Manager",
    createdAt: "2024-01-20",
    lastSent: "2024-01-20"
  },
  {
    id: 2,
    title: "Follow-up SMS Campaign",
    description: "Hi! This is a follow-up regarding our SCM discussion...",
    type: "sms",
    category: "Follow-up",
    status: "sent",
    sentCount: 15,
    totalCount: 15,
    openRate: 85,
    createdBy: "Alice Johnson",
    createdAt: "2024-01-19",
    lastSent: "2024-01-19"
  },
  {
    id: 3,
    title: "Product Demo Invitation",
    description: "Exclusive Demo Invitation - SCM Platform",
    type: "email",
    category: "Demo",
    status: "draft",
    sentCount: 0,
    totalCount: 30,
    openRate: 0,
    createdBy: "Bob Davis",
    createdAt: "2024-01-18",
    lastSent: null
  }
];

const CampaignManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Calculate statistics
  const totalCampaigns = campaigns.length;
  const sentCampaigns = campaigns.filter(c => c.status === 'sent');
  const draftCampaigns = campaigns.filter(c => c.status === 'draft');
  const totalMessagesSent = sentCampaigns.reduce((sum, c) => sum + c.sentCount, 0);
  const averageOpenRate = sentCampaigns.length > 0
    ? Math.round(sentCampaigns.reduce((sum, c) => sum + c.openRate, 0) / sentCampaigns.length)
    : 0;

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign: Campaign) => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    const matchesType = filterType === 'all' || campaign.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && trendValue && ( // Ensure both trend and trendValue exist before rendering
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${campaign.type === 'email' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'}`}>
            {campaign.type === 'email' ? (
              <Mail className={`h-5 w-5 ${campaign.type === 'email' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} />
            ) : (
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{campaign.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{campaign.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            campaign.status === 'sent'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {campaign.status === 'sent' ? 'Sent' : 'Draft'}
          </span>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
          <p className="font-semibold text-gray-900 dark:text-white">{campaign.category}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Sent</p>
          <p className="font-semibold text-gray-900 dark:text-white">{campaign.sentCount}/{campaign.totalCount}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Open Rate</p>
          <p className="font-semibold text-gray-900 dark:text-white">{campaign.openRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
          <p className="font-semibold text-gray-900 dark:text-white">{campaign.createdAt}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {campaign.createdBy.split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.createdBy}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {campaign.lastSent ? `Last sent: ${campaign.lastSent}` : 'Never sent'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Eye className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Edit className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Trash2 className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Campaign Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage email and SMS campaigns for your leads
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {/* Space for Create Campaign Button */}
            <div className="w-48 h-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-600 flex items-center justify-center">
            <NewCampaignDialog />
              {/* <span className="text-sm text-gray-500 dark:text-gray-400">Create Campaign Component</span> */}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {['overview', 'campaigns', 'analytics'].map((tab: string) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Campaigns"
                value={totalCampaigns}
                icon={Mail}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                trend="up"
                trendValue="12%"
              />
              <StatCard
                title="Messages Sent"
                value={totalMessagesSent}
                icon={Send}
                color="bg-gradient-to-r from-green-500 to-green-600"
                trend="up"
                trendValue="8%"
              />
              <StatCard
                title="Open Rate"
                value={`${averageOpenRate}%`}
                icon={TrendingUp}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
                trend="up"
                trendValue="5%"
              />
              <StatCard
                title="Draft Campaigns"
                value={draftCampaigns.length}
                icon={Clock}
                color="bg-gradient-to-r from-orange-500 to-orange-600"
                // No trend or trendValue needed for Draft Campaigns, as they are optional props
              />
            </div>

            {/* Recent Campaigns */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Campaigns</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Latest campaigns created by your team</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Filter className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign: Campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="draft">Draft</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>

            {/* Campaign List */}
            <div className="space-y-4">
              {filteredCampaigns.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No campaigns found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredCampaigns.map((campaign: Campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed analytics and reporting features will be available here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignManagement;