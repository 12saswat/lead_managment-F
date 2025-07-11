"use client";

import React, { useState, useEffect } from "react";
// import axios from "axios"; // Assuming this is your configured Axios instance
import { Download, Loader2, TriangleAlert, Upload, X } from "lucide-react"; // Added X for error messages
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/lib/Axios";
// Assuming Axios is configured for your API base URL
// If not, you might need to adjust the import or define it here:
// import Axios from "@/lib/Axios"; // Or directly use axios if it's globally configured

// TypeScript interfaces (copied from your previous component for consistency)
interface Category {
  _id: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
  __v: number;
}

const BulkUploadPage = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [category, setCategory] = useState(""); // Stores the selected category _id
  const [assignee, setAssignee] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // State to store fetched categories
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true); // State for category loading
  const [categoryError, setCategoryError] = useState<string | null>(null); // State for category fetch errors

  // Function to fetch categories
  const fetchCategories = async (): Promise<void> => {
    setLoadingCategories(true);
    setCategoryError(null); // Clear previous errors
    try {
      // Use the correct Axios instance if it's different from the global 'axios'
      // If your Axios is configured in '@/lib/Axios', use that:
      // const response = await Axios.get("/category/");
      const response = await axios.get("/category/"); // Adjust URL if needed

      if (response.data.success && response.data.data) {
        setCategories(response.data.data);
        console.log("Categories loaded:", response.data.data);
      } else {
        console.error("API response structure unexpected:", response.data);
        setCategoryError("Failed to load categories. Please try again.");
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setCategoryError(
        error.response?.data?.message || "Failed to load categories."
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "text/csv") {
      setCsvFile(file);
    } else {
      toast.error("Please upload a valid CSV file.");
      setCsvFile(null);
    }
  };

  const handleUpload = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file.");
      return;
    }
    if (!category) {
      toast.error("Please select a default category.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("category", category); // Append the selected category _id
    formData.append("assignee", assignee);

    try {
      const res = await axios.post("http://localhost:8080/api/v1/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Leads uploaded successfully!");
        setCsvFile(null);
        setCategory(""); // Reset category after successful upload
        setAssignee("");
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Upload error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800">
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bulk Upload Leads</h1>
        <p className="text-lg text-gray-600 pt-2 dark:text-white">
          Upload large number of leads at once. Automate your workflow and save hours.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow py-8 px-4">
        <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 shadow-2xl p-8 rounded-2xl w-full max-w-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 ease-in-out">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4 tracking-tight">
            Upload Your File
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Section: File Upload */}
            <div className='flex flex-col text-left gap-2 flex-1'>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Choose CSV File</span>
              <Label
                htmlFor="document"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200 group relative"
              >
                <div className="flex flex-col items-center justify-center pt-3 pb-4 px-2">
                  <Upload className="w-10 h-10 text-gray-400 dark:text-gray-400 mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    (CSV only, max 5MB)
                  </p>
                </div>
                {/* Display selected file name */}
                {csvFile && (
                  <p className="absolute bottom-3 text-sm text-gray-700 dark:text-gray-200 font-medium px-2 truncate w-full text-center">
                    File: <span className="font-bold">{csvFile.name}</span>
                  </p>
                )}
                <Input
                  id="document"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".csv"
                />
              </Label>
            </div>

            {/* Right Section: Default Options and Submit */}
            <div className="flex flex-col gap-6 flex-1">
              {/* Default Category Select */}
              <div className="flex flex-col gap-2">
                <label htmlFor="defaultCategory" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Default Category
                </label>
                <select
                  id="defaultCategory"
                  className="border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading || loadingCategories} // Disable while uploading or loading categories
                >
                  {loadingCategories ? (
                    <option value="">Loading categories...</option>
                  ) : categories.length > 0 ? (
                    <>
                      <option value="">Select Category</option> {/* Placeholder option */}
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.title}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value="">No categories available</option>
                  )}
                </select>
                {categoryError && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <X className="w-3 h-3" /> {categoryError}
                    <button
                      onClick={fetchCategories}
                      className="text-blue-500 hover:text-blue-700 text-xs ml-1"
                    >
                      Retry
                    </button>
                  </p>
                )}
              </div>

              {/* Default Assignee Select */}
              <div className="flex flex-col gap-2">
                <label htmlFor="defaultAssignee" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Default Assignee</label>
                <select
                  id="defaultAssignee"
                  className="border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select Worker</option>
                  {/* Dynamically populate workers here if available from getAllWorkers */}
                  <option value="worker1">Worker 1</option>
                  <option value="worker2">Worker 2</option>
                  <option value="worker3">Worker 3</option>
                  <option value="worker4">Worker 4</option>
                </select>
              </div>

              <div className="flex flex-col gap-4 pt-2">
                <button
                  onClick={handleUpload}
                  disabled={loading || !csvFile || !category} // Disable if no category selected
                  className="bg-blue-600 text-white flex items-center justify-center gap-2 px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md transition-all duration-200 ease-in-out"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Upload & Submit
                    </>
                  )}
                </button>
                <p className="text-sm text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-1 font-medium">
                  <TriangleAlert className="w-4 h-4" /> Make sure your CSV is formatted correctly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        pauseOnHover
      />
    </div>
  );
};

export default BulkUploadPage;
