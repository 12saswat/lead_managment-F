"use client";

import { useState, useRef, useEffect, JSX } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  FileText,
  X,
  Loader2,
  Check,
  Upload,
  Building,
  Target,
  Calendar,
  Users,
} from "lucide-react";
import axios from "@/lib/Axios";

// TypeScript interfaces
interface Category {
  _id: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
  __v: number;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  category: string; // This will store the ObjectId
  position: string;
  leadSource: string;
  notes: string;
  priority: "high" | "medium" | "low";
  document: File | null;
  status: "new" | "in-progress" | "follow-up" | "closed";
}

interface FormErrors {
  [key: string]: string;
}

type PriorityType = "high" | "medium" | "low";

export default function AddLeadForm(): JSX.Element {
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
    document: null,
    status: "new",
  });

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories from API
  const fetchCategories = async (): Promise<void> => {
    setLoadingCategories(true);
    try {
      const response = await axios.get("/category/");
      console.log("Categories API response:", response.data);

      if (response.data.success && response.data.data) {
        setCategories(response.data.data);
        console.log("Categories loaded:", response.data.data);
      } else {
        console.error("API response structure unexpected:", response.data);
        setErrors((prev) => ({
          ...prev,
          categories: "Failed to load categories. Please refresh the page.",
        }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setErrors((prev) => ({
        ...prev,
        categories: "Failed to load categories. Please refresh the page.",
      }));
    } finally {
      setLoadingCategories(false);
    }
  };

  // Animation on mount and fetch categories
  useEffect(() => {
    fetchCategories();
    if (formRef.current) {
      formRef.current.style.opacity = "0";
      formRef.current.style.transform = "translateY(20px)";

      const timer = setTimeout(() => {
        if (formRef.current) {
          formRef.current.style.opacity = "1";
          formRef.current.style.transform = "translateY(0)";
          formRef.current.style.transition =
            "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        }
      }, 100);

      return () => clearTimeout(timer);
    }

    // Fetch categories on component mount
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

    if (
      formData.phoneNumber &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (field: keyof FormData, value: string): void => {
    console.log("Hello jiii", formData.category);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user selects
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          document: "File size must be less than 5MB",
        }));
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          document: "Please upload a PDF, DOC, or XLS file",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        document: file,
      }));

      // Clear error
      if (errors.document) {
        setErrors((prev) => ({
          ...prev,
          document: "",
        }));
      }
    }
  };

  // Remove uploaded file
  const removeFile = (): void => {
    setFormData((prev) => ({
      ...prev,
      document: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (): Promise<void> => {
    console.log("Submitting lead data:", formData);

    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`
      ) as HTMLElement;
      if (errorElement) {
        errorElement.focus();
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/lead/createlead", {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        category: formData.category, // This now contains the ObjectId
        position: formData.position,
        leadSource: formData.leadSource,
        notes: formData.notes,
        priority: formData.priority,
        document: formData.document,
        status: formData.status,
      });

      const data = response.data;
      console.log("Lead submitted successfully:", data);

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

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          category: "",
          position: "",
          leadSource: "",
          notes: "",
          priority: "medium",
          document: null,
          status: "new",
        });
        setSuccess(false);
        setErrors({});

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 3000);
    } catch (error) {
      console.error("Error submitting lead:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save lead. Please try again.",
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

  // Priority icon component
  const PriorityIcon = ({
    priority,
  }: {
    priority: PriorityType;
  }): JSX.Element => {
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

  // Priority badge component
  const PriorityBadge = ({
    priority,
  }: {
    priority: PriorityType;
  }): JSX.Element => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      <Badge variant="outline" className={`${colors[priority]} capitalize`}>
        <PriorityIcon priority={priority} />
        <span className="ml-1">{priority}</span>
      </Badge>
    );
  };

  // Get category display name by ID
  const getCategoryDisplayName = (categoryId: string): string => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.title : categoryId;
  };

  return (
    <div>
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
      `}</style>

      <div
        ref={formRef}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 py-6 sm:py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 -my-7 gap-8">
            {/* Left Column - Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Stats */}
              <Card className="bg-white/80 dark:bg-[#1a2236] backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
                    <Target className="w-5 h-5 text-blue-600" />
                    Lead Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">New Leads</span>
                    <Badge variant="secondary">24</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">In Progress</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Converted</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      8
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className=" border-0 shadow-lg dark:bg-[#1a2236]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600 " />
                    <span className="dark:text-white">Pro Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p className="mb-2">
                      • <strong>High Priority:</strong> Follow up within 24
                      hours
                    </p>
                    <p className="mb-2">
                      • <strong>Lead Source:</strong> Track where your best
                      leads come from
                    </p>
                    <p className="mb-2">
                      • <strong>Documentation:</strong> Upload relevant files
                      for context
                    </p>
                    <p>
                      • <strong>Notes:</strong> Add detailed information for
                      better follow-up
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-2">
              <Card
                ref={cardRef}
                className={`bg-white/95 dark:bg-[#1a2236] backdrop-blur-sm border-0 shadow-2xl transition-all duration-300 ${
                  success ? "ring-2 ring-green-500 ring-opacity-50" : ""
                }`}
              >
                <CardHeader className="border-b border-gray-100 bg-gray-50/50 dark:bg-[#232b3e]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Building className="w-6 h-6 text-blue-600" />
                        Add New Lead
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                        Complete the form below to add a new prospect to your
                        sales pipeline
                      </CardDescription>
                    </div>
                    <PriorityBadge priority={formData.priority} />
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Success Message */}
                    {success && (
                      <div className="bg-green-50 border border-green-200 dark:bg-green-900 dark:border-green-700 rounded-lg p-4 flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">
                            Lead saved successfully!
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-200">
                            The form will reset automatically in 3 seconds.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {errors.submit && (
                      <div className="bg-red-50 border border-red-200 dark:bg-red-900 dark:border-red-700 rounded-lg p-4 flex items-center gap-3">
                        <X className="w-5 h-5 text-red-600" />
                        <p className="font-medium text-red-800 dark:text-red-200">
                          {errors.submit}
                        </p>
                      </div>
                    )}

                    {/* Horizontal Form Layout */}
                    <div className="grid grid-cols-1 -my-7 lg:grid-cols-3 gap-6">
                      {/* Column 1 - Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                          Contact Info
                        </h3>

                        {/* Name */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
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
                              className={`pl-10 dark:bg-[#232b3e] dark:text-white dark:border-gray-700 ${
                                errors.name
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }`}
                              disabled={isLoading}
                            />
                          </div>
                          {errors.name && (
                            <p className="text-sm text-red-600 dark:text-red-300 flex items-center gap-1">
                              <X className="w-3 h-3" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
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
                              className={`pl-10 dark:bg-[#232b3e] dark:text-white dark:border-gray-700 ${
                                errors.email
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }`}
                              disabled={isLoading}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-sm text-red-600 dark:text-red-300 flex items-center gap-1">
                              <X className="w-3 h-3" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="phoneNumber"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
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
                              className={`pl-10 dark:bg-[#232b3e] dark:text-white dark:border-gray-700 ${
                                errors.phoneNumber
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }`}
                              disabled={isLoading}
                            />
                          </div>
                          {errors.phoneNumber && (
                            <p className="text-sm text-red-600 dark:text-red-300 flex items-center gap-1">
                              <X className="w-3 h-3" />
                              {errors.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Column 2 - Business Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                          Business Info
                        </h3>

                        {/* Position */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="position"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
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
                          <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value: string) =>
                              handleSelectChange("category", value)
                            }
                            disabled={isLoading || loadingCategories}
                          >
                            <SelectTrigger
                              id="category"
                              className={
                                errors.category
                                  ? "border-red-500 focus:ring-red-500"
                                  : ""
                              }
                            >
                              <SelectValue
                                placeholder={
                                  loadingCategories
                                    ? "Loading categories..."
                                    : "Select category"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {loadingCategories ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  <span className="text-sm text-gray-500">
                                    Loading categories...
                                  </span>
                                </div>
                              ) : categories.length > 0 ? (
                                categories.map((category) => (
                                  <SelectItem
                                    key={category._id}
                                    value={category._id}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                          backgroundColor: category.color,
                                        }}
                                      ></div>
                                      <span>{category.title}</span>
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="p-4 text-center text-sm text-gray-500">
                                  No categories available
                                  <br />
                                  <button
                                    onClick={fetchCategories}
                                    className="text-blue-500 hover:text-blue-700 text-xs mt-1"
                                  >
                                    Retry loading
                                  </button>
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          {errors.category && (
                            <p className="text-sm text-red-600 dark:text-red-300 flex items-center gap-1">
                              <X className="w-3 h-3" />
                              {errors.category}
                            </p>
                          )}
                          {errors.categories && (
                            <p className="text-sm text-red-600 dark:text-red-300 flex items-center gap-1">
                              <X className="w-3 h-3" />
                              {errors.categories}
                            </p>
                          )}
                        </div>

                        {/* Lead Source */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="leadSource"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
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
                      </div>

                      {/* Column 3 - Additional Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                          Additional Info
                        </h3>

                        {/* Priority */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Priority
                          </Label>
                          <Select
                            value={formData.priority}
                            onValueChange={(value: string) =>
                              handleSelectChange(
                                "priority",
                                value as PriorityType
                              )
                            }
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

                        {/* Document Upload */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>
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

                            {formData.document && (
                              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  <p className="text-xs font-medium text-gray-900 truncate">
                                    {formData.document.name}
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
                          <Label
                            htmlFor="notes"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
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
                        onClick={() => {
                          handleSubmit();
                        }}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        disabled={isLoading || success}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </div>
                        ) : success ? (
                          <div className="flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            <span>Saved!</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>Save Lead</span>
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
