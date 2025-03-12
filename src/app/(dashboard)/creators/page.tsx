'use client';

import Link from 'next/link';
import { 
  ChevronRight,
  BookPlus,
  BookOpen,

} from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const ActionCard = ({ title, description, icon: Icon, href }: ActionCardProps) => (
  <Link 
    href={href}
    className="group relative block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-brass-light/20"
  >
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 p-3 bg-olive-light/10 rounded-lg group-hover:bg-olive-light/20 transition-colors">
            <Icon className="w-8 h-8 text-olive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-olive group-hover:text-brass transition-colors">{title}</h3>
            <p className="mt-1 text-sm text-khaki-dark">{description}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-khaki group-hover:text-brass transition-colors" />
      </div>
    </div>
  </Link>
);

export default function CreatorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg border border-brass-light/20">
          <div className="p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-olive">Creator Dashboard</h1>
                <p className="mt-2 text-khaki-dark text-lg">Manage your maintenance guides and trainees</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Guides', value: '24' },
            { label: 'Active Trainees', value: '12' },
            { label: 'Guides This Month', value: '6' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-olive">
              <div className="text-sm text-khaki-dark font-medium uppercase tracking-wider">{stat.label}</div>
              <div className="text-3xl font-bold text-olive mt-2">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Create New Guide"
            description="Create and publish new maintenance guides"
            icon={BookPlus}
            href="/creators/guides/new"
          />
          <ActionCard
            title="Manage Guides"
            description="Edit, update, or remove existing guides"
            icon={BookOpen}
            href="/creators/guides/manage"
          />
          {/* <ActionCard
            title="Guide Allocation"
            description="Assign guides to specific trainees"
            icon={Users}
            href="/creators/guides/allocate"
          /> */}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-lg border border-brass-light/20">
          <div className="px-8 py-5 border-b border-brass-light/20">
            <h2 className="text-xl font-semibold text-olive">Recent Activity</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { title: 'New Guide Created', desc: 'Maintenance Protocol XJ-238', time: '2 hours ago', color: 'bg-brass' },
              { title: 'Guide Updated', desc: 'Vehicle Maintenance Guide V2', time: '5 hours ago', color: 'bg-olive' },
              { title: 'Guide Assigned', desc: 'To Trainee: John Smith', time: '1 day ago', color: 'bg-khaki' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-olive-light/10 transition-colors">
                <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
                <div>
                  <p className="text-sm font-medium text-olive">{item.title}</p>
                  <p className="text-sm text-khaki-dark">{item.desc}</p>
                  <p className="text-xs text-khaki mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
