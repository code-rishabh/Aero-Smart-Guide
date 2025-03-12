'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Users,
  UserPlus,
  Settings,
  Menu,
  X,
  Shield,
  LogOut,
  PlusCircle
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
// import toast from 'react-hot-toast';
import { logout } from '@/utils/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({
  children,
  isAdmin = false
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  
  // Determine if we're in admin section based on both prop and URL
  const isAdminSection = isAdmin || pathname.startsWith('/admin');
  
  const navItems: NavItem[] = [
    {
      label: 'Manage Guides',
      href: isAdminSection ? '/admin/guides/manage' : '/creators/guides/manage',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      label: 'Create Guide',
      href: isAdminSection ? '/admin/guides/new' : '/creators/guides/new',
      icon: <PlusCircle className="w-5 h-5" />
    },
    // {
    //   label: 'Manage Trainees',
    //   href: isAdminSection ? '/admin/guides/allocate' : '/creators/guides/allocate',
    //   icon: <Users className="w-5 h-5" />
    // },
    // Admin-only: Manage Creators tab
    ...(isAdminSection ? [{
      label: 'Manage Creators',
      href: '/admin/creators',
      icon: <UserPlus className="w-5 h-5" />
    }] : []),
    {
      label: isAdminSection ? 'Admin Dashboard' : 'Creator Dashboard',
      href: isAdminSection ? '/admin' : '/creators',
      icon: <Shield className="w-5 h-5" />
    },
    
  ];

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user } = useUser();

  // Optional: Log the current section for debugging
  useEffect(() => {
    console.log('Current section:', isAdminSection ? 'Admin' : 'Creator');
    console.log('Current path:', pathname);
  }, [isAdminSection, pathname]);

  const handleLogout = () => {
    logout();
  };

  const getRoleText = (role: number) => {
    switch (role) {
      case 0:
        return 'Administrator';
      case 1:
        return 'Creator';
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className="fixed left-0 top-0 z-40 h-screen w-64 bg-olive-dark border-r border-brass-light/20"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          {/* <Link href="/"> */}
            <div className="flex h-16 items-center justify-center border-b border-brass-light/20">
              <svg
                className="w-8 h-8 text-brass-light mr-2"
                viewBox="0 0 173.189 216.399"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M125.493.18 42.325 216.218"
                  style={{ fill: "none", stroke: "currentColor", strokeMiterlimit: 10 }}
                />
                <path
                  d="M137.3.18 54.132 216.219"
                  style={{ fill: "none", stroke: "#69c4d2", strokeMiterlimit: 10 }}
                />
                <path
                  d="M149.108.18 65.939 216.219M149.108.18 65.939 216.219M172.722.18 89.554 216.219"
                  style={{ fill: "none", stroke: "currentColor", strokeMiterlimit: 10 }}
                />
                <path
                  d="M160.915.18 77.746 216.219M26.468 123.771l-4.881 12.615M52.066 106.514l-9.065 23.788"
                  style={{ fill: "none", stroke: "#69c4d2", strokeMiterlimit: 10 }}
                />
                <path
                  style={{ fill: "none", stroke: "currentColor", strokeMiterlimit: 10 }}
                  d="m61.083 167.49-26.175 15.084-2.899 13.464 20.077-5.176M102.373 60.235v-15.45a31.656 31.656 0 0 0-7.669-20.658c-4.27-4.959-11.951-4.959-16.221 0a31.658 31.658 0 0 0-7.669 20.658v39.149l-66.72 39.06-3.563 19.375 71.302-20.258v17.458"
                />
                <path
                  d="M26.978 109.698v-4.687a7.768 7.768 0 0 0-15.536 0v13.614M51.261 95.551v-4.687a7.768 7.768 0 0 0-15.536 0v13.614M86.744 61.997v38.838"
                  style={{ fill: "none", stroke: "currentColor", strokeMiterlimit: 10 }}
                />
                <path
                  d="M94.958 43.208H78.529l1.325-4.428a4.947 4.947 0 0 1 4.738-3.528h4.302a4.945 4.945 0 0 1 4.738 3.528l1.325 4.428Z"
                  style={{ fill: "none", stroke: "#69c4d2", strokeMiterlimit: 10 }}
                />
              </svg>
              <h1 className="text-xl font-bold text-white">Aero Smart Guide</h1>
            </div>
          {/* </Link> */}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = item.label.includes('Dashboard') 
                ? pathname === item.href // Exact match for dashboard
                : pathname.startsWith(item.href); // Prefix match for other items
                
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 rounded-lg px-4 py-2.5 
                    transition-all duration-200 group relative
                    hover:bg-olive-light hover:text-brass-light
                    ${isActive
                      ? 'bg-olive-light text-brass-light border border-brass-light/20'
                      : 'text-khaki-light'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brass rounded-r-full" />
                  )}
                  <div 
                    className={`transition-colors duration-200 
                      ${isActive 
                        ? 'text-brass-light' 
                        : 'text-khaki-light group-hover:text-brass-light'
                      }`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium transition-colors duration-200">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-olive-dark h-16 border-b border-brass-light/20 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-khaki-light hover:text-brass-light hover:bg-olive-light transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Profile Section moved to top bar */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-olive-light hover:bg-olive-dark transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-brass-light/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-brass-light" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">{user?.name || 'Guest'}</p>
                <p className="text-xs text-khaki-light">{user ? getRoleText(user.role) : 'Not logged in'}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-olive-dark border border-brass-light/20 shadow-lg">
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-khaki-light hover:bg-olive-light hover:text-brass-light"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-olive-light hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}