"use client";

import React, { useState } from "react";
import axios from "axios";
import { Download, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BulkUploadPage = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [assignee, setAssignee] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("category", category);
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
        setCategory("");
        setAssignee("");
      } else {
        toast.error("Upload failed. Please try again.");
      }
    }
    catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Upload error.");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bulk Upload Leads</h1>
        <p className="text-lg text-gray-600 pt-2 dark:text-white">
          Upload large number of leads at once. Automate your workflow and save hours.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="flex flex-col gap-5 bg-white dark:bg-gray-800 shadow-lg p-8 rounded-xl w-full max-w-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Upload Your File
          </h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-white">Choose File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 file:border-0 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-md hover:file:bg-blue-700"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-white">Default Category</label>
            <select
              className="border border-gray-300 dark:border-gray-700 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="support">Support</option>
              <option value="development">Development</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-white">Default Assignee</label>
            <select
              className="border border-gray-300 dark:border-gray-700 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">Select Worker</option>
              <option value="worker1">Worker 1</option>
              <option value="worker2">Worker 2</option>
              <option value="worker3">Worker 3</option>
              <option value="worker4">Worker 4</option>
            </select>
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> Uploading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Upload & Submit
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 text-center dark:text-white">
              ⚠️ Make sure your CSV is formatted correctly.
            </p>
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
