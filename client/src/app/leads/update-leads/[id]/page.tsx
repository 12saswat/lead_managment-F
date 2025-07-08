"use client";

import { useState, useRef, useEffect, JSX } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Briefcase, ArrowUp, ArrowDown, ArrowRight, FileText, X, Loader2, Check, Upload, Building, Target, Calendar, Users } from "lucide-react";
import { usePathname } from "next/navigation"; // To get the ID from the URL

// TypeScript interfaces (Updated for Update Lead)
interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  category: string; // Corresponds to 'ObjectId'
  position: string;
  leadSource: string;
  notes: string;
  status: "new" | "in-progress" | "follow-up" | "closed"; // Updated status enum values
  priority: "high" | "medium" | "low";
  followUpDates: string[]; // Array of date strings (e.g., ISO dates)
  lastContact: string; // Date string (e.g., ISO date)
  documents: File | null; // file || null
}

interface FormErrors {
  [key: string]: string;
}

type PriorityType = "high" | "medium" | "low";

// Mock API data structure for a lead
interface LeadData {
  _id: string; // Assuming an ID for the lead
  name: string;
  email: string;
  phoneNumber: string;
  category: string;
  position: string;
  leadSource: string;
  notes: string;
  status: "new" | "in-progress" | "follow-up" | "closed";
  priority: "high" | "medium" | "low";
  followUpDates: string[];
  lastContact: string;
  documents: string | null; // For fetched data, this might be a URL or file name, not the File object itself
  createdAt: string; // Original creation date
  createdBy: string; // Original creator
}

export default function UpdateLeadForm(): JSX.Element {
  const pathname = usePathname();
  // Extract leadId from the URL path, e.g., /update-lead/123 -> 123
  const leadId = pathname.split('/').pop();

  // Form state with proper typing
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    category: "",
    position: "",
    leadSource: "",
    notes: "",
    priority: "medium",
    documents: null,
    status: "new",
    followUpDates: [],
    lastContact: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingLead, setIsFetchingLead] = useState<boolean>(true); // New state for fetching initial lead data
  const [success, setSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock API Call to fetch lead data
  const fetchLeadData = async (id: string) => {
    setIsFetchingLead(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data for a specific lead
    const mockLead: LeadData = {
      _id: id,
      name: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "123-456-7890",
      category: "IT",
      position: "Senior Developer",
      leadSource: "Website",
      notes: "Interested in enterprise solutions. Follow up next week.",
      status: "in-progress", // Pre-populated status
      priority: "high", // Pre-populated priority
      followUpDates: ["2025-07-15T09:00:00Z", "2025-07-22T14:30:00Z"],
      lastContact: "2025-07-01T10:00:00Z",
      documents: null, // Simulate no document initially or a URL if one exists
      createdAt: "2025-06-20T08:00:00Z",
      createdBy: "admin_user_id",
    };

    // Populate form data with fetched lead data
    setFormData({
      name: mockLead.name,
      email: mockLead.email,
      phoneNumber: mockLead.phoneNumber,
      category: mockLead.category,
      position: mockLead.position,
      leadSource: mockLead.leadSource,
      notes: mockLead.notes,
      priority: mockLead.priority,
      documents: null, // Documents are handled separately, so start with null for File object
      status: mockLead.status,
      followUpDates: mockLead.followUpDates,
      lastContact: mockLead.lastContact,
    });
    setIsFetchingLead(false);
  };

  // Fetch lead data on component mount or when leadId changes
  useEffect(() => {
    if (leadId) {
      fetchLeadData(leadId);
    } else {
      // Handle case where no leadId is provided (e.g., redirect or show error)
      console.error("No lead ID provided for update.");
      setIsFetchingLead(false);
    }
  }, [leadId]);


  // Animation on mount
  useEffect(() => {
    if (formRef.current) {
      formRef.current.style.opacity = "0";
      formRef.current.style.transform = "translateY(20px)";

      const timer = setTimeout(() => {
        if (formRef.current) {
          formRef.current.style.opacity = "1";
          formRef.current.style.transform = "translateY(0)";
          formRef.current.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (formData.phoneNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value as any // Type assertion because `value` might not perfectly match enum types for status/priority
    }));

    // Clear error when user selects
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          document: "File size must be less than 5MB"
        }));
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          document: "Please upload a PDF, DOC, or XLS file"
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        documents: file
      }));

      // Clear error
      if (errors.document) {
        setErrors(prev => ({
          ...prev,
          document: ""
        }));
      }
    }
  };

  // Remove uploaded file
  const removeFile = (): void => {
    setFormData(prev => ({
      ...prev,
      documents: null
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (errorElement) {
        errorElement.focus();
      }
      return;
    }

    setIsLoading(true);

    try {
      // Prepare submission data (matching your provided request body for Update Lead)
      const submissionData: Omit<FormData, "documents"> & { documents: File | string | null } = { // documents can be File or string (for existing URL)
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        category: formData.category,
        position: formData.position,
        leadSource: formData.leadSource,
        notes: formData.notes,
        status: formData.status,
        priority: formData.priority,
        followUpDates: formData.followUpDates,
        lastContact: formData.lastContact,
        documents: formData.documents // If it's a new file, it's the File object. If it's an existing file not changed, it would be its URL/name.
                                      // For simplicity in this mock, we're sending the File object. In a real app, you'd handle existing file URLs differently.
      };

      // Create FormData for file upload (if documents exist)
      const payload = new FormData();
      for (const key in submissionData) {
        if (key === "documents" && submissionData.documents) {
            payload.append(key, submissionData.documents);
        } else if (Array.isArray((submissionData as any)[key])) {
            payload.append(key, JSON.stringify((submissionData as any)[key])); // Stringify arrays
        }
        else if ((submissionData as any)[key] !== null) {
            payload.append(key, (submissionData as any)[key]);
        }
      }

      console.log("Submitting payload:", submissionData); // Log the object without FormData issues

      // Simulate API call for PUT /updateleads/:id
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (leadId === "mock-fail-id") { // Example of a mock failure
            reject(new Error("Failed to update lead (mock error)"));
          } else {
            console.log(`Mock PUT request to /api/updateleads/${leadId} with data:`, submissionData);
            resolve({ status: 200, message: "Lead updated successfully!" });
          }
        }, 2000);
      });

      console.log("Lead update successful:", response);
      setSuccess(true);

      // Add success animation
      if (cardRef.current) {
        cardRef.current.style.transform = "scale(1.02)";
        cardRef.current.style.transition = "transform 0.2s ease-out";
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transform = "scale(1)";
          }
        }, 200);
      }

      // Reset form after success (optional for update, usually you'd show a success message and keep data)
      const resetTimer = setTimeout(() => {
        setSuccess(false);
        setErrors({});
        // Re-fetch lead data to show latest state, or keep existing data
        if (leadId) {
          fetchLeadData(leadId);
        }
      }, 3000); // Wait 3 seconds then clear success message and potentially re-fetch

    } catch (error: any) {
      console.error("Error updating lead:", error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || "Failed to update lead. Please try again."
      }));

      // Error animation
      if (cardRef.current) {
        cardRef.current.style.animation = "shake 0.6s ease-in-out";
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.animation = "";
          }
        }, 600);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Priority icon component (unchanged)
  const PriorityIcon = ({ priority }: { priority: PriorityType }): JSX.Element => {
    switch (priority) {
      case "high":
        return <ArrowUp className="w-4 h-4 text-red-500" />;
      case "medium":
        return <ArrowRight className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <ArrowDown className="w-4 h-4 text-green-500" />;
      default:
        return <ArrowRight className="w-4 h-4 text-yellow-500" />;
    }
  };

  // Priority badge component (unchanged)
  const PriorityBadge = ({ priority }: { priority: PriorityType }): JSX.Element => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200"
    };

    return (
      <Badge variant="outline" className={`${colors[priority]} capitalize`}>
        <PriorityIcon priority={priority} />
        <span className="ml-1">{priority}</span>
      </Badge>
    );
  };

  if (isFetchingLead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-700">Loading lead data...</span>
      </div>
    );
  }

  return (
    <div>
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      <div
        ref={formRef}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 -my-7 gap-8">
            {/* Left Column - Info Cards (unchanged) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Stats */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Lead Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">New Leads</span>
                    <Badge variant="secondary">24</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Converted</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">8</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-700">
                    <p className="mb-2">• <strong>High Priority:</strong> Follow up within 24 hours</p>
                    <p className="mb-2">• <strong>Lead Source:</strong> Track where your best leads come from</p>
                    <p className="mb-2">• <strong>Documentation:</strong> Upload relevant files for context</p>
                    <p>• <strong>Notes:</strong> Add detailed information for better follow-up</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-2">
              <Card
                ref={cardRef}
                className={`bg-white/95 backdrop-blur-sm border-0 shadow-2xl transition-all duration-300 ${
                  success ? "ring-2 ring-green-500 ring-opacity-50" : ""
                }`}
              >
                <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Building className="w-6 h-6 text-blue-600" />
                        Update Lead {leadId && <span className="text-gray-500 text-base">(ID: {leadId})</span>}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        Modify the details of an existing prospect in your sales pipeline.
                      </CardDescription>
                    </div>
                    <PriorityBadge priority={formData.priority} />
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Success Message */}
                    {success && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Lead updated successfully!</p>
                          <p className="text-sm text-green-600">The form will refresh with the latest data.</p>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {errors.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <X className="w-5 h-5 text-red-600" />
                        <p className="font-medium text-red-800">{errors.submit}</p>
                      </div>
                    )}

                    {/* Horizontal Form Layout */}
                    <div className="grid grid-cols-1 -my-7 lg:grid-cols-3 gap-6">
                      {/* Column 1 - Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                          Contact Info
                        </h3>

                        {/* Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Full name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className={`pl-10 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                              disabled={isLoading}
                            />
                          </div>
                          {errors.name && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <X className="w-3 h-3" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Email address"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                              disabled={isLoading}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <X className="w-3 h-3" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                            Phone
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phoneNumber"
                              name="phoneNumber"
                              type="tel"
                              placeholder="Phone number"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              className={`pl-10 ${errors.phoneNumber ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                              disabled={isLoading}
                            />
                          </div>
                          {errors.phoneNumber && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <X className="w-3 h-3" />
                              {errors.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Column 2 - Business Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                          Business Info
                        </h3>

                        {/* Position */}
                        <div className="space-y-2">
                          <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                            Position
                          </Label>
                          <Input
                            id="position"
                            name="position"
                            type="text"
                            placeholder="Position/title"
                            value={formData.position}
                            onChange={handleInputChange}
                            disabled={isLoading}
                          />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Industry <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value: string) => handleSelectChange("category", value)}
                            disabled={isLoading}
                          >
                            <SelectTrigger className={errors.category ? "border-red-500 focus:ring-red-500" : ""}>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IT">IT</SelectItem>
                              <SelectItem value="Hospital">Healthcare</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="Teachers">Education</SelectItem>
                              <SelectItem value="Students">Students</SelectItem>
                              <SelectItem value="Banks">Banking</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.category && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <X className="w-3 h-3" />
                              {errors.category}
                            </p>
                          )}
                        </div>

                        {/* Lead Source */}
                        <div className="space-y-2">
                          <Label htmlFor="leadSource" className="text-sm font-medium text-gray-700">
                            Source
                          </Label>
                          <Input
                            id="leadSource"
                            name="leadSource"
                            type="text"
                            placeholder="Lead source"
                            value={formData.leadSource}
                            onChange={handleInputChange}
                            disabled={isLoading}
                          />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Status
                          </Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value: string) => handleSelectChange("status", value)}
                            disabled={isLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="follow-up">Follow Up</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Column 3 - Additional Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                          Additional Info
                        </h3>

                        {/* Priority */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Priority
                          </Label>
                          <Select
                            value={formData.priority}
                            onValueChange={(value: string) => handleSelectChange("priority", value as PriorityType)}
                            disabled={isLoading}
                          >
                            <SelectTrigger>
                              <div className="flex items-center gap-2">
                                <PriorityIcon priority={formData.priority} />
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">
                                <div className="flex items-center gap-2">
                                  <ArrowUp className="w-4 h-4 text-red-500" />
                                  <span>High</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="medium">
                                <div className="flex items-center gap-2">
                                  <ArrowRight className="w-4 h-4 text-yellow-500" />
                                  <span>Medium</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="low">
                                <div className="flex items-center gap-2">
                                  <ArrowDown className="w-4 h-4 text-green-500" />
                                  <span>Low</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Last Contact */}
                        <div className="space-y-2">
                          <Label htmlFor="lastContact" className="text-sm font-medium text-gray-700">
                            Last Contact Date
                          </Label>
                          <Input
                            id="lastContact"
                            name="lastContact"
                            type="datetime-local" // Using datetime-local for ISO string representation
                            value={formData.lastContact ? new Date(formData.lastContact).toISOString().slice(0, 16) : ""} // Format for input
                            onChange={handleInputChange}
                            disabled={isLoading}
                          />
                        </div>

                        {/* Follow Up Dates (simplified for input, in real app consider a date picker with multiple selections) */}
                        <div className="space-y-2">
                          <Label htmlFor="followUpDates" className="text-sm font-medium text-gray-700">
                            Follow Up Dates (comma-separated)
                          </Label>
                          <Input
                            id="followUpDates"
                            name="followUpDates"
                            type="text"
                            placeholder="YYYY-MM-DD, YYYY-MM-DD"
                            value={formData.followUpDates.map(d => new Date(d).toISOString().slice(0, 10)).join(', ')}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              followUpDates: e.target.value.split(',').map(s => s.trim()).filter(Boolean).map(s => new Date(s).toISOString())
                            }))}
                            disabled={isLoading}
                          />
                          <p className="text-xs text-gray-500">Enter dates as YYYY-MM-DD, separated by commas.</p>
                        </div>


                        {/* Document Upload */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Documents
                          </Label>
                          <div className="flex flex-col gap-2">
                            <Label
                              htmlFor="document"
                              className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group"
                            >
                              <div className="flex flex-col items-center justify-center pt-3 pb-4">
                                <Upload className="w-6 h-6 text-gray-400 mb-1 group-hover:text-gray-500 transition-colors" />
                                <p className="text-xs text-gray-500 text-center">
                                  <span className="font-semibold">Click to upload</span>
                                </p>
                              </div>
                              <Input
                                ref={fileInputRef}
                                id="document"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                disabled={isLoading}
                              />
                            </Label>

                            {formData.documents && ( // Changed to formData.documents
                              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  <p className="text-xs font-medium text-gray-900 truncate">
                                    {formData.documents.name}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeFile}
                                  className="text-gray-400 hover:text-gray-600 p-1 h-auto"
                                  disabled={isLoading}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                          <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                            Notes
                          </Label>
                          <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Additional notes..."
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="min-h-[80px] resize-none"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-10 pt-4 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        disabled={isLoading}
                        onClick={() => window.history.back()}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        disabled={isLoading || success}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : success ? (
                          <div className="flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            <span>Updated!</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>Update Lead</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}