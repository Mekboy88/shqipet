
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import supabase from '@/lib/relaxedSupabase';
import { AdminUsersIcon } from '@/components/icons/AdminUsersIcon';
import { ActiveUsersIcon } from '@/components/icons/ActiveUsersIcon';
import { InactiveUsersIcon } from '@/components/icons/InactiveUsersIcon';
import { StatsPanel } from './StatsPanel';
import { Eye } from 'lucide-react';
import { CalendarStatsIcon } from '@/components/icons/CalendarStatsIcon';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

const fetchUserStats = async (): Promise<UserStats> => {
  try {
    // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false)
        .neq('primary_role', 'platform_owner_root');

    // Get active users count
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false)
        .neq('primary_role', 'platform_owner_root')
        .eq('account_status', 'active');

    // Get inactive users count
      const { count: inactiveUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false)
        .neq('primary_role', 'platform_owner_root')
        .in('account_status', ['suspended', 'deactivated']);

    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      inactiveUsers: inactiveUsers || 0
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0
    };
  }
};

export function UserStatsCards() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedStatsType, setSelectedStatsType] = useState<'total' | 'active' | 'inactive' | null>(null);
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: fetchUserStats,
    staleTime: 60000 // 1 minute
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: AdminUsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: ActiveUsersIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Inactive Users',
      value: stats?.inactiveUsers || 0,
      icon: InactiveUsersIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const handleCardClick = (statsType: 'total' | 'active' | 'inactive') => {
    setSelectedStatsType(statsType);
    setPanelOpen(true);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
    setSelectedStatsType(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statCards.map((stat, index) => {
          let cardBgClass = '';
          let borderClass = '';
          let statsType: 'total' | 'active' | 'inactive' = 'total';
          
          if (stat.title === 'Total Users') {
            cardBgClass = 'bg-blue-50/50';
            borderClass = 'border-blue-200';
            statsType = 'total';
          } else if (stat.title === 'Active Users') {
            cardBgClass = 'bg-green-50/50';
            borderClass = 'border-green-200';
            statsType = 'active';
          } else if (stat.title === 'Inactive Users') {
            cardBgClass = 'bg-red-50/50';
            borderClass = 'border-red-200';
            statsType = 'inactive';
          }
          
          return (
            <div key={index} className={`${cardBgClass} p-6 rounded-lg shadow-sm ${borderClass} border-2 hover:shadow-lg transition-all duration-200 cursor-pointer group`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                </div>
                {stat.title === 'Total Users' || stat.title === 'Active Users' || stat.title === 'Inactive Users' ? (
                  <div className="p-1">
                    <stat.icon className="h-10 w-10" />
                  </div>
                ) : (
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCardClick(statsType)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 ${
                    stat.title === 'Total Users' ? 'bg-blue-100/80 hover:bg-blue-200/80 border-blue-300 text-blue-700 hover:text-blue-800' :
                    stat.title === 'Active Users' ? 'bg-green-100/80 hover:bg-green-200/80 border-green-300 text-green-700 hover:text-green-800' :
                    'bg-red-100/80 hover:bg-red-200/80 border-red-300 text-red-700 hover:text-red-800'
                  } border rounded-lg transition-all duration-200 text-sm font-medium group-hover:shadow-sm`}
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </button>
                <button className={`flex items-center justify-center py-2 px-3 ${
                  stat.title === 'Total Users' ? 'bg-blue-100/80 hover:bg-blue-200/80 border-blue-300 text-blue-600 hover:text-blue-700' :
                  stat.title === 'Active Users' ? 'bg-green-100/80 hover:bg-green-200/80 border-green-300 text-green-600 hover:text-green-700' :
                  'bg-red-100/80 hover:bg-red-200/80 border-red-300 text-red-600 hover:text-red-700'
                } border rounded-lg transition-all duration-200 text-sm group-hover:shadow-sm`}>
                  <CalendarStatsIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Panel */}
      <StatsPanel
        isOpen={panelOpen}
        onClose={handleClosePanel}
        statsType={selectedStatsType}
        data={stats}
      />
      
      {/* Overlay */}
      {panelOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleClosePanel}
        />
      )}
    </>
  );
}
