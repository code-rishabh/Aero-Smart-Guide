import { BookPlus, BookOpen, Users, UserPlus } from 'lucide-react';

export const dashboardActions = {
  shared: [
    {
      title: "Create New Guide",
      description: "Create and publish new maintenance guides",
      icon: BookPlus,
      href: "/guides/new",
      iconColor: "text-green-600"
    },
    {
      title: "Manage Guides",
      description: "Edit, update, or remove existing guides",
      icon: BookOpen,
      href: "/guides/manage",
      iconColor: "text-blue-600"
    },
    {
      title: "Guide Allocation",
      description: "Assign guides to specific trainees",
      icon: Users,
      href: "/guides/allocate",
      iconColor: "text-purple-600"
    }
  ],
  adminOnly: [
    {
      title: "Manage Creators",
      description: "Add, remove, or modify creator permissions",
      icon: UserPlus,
      href: "/admin/creators",
      iconColor: "text-orange-600"
    }
  ]
}; 