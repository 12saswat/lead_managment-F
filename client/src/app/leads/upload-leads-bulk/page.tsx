"use client";

import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import ExcelUploadSection from "@/../components/ExcelUploadSection";
import OptionsAndSubmitSection from "@/../components/OptionsAndSubmitSection";
import axios from "@/lib/Axios";

interface Category {
  _id: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
  __v: number;
}
interface Worker {
  id: string;
  name: string;
}

const BulkUploadPage = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [assignee, setAssignee] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState<boolean>(true);
  const [workerError, setWorkerError] = useState<string | null>(null);
  const [excelPreview, setExcelPreview] = useState<string[][]>([]);
  const [showWorkerDropdown, setShowWorkerDropdown] = useState(true);

  const fetchCategories = async (): Promise<void> => {
    setLoadingCategories(true);
    setCategoryError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/v1/category', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        setCategoryError("Failed to load categories. Please try again.");
      }
    } catch (error: any) {
      setCategoryError(error.response?.data?.message || "Failed to load categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const fetchWorkers = async () => {
    setLoadingWorkers(true);
    setWorkerError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/v1/worker/get-all-workers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data.data)) {
        setWorkers(response.data.data);
      } else {
        setWorkerError("Failed to load workers. Please try again.");
      }
    } catch (error: any) {
      setWorkerError(error.response?.data?.message || "Failed to load workers.");
    } finally {
      setLoadingWorkers(false);
    }
  };
  useEffect(() => { fetchWorkers(); }, []);

  useEffect(() => {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const has001 = cookies.some((c) => c.startsWith("001"));
    setShowWorkerDropdown(!has001);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.name.endsWith(".xlsx"))) {
      setExcelFile(file);
      previewExcel(file);
    } else {
      toast.error("Please upload a valid Excel (.xlsx) file.");
      setExcelFile(null);
      setExcelPreview([]);
    }
  };

  const previewExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split(/\r?\n/).filter(Boolean).map(row => row.split(","));
      setExcelPreview(rows);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const headers = ["Full Name", "Email", "Phone", "Position", "Source", "Priority", "Notes"];
    const example = [
      "Raman",
      "raman@example.com",
      "9876543210",
      "Developer",
      "Advertisement",
      "High",
      "Some text here about the lead or additional notes about the lead. This can include any relevant information that helps in understanding the lead better."
    ];
    const csvContent = headers.join(",") + "\n" + example.join(",");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lead_template.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!excelFile) {
      toast.error("Please select an Excel file.");
      return;
    }
    if (!category) {
      toast.error("Please select a default category.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", excelFile);
    formData.append("category", category);
    if (assignee) {
      formData.append("assignedTo", assignee);
    }
    try {
      const res = await axios.post(
        "/lead/bulk-upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.success) {
        toast.success("Leads uploaded successfully!");
        setExcelFile(null);
        setCategory("");
        setAssignee("");
        setExcelPreview([]);
        window.location.reload(); // Reload
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upload error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-4 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800">
      <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Bulk Upload Leads
          </h1>
          <p className="text-lg text-gray-600 pt-2 dark:text-white">
            Upload large number of leads at once. Automate your workflow and save hours.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg font-semibold shadow transition-colors w-fit mb-1 cursor-pointer"
          >
            <Download className="w-5 h-5" /> Download Excel File Template
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            Download template from here.
          </span>
        </div>
      </div>
      <div className="p-10 pt-5 mt-5 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-4xl mx-auto">
        <h1 className="text-2xl text-center font-bold pb-5">Upload Lead Details</h1>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto transition-all duration-300">
          <div className={`
    transition-all duration-300
    ${excelFile ? "md:w-2/3" : "md:w-1/2"}
    w-full
  `}>
            <ExcelUploadSection
              excelFile={excelFile}
              excelPreview={excelPreview}
              handleFileChange={handleFileChange}
            />
          </div>

          <div className={`
    transition-all duration-300
    ${excelFile ? "md:w-1/3" : "md:w-1/2"}
    w-full
  `}>
            <OptionsAndSubmitSection
              category={category}
              setCategory={setCategory}
              assignee={assignee}
              setAssignee={setAssignee}
              loading={loading}
              excelFile={excelFile}
              handleUpload={handleUpload}
              categories={categories}
              loadingCategories={loadingCategories}
              categoryError={categoryError}
              fetchCategories={fetchCategories}
              workers={workers}
              loadingWorkers={loadingWorkers}
              workerError={workerError}
              fetchWorkers={fetchWorkers}
              showWorkerDropdown={showWorkerDropdown}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadPage;
