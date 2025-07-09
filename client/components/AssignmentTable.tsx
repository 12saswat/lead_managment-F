'use client';

export type Worker = {
    id: string;
    name: string;
};

export type Assignment = {
    id: string;
    category: string;
    status: 'Active' | 'Completed' | 'Overdue';
    priority: 'High' | 'Medium' | 'Low';
    assignedTo: string;
    dueDate: string;
};

interface Props {
    assignments: Assignment[];
}

const statusBadgeStyle = {
    Active: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const priorityBadgeStyle = {
    High: 'bg-red-100 text-red-700 dark:bg-red-300 dark:text-red-900',
    Medium: 'bg-orange-100 text-orange-700 dark:bg-orange-300 dark:text-orange-900',
    Low: 'bg-green-100 text-green-700 dark:bg-green-300 dark:text-green-900',
};

export default function AssignmentTable({ assignments }: Props) {
    return (
        <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Assignments</h2>
            </div>
            <hr className="w-full mb-4 dark:border-gray-700" />
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {assignments.map((a) => (
                    <li
                        key={a.id}
                        className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 transition hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded-md"
                    >
                        <div className="flex flex-col justify-between gap-1">
                            <div className="flex gap-8 flex-wrap">
                                <p className="font-semibold text-gray-900 text-lg dark:text-white">{a.category}</p>
                                <div className="flex gap-2 mt-1 flex-wrap">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadgeStyle[a.status]}`}>
                                        {a.status}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityBadgeStyle[a.priority]}`}>
                                        {a.priority}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Due: {a.dueDate}</p>
                        </div>

                        <div className="text-sm text-gray-600 text-right dark:text-gray-300">
                            <p className="mb-1">Assigned to</p>
                            <p className="font-medium text-md text-gray-800 dark:text-white">{a.assignedTo}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
