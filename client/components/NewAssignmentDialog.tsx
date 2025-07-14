'use client';
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "@/lib/Axios";
import { Search, Check, CheckCheck } from "lucide-react";

interface Category {
  _id: string;
  title: string;
}

interface Worker {
  _id: string;
  name: string;
}

interface Lead {
  id: string;
  name: string;
  position: string;
  category: string;
}

export default function NewAssignmentDialog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    category: "",
    priority: "medium",
    worker: "",
    dueDate: "",
    notes: "",
  });

  // Fetch categories, workers, and unassigned leads when dialog opens
  useEffect(() => {
    if (open) {
      axios.get('/category')
        .then(res => {
          if (Array.isArray(res.data.data)) setCategories(res.data.data);
        });
      axios.get('/worker/get-all-workers')
        .then(res => {
          if (Array.isArray(res.data.data)) setWorkers(res.data.data);
        });
      axios.get('/lead/getalllead',)
        .then(res => {
          // Adapt to your API response structure
          const data = res.data?.data?.leads || [];
          const mappedLeads = data
            .filter((lead: any) => !lead.assignedTo || lead.assignedTo.name === "Unassigned")
            .map((lead: any) => ({
              id: lead.id,
              name: lead.name,
              position: lead.position || "",
              category: lead.category || "",
            }));
          setLeads(mappedLeads);
        });
    }
  }, [open]);

  // Filter leads based on search term
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePriority = (value: string) => setForm({ ...form, priority: value });
  const handleCategory = (value: string) => setForm({ ...form, category: value });
  const handleWorker = (value: string) => setForm({ ...form, worker: value });

  // Handle lead checkbox selection
  const handleLeadCheckbox = (leadId: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  // Select all leads
  const handleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map(lead => lead.id));
    }
  };

  // Submit assignment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.worker || !form.category || selectedLeadIds.length === 0) {
      toast.error("Please select worker, category, and at least one lead.");
      return;
    }
    try {
      await axios.post('/lead/assign', {
        leadIds: selectedLeadIds,
        assignedTo: form.worker,
        priority: form.priority.toLowerCase(),
        dueDate: form.dueDate,
        notes: form.notes,
        category: form.category,
      });
      toast.success("Leads assigned successfully!");
      setOpen(false);
      setForm({
        category: "",
        priority: "Medium",
        worker: "",
        dueDate: "",
        notes: "",
      });
      setSelectedLeadIds([]);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to assign leads.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="absolute top-4 right-4 bg-gray-800 hover:bg-black text-white shadow-lg cursor-pointer px-6 py-2 rounded-lg">
          + New Assignment
        </Button>
      </DialogTrigger>

      <DialogContent className=" max-w-screen-xl  bg-white/90 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 transition-all">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4 text-gray-800 dark:text-white tracking-tight text-center">
            Assign Leads
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Lead Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Unassigned Leads
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs h-8 px-3"
                >
                  {selectedLeadIds.length === filteredLeads.length ? (
                    <>
                      <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      Select All
                    </>
                  )}
                </Button>
                <span className="text-xs text-gray-500">
                  {selectedLeadIds.length} selected
                </span>
              </div>
            </div>
            
            <div className="relative mb-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            
            <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
              <div className="max-h-60 overflow-y-auto">
                {filteredLeads.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {leads.length === 0 ? 'No unassigned leads available.' : 'No matching leads found.'}
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredLeads.map((lead) => (
                      <li key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <label className="flex items-center px-4 py-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(lead.id)}
                            onChange={() => handleLeadCheckbox(lead.id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {lead.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {lead.position || 'No position specified'}
                            </p>
                          </div>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Category
            </label>
            <Select value={form.category} onValueChange={handleCategory}>
              <SelectTrigger className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-white">
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Worker Dropdown */}
          <div>
            <label htmlFor="assignTo" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Assign To
            </label>
            <Select value={form.worker} onValueChange={handleWorker}>
              <SelectTrigger className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Select Worker" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-white">
                {workers.map((worker) => (
                  <SelectItem key={worker._id} value={worker._id}>
                    {worker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <Select value={form.priority} onValueChange={handlePriority}>
                <SelectTrigger className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-white">
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Due Date
              </label>
              <Input
                id="dueDate"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any relevant notes here..."
              className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 rounded-md shadow-lg transition-all duration-200 ease-in-out cursor-pointer"
          >
            Assign Lead
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}