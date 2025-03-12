'use client';

import { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Users, 
  CheckCircle,
  XCircle,
  BookOpen
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';

export default function GuideAllocationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Dummy data for demonstration
  const allocations = [
    {
      id: 1,
      guideName: 'Basic Maintenance Guide',
      traineeName: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      progress: 75,
      assignedDate: '2024-03-20'
    },
    {
      id: 2,
      guideName: 'Advanced Repair Manual',
      traineeName: 'Jane Smith',
      email: 'jane@example.com',
      status: 'pending',
      progress: 0,
      assignedDate: '2024-03-19'
    },
    // Add more dummy allocations as needed
  ];

  return (
    <div className="p-6">
      <PageHeader title="Guide Allocation">
        <button className="inline-flex items-center px-4 py-2 bg-brass hover:bg-brass-light text-olive-dark rounded-lg text-sm font-medium transition-colors">
          <Users className="w-4 h-4 mr-2" />
          Allocate Guide
        </button>
      </PageHeader>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-khaki w-5 h-5" />
          <input
            type="text"
            placeholder="Search allocations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-brass-light/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-brass-light focus:border-brass-light"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="inline-flex items-center px-4 py-2 bg-white border border-brass-light/20 rounded-lg text-olive hover:bg-gray-50"
          >
            Status
            <ChevronDown className="ml-2 w-4 h-4" />
          </button>
          {showStatusDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-brass-light/20 z-10">
              <div className="py-1">
                {['all', 'active', 'pending', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setShowStatusDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-olive hover:bg-gray-50"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Allocations Table */}
      <div className="bg-white rounded-lg shadow border border-brass-light/20">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brass-light/20">
            <thead className="bg-olive-light/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-olive uppercase tracking-wider">
                  Guide / Trainee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-olive uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-olive uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-olive uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-6 py-3 relative">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brass-light/20">
              {allocations.map((allocation) => (
                <tr key={allocation.id}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm font-medium text-olive">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {allocation.guideName}
                      </div>
                      <div className="mt-1 flex flex-col text-sm text-khaki-dark">
                        <span>{allocation.traineeName}</span>
                        <span className="text-xs">{allocation.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      allocation.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : allocation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {allocation.status.charAt(0).toUpperCase() + allocation.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-brass h-2.5 rounded-full" 
                          style={{ width: `${allocation.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-khaki-dark">{allocation.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-khaki-dark">
                    {allocation.assignedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button className="text-green-600 hover:text-green-900">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
