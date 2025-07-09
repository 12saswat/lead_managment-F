'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Worker } from "./AssignmentTable";
import { toast } from "sonner";

// Mock function to simulate fetching workers from an API
export async function getAllWorkers(): Promise<Worker[]> {
    return [
        { id: "1", name: "Alice Johnson" },
        { id: "2", name: "Bob Davis" },
        { id: "3", name: "Carol White" },
        { id: "4", name: "David Lee" },
        { id: "5", name: "Eva Carter" },
    ];
}

export default function NewAssignmentDialog() {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        category: "",
        priority: "Medium",
        worker: "",
        dueDate: "",
        notes: "",
    });

    useEffect(() => {
        if (open) getAllWorkers().then(setWorkers);
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handlePriority = (value: string) => setForm({ ...form, priority: value });
    const handleWorker = (value: string) => setForm({ ...form, worker: value });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted Assignment: ", form);
        toast.success("Assignment created successfully!");
        setOpen(false);
        setForm({
            category: "",
            priority: "Medium",
            worker: "",
            dueDate: "",
            notes: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="absolute top-4 right-4 bg-gray-800 hover:bg-black text-white dark:from-gray-800 dark:to-gray-900 dark:text-white shadow-lg cursor-pointer px-6 py-2 rounded-lg">
                    + New Assignment
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[95vw] max-w-md bg-white/90 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 transition-all">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-4 text-gray-800 dark:text-white tracking-tight text-center">
                        Create New Assignment
                    </DialogTitle>
                </DialogHeader>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Category
                        </label>
                        <Input
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="e.g. Tech Corp"
                            className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

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
                            <label htmlFor="assignTo" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Assign To
                            </label>
                            <Select value={form.worker} onValueChange={handleWorker}>
                                <SelectTrigger className="dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
                                    <SelectValue placeholder="Select Worker" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:text-white">
                                    {workers.map((worker) => (
                                        <SelectItem key={worker.id} value={worker.name}>
                                            {worker.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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