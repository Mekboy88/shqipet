
import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Users, CircleUserRound, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminContent: React.FC = () => {
  const { open } = useSidebar();
  
  // Sample statistics data
  const stats = [
    {
      title: "Total Users",
      value: "12,453",
      change: "+14%",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Verified Accounts",
      value: "8,721",
      change: "+7.2%",
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Pending Verifications",
      value: "1,324",
      change: "-2.1%",
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      color: "bg-amber-50 border-amber-200"
    },
    {
      title: "Messages Today",
      value: "4,128",
      change: "+32%",
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-50 border-purple-200"
    },
  ];
  
  const recentUsers = [
    { id: 1, name: "Arber Krasniqi", email: "arber@example.com", time: "2 minutes ago", status: "active" },
    { id: 2, name: "Elona Hoxha", email: "elona@example.com", time: "15 minutes ago", status: "active" },
    { id: 3, name: "Dritan Gashi", email: "dritan@example.com", time: "1 hour ago", status: "idle" },
    { id: 4, name: "Blerina Kelmendi", email: "blerina@example.com", time: "3 hours ago", status: "offline" },
    { id: 5, name: "Bujar Zeka", email: "bujar@example.com", time: "5 hours ago", status: "offline" },
  ];
  
  return (
    <main className="flex-1 p-6 transition-all duration-300" style={{ border: 'none' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the Shqipet admin dashboard.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className={`${stat.color} border shadow-sm`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium text-gray-700">{stat.title}</CardTitle>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Recent Active Users</CardTitle>
            <CardDescription>Latest user activity across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <CircleUserRound className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{user.time}</p>
                    <div className="flex items-center mt-1">
                      <div className={`h-2 w-2 rounded-full mr-1 
                        ${user.status === 'active' ? 'bg-green-500' : 
                          user.status === 'idle' ? 'bg-amber-500' : 'bg-gray-400'}`}>
                      </div>
                      <p className="text-xs text-gray-500 capitalize">{user.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50">
            <button className="text-sm text-blue-600 hover:underline">View all users</button>
          </CardFooter>
        </Card>
        
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Overview of platform performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>System Uptime</span>
                <span className="font-medium">99.98%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '99.98%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span>Database Status</span>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium">Healthy</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>API Response Time</span>
                <span className="font-medium">124ms</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Storage Usage</span>
                <span className="font-medium">43.2 GB / 100 GB</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '43.2%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Last Backup</span>
                <span className="font-medium">Today, 04:30 AM</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50">
            <button className="text-sm text-blue-600 hover:underline">View detailed reports</button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default AdminContent;
