'use client';

import { useState } from 'react';
import {  Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';

// Define available roles
const ROLES = [
  { id: 0, name: 'Admin' },
  { id: 1, name: 'Creator' },
  { id: 2, name: 'Trainee' }
];

// Define current permissions/responsibilities
const PERMISSIONS = [
  { 
    id: 'create_guide', 
    name: 'Create Guide', 
    description: 'Ability to create new maintenance guides' 
  },
  { 
    id: 'edit_guide', 
    name: 'Edit Guide', 
    description: 'Ability to edit existing guides' 
  },
  { 
    id: 'delete_guide', 
    name: 'Delete Guide', 
    description: 'Ability to delete guides' 
  },
  { 
    id: 'manage_users', 
    name: 'Manage Users', 
    description: 'Ability to create and manage user accounts' 
  },
  { 
    id: 'change_roles', 
    name: 'Change Roles', 
    description: 'Ability to change user roles' 
  }
];

// Default permissions mapping
const DEFAULT_PERMISSIONS = {
  0: ['create_guide', 'edit_guide', 'delete_guide', 'manage_users', 'change_roles'], // Admin
  1: ['create_guide', 'edit_guide'], // Creator
  2: [] // Trainee
};

// Add this type definition
type RolePermissions = {
  [key: number]: string[];
};

export default function AccessManagementPage() {
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(DEFAULT_PERMISSIONS);
  const [isLoading, setIsLoading] = useState(false);

  const hasPermission = (roleId: number, permissionId: string) => {
    return rolePermissions[roleId]?.includes(permissionId);
  };

  const togglePermission = async (roleId: number, permissionId: string) => {
    try {
      setIsLoading(true);
      
      // Create new permissions array
      const newPermissions = { ...rolePermissions };
      if (hasPermission(roleId, permissionId)) {
        newPermissions[roleId] = newPermissions[roleId].filter(p => p !== permissionId);
      } else {
        newPermissions[roleId] = [...(newPermissions[roleId] || []), permissionId];
      }

      // Here you would make an API call to update permissions
      // await axios.post('/update-permissions', { roleId, permissions: newPermissions[roleId] });

      setRolePermissions(newPermissions);
      toast.success('Permissions updated successfully');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="Access Management" 
        description="Manage role-based permissions and access controls"
      />

      <div className="mt-6 bg-white rounded-lg shadow-lg border border-brass-light/20">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-olive-light/10">
                <th className="px-6 py-3 border-b border-brass-light/20 text-left text-sm font-medium text-olive">
                  Permissions
                </th>
                {ROLES.map(role => (
                  <th key={role.id} className="px-6 py-3 border-b border-brass-light/20 text-center text-sm font-medium text-olive">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brass-light/20">
              {PERMISSIONS.map(permission => (
                <tr key={permission.id}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-olive">{permission.name}</p>
                      <p className="text-sm text-khaki">{permission.description}</p>
                    </div>
                  </td>
                  {ROLES.map(role => (
                    <td key={role.id} className="px-6 py-4 text-center">
                      <button 
                        onClick={() => togglePermission(role.id, permission.id)}
                        disabled={role.id === 0 || isLoading} // Prevent changing Admin permissions
                        className={`p-2 rounded-full transition-colors ${
                          hasPermission(role.id, permission.id)
                            ? 'bg-brass-light/20 text-brass hover:bg-brass-light/30'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        } ${role.id === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        {hasPermission(role.id, permission.id) ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 