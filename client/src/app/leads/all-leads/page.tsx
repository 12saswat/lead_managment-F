"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, ChevronDown, MessageSquare, Trash2, Edit, Filter, X } from 'lucide-react';
import { useRouter } from "next/navigation";
// Define the Lead interface
interface Lead {
  id: string;
  leadInfo: {
    name: string;
    company: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  status: 'New' | 'In Progress' | 'Qualified' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string | null; // Allow null for unassigned leads
  lastContact: string;
}

// Mock API function to simulate fetching leads
const fetchLeads = async (): Promise<Lead[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          leadInfo: { name: 'John Smith', company: 'Tech Corp' },
          contact: { email: 'john@techcorp.com', phone: '+1-555-0123' },
          status: 'New',
          priority: 'High',
          assignedTo: 'Alice Johnson',
          lastContact: '2024-01-15',
        },
        {
          id: '2',
          leadInfo: { name: 'Sarah Wilson', company: 'Design Studio' },
          contact: { email: 'sarah@designstudio.com', phone: '+1-555-0124' },
          status: 'In Progress',
          priority: 'Medium',
          assignedTo: 'Bob Davis',
          lastContact: '2024-01-16',
        },
        {
          id: '3',
          leadInfo: { name: 'Mike Brown', company: 'Retail Chain' },
          contact: { email: 'mike@retailchain.com', phone: '+1-555-0125' },
          status: 'Qualified',
          priority: 'High',
          assignedTo: 'Carol White',
          lastContact: '2024-01-17',
        },
        {
          id: '4',
          leadInfo: { name: 'Lisa Garcia', company: 'Manufacturing Co' },
          contact: { email: 'lisa@manufacturing.com', phone: '+1-555-0126' },
          status: 'New',
          priority: 'Low',
          assignedTo: 'David Lee',
          lastContact: '2024-01-12',
        },
        {
          id: '5',
          leadInfo: { name: 'Tom Anderson', company: 'Consulting Firm' },
          contact: { email: 'tom@consulting.com', phone: '+1-555-0127' },
          status: 'Closed',
          priority: 'Medium',
          assignedTo: 'Alice Johnson',
          lastContact: '2024-01-18',
        },
        {
          id: '6',
          leadInfo: { name: 'Emily Clark', company: 'Tech Solutions' },
          contact: { email: 'emily@techsolutions.com', phone: '+1-555-0128' },
          status: 'New',
          priority: 'High',
          assignedTo: 'Bob Davis',
          lastContact: '2024-01-19',
        },
        {
          id: '7',
          leadInfo: { name: 'David Lee', company: 'Marketing Agency' },
          contact: { email: 'david@marketing.com', phone: '+1-555-0129' },
          status: 'In Progress',
          priority: 'Low',
          assignedTo: 'Carol White',
          lastContact: '2024-01-20',
        },
        {
          id: '8',
          leadInfo: { name: 'Unassigned Lead 1', company: 'UAT Corp' },
          contact: { email: 'unassigned1@uatcorp.com', phone: '+1-555-0130' },
          status: 'New',
          priority: 'High',
          assignedTo: null,
          lastContact: '2024-01-21',
        },
        {
          id: '9',
          leadInfo: { name: 'Unassigned Lead 2', company: 'Global Solutions' },
          contact: { email: 'unassigned2@globalsolutions.com', phone: '+1-555-0131' },
          status: 'In Progress',
          priority: 'Medium',
          assignedTo: null,
          lastContact: '2024-01-22',
        },
      ]);
    }, 500);
  });
};

// Mock API function to simulate deleting a lead
const deleteLeadApi = async (leadId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // Simulate 10% chance of failure
        console.log(`Successfully deleted lead with ID: ${leadId}`);
        resolve();
      } else {
        console.error(`Failed to delete lead with ID: ${leadId}`);
        reject(new Error('Failed to delete lead. Please try again.'));
      }
    }, 300);
  });
};

// Custom Dropdown Component
const CustomDropdown = ({
  trigger,
  children,
  className = ""
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${className}`}
      >
        {trigger}
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-lg right-0">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                const element = child as React.ReactElement<any>;
                return React.cloneElement(element, {
                  onClick: () => {
                    if (element.props.onClick) element.props.onClick();
                    setIsOpen(false);
                  }
                });
              }
              return child;
            })}
          </div>
        </>
      )}
    </div>
  );
};

const DropdownItem = ({
  children,
  onClick,
  className = ""
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <div
    className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// Confirmation Dialog Component
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


// Main App component
const App: React.FC = () => {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedWorker, setSelectedWorker] = useState<string>('All');
  const [assignmentFilter, setAssignmentFilter] = useState<'All' | 'Assigned' | 'Unassigned'>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  // Fetch leads on component mount
  useEffect(() => {
    const getLeads = async () => {
      try {
        const data = await fetchLeads();
        setLeads(data);
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
    getLeads();
  }, []);

  // Extract unique workers from the leads data
  const workers = useMemo(() => {
    const assignedToNames = new Set<string>();
    leads.forEach((lead) => {
      if (lead.assignedTo) {
        assignedToNames.add(lead.assignedTo);
      }
    });
    return ['All', ...Array.from(assignedToNames).sort()];
  }, [leads]);

  // Filter leads based on search term, assignment status, and selected worker
  const filteredLeads = useMemo(() => {
    let currentLeads = leads;

    // Apply assignment filter
    if (assignmentFilter === 'Assigned') {
      currentLeads = currentLeads.filter((lead) => lead.assignedTo !== null);
    } else if (assignmentFilter === 'Unassigned') {
      currentLeads = currentLeads.filter((lead) => lead.assignedTo === null);
    }

    // Apply worker filter (only if assignment filter is 'All' or 'Assigned')
    if (selectedWorker !== 'All' && assignmentFilter !== 'Unassigned') {
      currentLeads = currentLeads.filter((lead) => lead.assignedTo === selectedWorker);
    } else if (selectedWorker !== 'All' && assignmentFilter === 'Unassigned') {
        // If 'Unassigned' is selected for assignment, and a specific worker is also selected,
        // no leads will match, so we clear the results.
        currentLeads = [];
    }


    // Apply search term filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentLeads = currentLeads.filter(
        (lead) =>
          lead.leadInfo.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          lead.leadInfo.company.toLowerCase().includes(lowerCaseSearchTerm) ||
          lead.contact.email.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return currentLeads;
  }, [leads, searchTerm, selectedWorker, assignmentFilter]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleWorkerSelect = useCallback((worker: string) => {
    setSelectedWorker(worker);
  }, []);

  const handleAssignmentFilter = useCallback((filter: 'All' | 'Assigned' | 'Unassigned') => {
    setAssignmentFilter(filter);
    // When changing assignment filter, reset worker filter if it becomes incompatible
    if (filter === 'Unassigned' && selectedWorker !== 'All') {
      setSelectedWorker('All');
    }
  }, [selectedWorker]);

  const handleDeleteClick = useCallback((leadId: string) => {
    setLeadToDelete(leadId);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (leadToDelete) {
      try {
        await deleteLeadApi(leadToDelete); // Call the mock API
        setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadToDelete));
        setIsDeleteDialogOpen(false);
        setLeadToDelete(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete lead.');
        setIsDeleteDialogOpen(false);
        setLeadToDelete(null);
      }
    }
  }, [leadToDelete]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setLeadToDelete(null);
  }, []);


  const getStatusBadgeColor = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Qualified':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const editlead = (leadId: string) => {
    // Navigate to the edit lead page
    router.push(`/leads/update-leads/111`);
  };
  const getPriorityBadgeColor = (priority: Lead['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center">
          <p className="text-lg text-red-700 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172B] text-gray-900 dark:text-gray-100">
      {/* Header Section */}
      <header className="bg-white dark:bg-[#0F172B] shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Management</h1>
              <p className="text-gray-600 mt-1 dark:text-white">Manage and track all your leads</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search leads by name, company, or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex gap-2 sm:gap-4">
              {/* Assignment Filter Dropdown */}
              <CustomDropdown
                trigger={
                  <>
                    <Filter className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">
                      {assignmentFilter === 'All' ? 'Filter by Assignment' : assignmentFilter}
                    </span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </>
                }
              >
                <DropdownItem
                  onClick={() => handleAssignmentFilter('All')}
                  className={assignmentFilter === 'All' ? 'bg-blue-50 text-blue-600' : ''}
                >
                  All Leads
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleAssignmentFilter('Assigned')}
                  className={assignmentFilter === 'Assigned' ? 'bg-blue-50 text-blue-600' : ''}
                >
                  Assigned
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleAssignmentFilter('Unassigned')}
                  className={assignmentFilter === 'Unassigned' ? 'bg-blue-50 text-blue-600' : ''}
                >
                  Unassigned
                </DropdownItem>
              </CustomDropdown>

              {/* Worker Filter Dropdown */}
              <CustomDropdown
                trigger={
                  <>
                    <span className="truncate max-w-[120px]">{selectedWorker}</span>
                    <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                  </>
                }
              >
                {workers.map((worker) => (
                  <DropdownItem
                    key={worker}
                    onClick={() => handleWorkerSelect(worker)}
                    className={selectedWorker === worker ? 'bg-blue-50 text-blue-600' : ''}
                    // Disable specific worker selection if 'Unassigned' is the primary filter
                    // and the current worker is not 'All' or if it's 'All' but assignment filter is 'Unassigned'
                    // This is handled in filteredLeads logic, so just allow selection here.
                  >
                    {worker === null ? 'Unassigned' : worker}
                  </DropdownItem>
                ))}
              </CustomDropdown>
            </div>
          </div>
        </div>

        {/* Leads Section */}
        <div className="bg-white dark:bg-[#0F172B] rounded-lg shadow-sm border">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Leads ({filteredLeads.length})
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Complete list of leads in your system</p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block ">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#0F172B]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:bg-[#0F172B] divide-gray-200">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium dark:text-white text-gray-900">{lead.leadInfo.name}</div>
                          <div className="text-sm text-gray-500">{lead.leadInfo.company}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{lead.contact.email}</div>
                          <div className="text-sm text-gray-500">{lead.contact.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(lead.priority)}`}>
                            {lead.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-white text-gray-900">
                          {lead.assignedTo || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 dark:text-white whitespace-nowrap text-sm text-gray-900">
                          {lead.lastContact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center justify-between space-x-2">
                            {/* <button className="text-gray-400 hover:text-blue-600 transition-colors">
                              <MessageSquare size={18} />
                            </button> */}
                            <button onClick={()=>editlead(lead.id)} className="text-gray-400 hover:text-yellow-600 transition-colors">
                              <Edit size={18}  />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(lead.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No leads found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-200">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <div key={lead.id} className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{lead.leadInfo.name}</h3>
                        <p className="text-sm text-gray-500">{lead.leadInfo.company}</p>
                      </div>
                      <div className="flex space-x-2">
                        {/* <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <MessageSquare size={18} />
                        </button> */}
                        <button className="text-gray-400 hover:text-yellow-600 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(lead.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Email:</span> {lead.contact.email}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Phone:</span> {lead.contact.phone}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 mr-2">Status:</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 mr-2">Priority:</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(lead.priority)}`}>
                            {lead.priority}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Assigned To:</span> {lead.assignedTo || 'Unassigned'}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Contact:</span> {lead.lastContact}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No leads found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this lead? This action cannot be undone."
      />
    </div>
  );
};

export default App;