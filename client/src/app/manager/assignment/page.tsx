import AssignmentTable from "@/../components/AssignmentTable";
import NewAssignmentDialog from "@/../components/NewAssignmentDialog";
import {
    ListChecks,
    Clock3,
    CheckCircle2,
    AlarmClockOff,
} from "lucide-react";

const assignments = [
    {
        id: "1",
        category: "Tech Corp",
        status: "Active" as const,
        priority: "High" as const,
        assignedTo: "Alice Johnson",
        dueDate: "2024-01-27",
    },
    {
        id: "2",
        category: "Design Studio",
        status: "Active" as const,
        priority: "Medium" as const,
        assignedTo: "Bob Davis",
        dueDate: "2024-01-25",
    },
    {
        id: "3",
        category: "Retail Chain",
        status: "Completed" as const,
        priority: "High" as const,
        assignedTo: "Carol White",
        dueDate: "2024-01-22",
    },
    {
        id: "4",
        category: "Manufacturing Co",
        status: "Overdue" as const,
        priority: "Low" as const,
        assignedTo: "David Lee",
        dueDate: "2024-01-20",
    },
];

export default function ManagerAssignmentsPage() {
    const summary = {
        total: assignments.length,
        active: assignments.filter((a) => a.status === "Active").length,
        completed: assignments.filter((a) => a.status === "Completed").length,
        overdue: assignments.filter((a) => a.status === "Overdue").length,
    };

    return (
        <div className="p-8 relative min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                    Lead Assignments
                </h1>
                <NewAssignmentDialog />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {/* Total Assignments Card */}
                <div className="p-5 bg-white dark:bg-gray-900 rounded-xl shadow-lg border-l-4 border-blue-500 dark:border-blue-700 flex items-center justify-between transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
                    <div>
                        <p className="text-base text-gray-500 dark:text-gray-400 font-medium mb-1">Total Assignments</p>
                        <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">{summary.total}</h3>
                    </div>
                    <ListChecks className="w-14 h-14 text-blue-500 dark:text-blue-400 opacity-80" />
                </div>

                {/* Active Assignments Card */}
                <div className="p-5 bg-white dark:bg-gray-900 rounded-xl shadow-lg border-l-4 border-yellow-500 dark:border-yellow-700 flex items-center justify-between transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
                    <div>
                        <p className="text-base text-gray-500 dark:text-gray-400 font-medium mb-1">Active</p>
                        <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">{summary.active}</h3>
                    </div>
                    <Clock3 className="w-14 h-14 text-yellow-500 dark:text-yellow-400 opacity-80" />
                </div>

                {/* Completed Assignments Card */}
                <div className="p-5 bg-white dark:bg-gray-900 rounded-xl shadow-lg border-l-4 border-green-500 dark:border-green-700 flex items-center justify-between transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
                    <div>
                        <p className="text-base text-gray-500 dark:text-gray-400 font-medium mb-1">Completed</p>
                        <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">{summary.completed}</h3>
                    </div>
                    <CheckCircle2 className="w-14 h-14 text-green-500 dark:text-green-400 opacity-80" />
                </div>

                {/* Overdue Assignments Card */}
                <div className="p-5 bg-white dark:bg-gray-900 rounded-xl shadow-lg border-l-4 border-red-500 dark:border-red-700 flex items-center justify-between transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
                    <div>
                        <p className="text-base text-gray-500 dark:text-gray-400 font-medium mb-1">Overdue</p>
                        <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">{summary.overdue}</h3>
                    </div>
                    <AlarmClockOff className="w-14 h-14 text-red-500 dark:text-red-400 opacity-80" />
                </div>
            </div>

            <AssignmentTable assignments={assignments} />
        </div>
    );
}
