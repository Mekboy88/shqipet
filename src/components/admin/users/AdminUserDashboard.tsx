import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Eye, Shield, ShieldOff, Check, X, Mail, Phone, User, ChevronDown, ChevronLeft, ChevronRight, Plus, Download, Upload, Filter, Calendar, Activity, Bell, Settings, Key, BarChart3, FileText, MessageSquare, Lock, Unlock, Clock, TrendingUp, Copy } from 'lucide-react';
import supabase from '@/lib/relaxedSupabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminUsers } from '@/lib/data/userOverview';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Avatar from '@/components/Avatar';
import UserDetailsModal from './UserDetailsModal';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Custom Users Group Icon Component
const UsersGroupIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512.001 512.001" xmlns="http://www.w3.org/2000/svg">
    <path fill="#515262" d="M151.428,29.77L151.428,29.77C84.304,29.77,29.89,84.184,29.89,151.308v55.301h243.075v-55.301 C272.965,84.184,218.551,29.77,151.428,29.77z"/>
    <path fill="#E6B696" d="M47.594,174.691c-16.485,0-29.848,13.364-29.848,29.848l0,0c0,16.485,13.363,29.848,29.848,29.848 h14.515v-59.697H47.594z"/>
    <path fill="#FF6465" d="M295.012,450.865c-15.956-39.37-47.633-70.687-87.247-86.164l-0.626-0.237H95.715 c-39.903,15.391-71.832,46.827-87.871,86.402H295.012z"/>
    <path fill="#E6B696" d="M183.017,357.364v-56.08h-63.18v56.08c-8.302,1.723-16.364,4.106-24.122,7.098 c6.736,24.452,29.118,42.418,55.712,42.418s48.976-17.966,55.712-42.418C199.381,361.47,191.319,359.088,183.017,357.364z"/>
    <path fill="#A5EB78" d="M216.99,450.865c15.956-39.37,47.633-70.687,87.247-86.164l0.626-0.237h111.423 c39.903,15.391,71.831,46.827,87.872,86.402H216.99z"/>
    <path fill="#E6B696" d="M328.984,357.364v-56.80h63.18v56.08c8.302,1.723,16.364,4.106,24.122,7.098 c-6.736,24.452-29.118,42.418-55.712,42.418s-48.976-17.966-55.711-42.418C312.621,361.47,320.682,359.088,328.984,357.364z"/>
    <path fill="#F0C5A6" d="M226.273,125.924c-10.334,0-18.711-8.377-18.711-18.711c0,10.334-8.377,18.711-18.711,18.711 c-10.334,0-18.711-8.377-18.711-18.711c0,10.334-8.377,18.711-18.711,18.711s-18.711-8.377-18.711-18.711 c0,10.334-8.377,18.711-18.711,18.711c-10.334,0-18.711-8.377-18.711-18.711c0,10.334-8.377,18.711-18.711,18.711 c-6.034,0-11.386-2.868-14.808-7.302c-9.065,14.642-14.303,31.903-14.303,50.39v52.392c0,57.412,46.543,103.954,103.955,103.954 s103.955-46.543,103.955-103.954v-52.392c0-18.486-5.238-35.747-14.303-50.39C237.659,123.055,232.307,125.924,226.273,125.924z"/>
    <path fill="#FFD782" d="M360.575,29.77L360.575,29.77c-67.124,0-121.537,54.414-121.537,121.537v55.301h243.075v-55.301 C482.112,84.184,427.697,29.77,360.575,29.77z"/>
    <path fill="#E6B696" d="M464.409,174.691c16.485,0,29.848,13.364,29.848,29.848l0,0c0,16.485-13.363,29.848-29.848,29.848 h-14.515v-59.697H464.409z"/>
    <path fill="#F0C5A6" d="M285.729,125.924c10.334,0,18.711-8.377,18.711-18.711c0,10.334,8.377,18.711,18.711,18.711 s18.711-8.377,18.711-18.711c0,10.334,8.377,18.711,18.711,18.711s18.711-8.377,18.711-18.711c0,10.334,8.377,18.711,18.711,18.711 s18.711-8.377,18.711-18.711c0,10.334,8.377,18.711,18.711,18.711c6.034,0,11.386-2.868,14.808-7.302 c9.064,14.642,14.302,31.903,14.302,50.39v52.392c0,57.412-46.542,103.954-103.955,103.954s-103.955-46.543-103.955-103.954v-52.392 c0-18.486,5.238-35.747,14.303-50.39C274.343,123.055,279.695,125.924,285.729,125.924z"/>
    <path fill="#5A4146" d="M256.001,61.142L256.001,61.142c-67.124,0-121.537,54.414-121.537,121.537v55.301h243.075V182.68 C377.539,115.556,323.125,61.142,256.001,61.142z"/>
    <g>
      <path fill="#E6B273" d="M152.167,206.063c-16.485,0-29.848,13.364-29.848,29.848l0,0c0,16.485,13.363,29.848,29.848,29.848 h14.515v-59.697H152.167z"/>
      <path fill="#E6B273" d="M359.835,206.063c16.485,0,29.848,13.364,29.848,29.848l0,0c0,16.485-13.363,29.848-29.848,29.848 H345.32v-59.697H359.835z"/>
    </g>
    <path fill="#6AB2CC" d="M399.586,482.237c-15.956-39.37-47.633-70.687-87.247-86.164l-0.626-0.237H200.29 c-39.903,15.391-71.832,46.827-87.872,86.402H399.586z"/>
    <path fill="#F0C087" d="M287.591,388.737v-56.08h-63.18v56.08c-8.302,1.723-16.364,4.106-24.122,7.098 c6.736,24.452,29.118,42.418,55.712,42.418c26.593,0,48.976-17.966,55.711-42.418C303.954,392.842,295.893,390.46,287.591,388.737z"/>
    <path fill="#F0C087" d="M330.846,157.296c-10.334,0-18.711-8.377-18.711-18.711c0,10.334-8.377,18.711-18.711,18.711 c-10.334,0-18.711-8.377-18.711-18.711c0,10.334-8.377,18.711-18.711,18.711c-10.334,0-18.711-8.377-18.711-18.711 c0,10.334-8.377,18.711-18.711,18.711c-10.334,0-18.711-8.377-18.711-18.711c0,10.334-8.377,18.711-18.711,18.711 c-6.034,0-11.386-2.868-14.808-7.302c-9.065,14.642-14.303,31.903-14.303,50.39v52.392c0,57.412,46.543,103.954,103.955,103.954 s103.955-46.542,103.955-103.954v-52.392c0-18.486-5.238-35.747-14.302-50.39C342.232,154.427,336.88,157.296,330.846,157.296z"/>
  </svg>
);

const AdminUserDashboard = () => {
  const { loading: authLoading } = useAuth();
  const { users: fetchedUsers, isLoading, error, refreshAdminUsers } = useAdminUsers();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const loading = isLoading || authLoading;
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('users');
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: 'user',
    account_status: 'active'
  });

  const [usersPerPage, setUsersPerPage] = useState(15);
  const [copiedField, setCopiedField] = useState<string>('');
  const [clickedField, setClickedField] = useState<string>('');
  const [tooltipKey, setTooltipKey] = useState(0);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Copy to clipboard function with enhanced animations  
  const copyToClipboard = async (text: string, fieldType: string, userId: string) => {
    const fieldKey = `${userId}-${fieldType}`;
    
    console.log('Copy clicked:', fieldKey, 'Current copied field:', copiedField);
    
    // Set clicked state immediately for animation
    setClickedField(fieldKey);
    
    try {
      await navigator.clipboard.writeText(text);
      
      console.log('Copy successful, setting copied field:', fieldKey);
      
      // Immediately show copied state and force tooltip refresh
      setCopiedField(fieldKey);
      setClickedField(''); // Clear click animation
      setTooltipKey(prev => {
        const newKey = prev + 1;
        console.log('Updating tooltip key to:', newKey);
        return newKey;
      });
      toast.success(`${fieldType} copied to clipboard!`);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        console.log('Resetting copied field for:', fieldKey);
        setCopiedField('');
        setTooltipKey(prev => prev + 1);
      }, 2000);
      
    } catch (error) {
      setClickedField('');
      toast.error('Failed to copy to clipboard');
    }
  };

  const toggleDropdown = (userId: string) => {
    setDropdownOpen(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const closeAllDropdowns = () => {
    setDropdownOpen({});
    setExportDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element)?.closest('.dropdown-container')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update users when users from hook changes
  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length > 0) {
      console.log('📊 [AdminUserDashboard] Users updated:', fetchedUsers.length);
      // Map UserOverview to UserProfile format
      setUsers(fetchedUsers.map(u => ({
        ...u,
        auth_user_id: u.user_id,
        account_status: u.status || 'active',
        avatar_url: u.profile_image_url,
      } as UserProfile)));
    } else if (!isLoading) {
      console.log('ℹ️ [AdminUserDashboard] No users to display');
      setUsers([]);
    }
  }, [fetchedUsers, isLoading]);

  // Activity data for charts
  const activityData = [
    { name: 'Jan', users: 4 },
    { name: 'Feb', users: 3 },
    { name: 'Mar', users: 2 },
    { name: 'Apr', users: 7 },
    { name: 'May', users: 1 },
    { name: 'Jun', users: 5 },
    { name: 'Jul', users: 8 },
    { name: 'Aug', users: 6 },
    { name: 'Sep', users: 9 }
  ];

  useEffect(() => {
    if (!users) return;
    
    let filtered = users.filter(user => {
      const displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Unknown User';
      const matchesSearch = displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.account_status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        const userDate = new Date(user.created_at || '');
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDate = userDate >= startDate && userDate <= endDate;
      }
      
      return matchesSearch && matchesStatus && matchesRole && matchesDate;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = (a as any)[sortField];
      let bVal = (b as any)[sortField];
      
      if (sortField === 'created_at' || sortField === 'last_login') {
        aVal = aVal ? new Date(aVal) : new Date(0);
        bVal = bVal ? new Date(bVal) : new Date(0);
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter, dateRange, users, sortField, sortDirection]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const openModal = (type: string, user: UserProfile | null = null) => {
    setModalType(type);
    setSelectedUser(user);
    setShowModal(true);
    if (type === 'edit' && user) {
      setEditData({...user});
    }
    if (type === 'add') {
      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        role: 'user',
        account_status: 'active'
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedUser(null);
    setEditData({});
    setNewUser({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      role: 'user',
      account_status: 'active'
    });
  };

  const addUser = async () => {
    toast.info('User creation requires proper authentication setup');
    closeModal();
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const newStatus = user.account_status === 'active' ? 'suspended' : 'active';
      
      // Use profile_id for database operations (profiles table primary key)
       const { error } = await supabase
         .from('profiles')
         .update({ account_status: newStatus })
         .eq('id', userId);
        
      if (error) throw error;
      
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
      refreshAdminUsers(); // Refresh the data
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const toggle2FA = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      // Use id to find the right profile record
       const { error } = await supabase
         .from('profiles')
         .update({ two_factor_enabled: !user.two_factor_enabled })
         .eq('id', userId);
        
      if (error) throw error;
      
      toast.success(`2FA ${user.two_factor_enabled ? 'disabled' : 'enabled'}`);
      refreshAdminUsers(); // Refresh the data
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      toast.error('Failed to toggle 2FA');
    }
  };

  const deleteUser = async () => {
    if (selectedUser) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', selectedUser.id);
          
        if (error) throw error;
        
        toast.success('User deleted successfully');
        closeModal();
        await refreshAdminUsers(); // Smooth refresh without page reload
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const updateUser = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(editData)
        .eq('id', editData.id);
        
      if (error) throw error;
      
      toast.success('User updated successfully');
      closeModal();
      await refreshAdminUsers(); // Smooth refresh without page reload
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user.id));
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Role', 'Created', 'Last Login'],
      ...users.map(user => [
        `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Unknown',
        user.email || '',
        user.phone_number || '',
        user.account_status || 'unknown',
        user.role || 'user',
        user.created_at || '',
        user.last_login || 'Never'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    setExportDropdownOpen(false);
  };

  const exportToJSON = () => {
    const jsonData = users.map(user => ({
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Unknown',
      email: user.email || '',
      phone: user.phone_number || '',
      status: user.account_status || 'unknown',
      role: user.role || 'user',
      created: user.created_at || '',
      last_login: user.last_login || 'Never'
    }));

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.json';
    a.click();
    setExportDropdownOpen(false);
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Role', 'Created', 'Last Login'],
      ...users.map(user => [
        `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Unknown',
        user.email || '',
        user.phone_number || '',
        user.account_status || 'unknown',
        user.role || 'user',
        user.created_at || '',
        user.last_login || 'Never'
      ])
    ].map(row => row.join('\t')).join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.xls';
    a.click();
    setExportDropdownOpen(false);
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(16);
    pdf.text('Users Report', 14, 22);
    
    // Prepare table data
    const headers = [['Name', 'Email', 'Phone', 'Status', 'Role', 'Created', 'Last Login']];
    const data = users.map(user => [
      `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Unknown',
      user.email || '',
      user.phone_number || '',
      user.account_status || 'unknown',
      user.role || 'user',
      user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
      user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'
    ]);
    
    // Add table
    (pdf as any).autoTable({
      head: headers,
      body: data,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 25 }, // Name
        1: { cellWidth: 35 }, // Email
        2: { cellWidth: 25 }, // Phone
        3: { cellWidth: 20 }, // Status
        4: { cellWidth: 20 }, // Role
        5: { cellWidth: 25 }, // Created
        6: { cellWidth: 25 }  // Last Login
      }
    });
    
    pdf.save('users.pdf');
    setExportDropdownOpen(false);
  };

  // Bulk Actions Functions
  const bulkDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .in('id', selectedUsers);
        
      if (error) throw error;
      
      toast.success(`Successfully deleted ${selectedUsers.length} users`);
      setSelectedUsers([]);
      refreshAdminUsers();
    } catch (error) {
      console.error('Error deleting users:', error);
      toast.error('Failed to delete users');
    }
  };

  const bulkChangeStatus = async (newStatus: string) => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ account_status: newStatus })
        .in('id', selectedUsers);
        
      if (error) throw error;
      
      toast.success(`Successfully ${newStatus === 'active' ? 'activated' : 'suspended'} ${selectedUsers.length} users`);
      setSelectedUsers([]);
      refreshAdminUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const bulkChangeRole = async (newRole: string) => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }
    
    try {
      // Delete existing roles
      await supabase
        .from('user_roles')
        .delete()
        .in('user_id', selectedUsers);
      
      // Insert new roles one by one
      for (const userId of selectedUsers) {
        await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: newRole as 'user' | 'moderator' | 'admin' | 'super_admin',
            granted_by: (await supabase.auth.getUser()).data.user?.id,
            granted_at: new Date().toISOString()
          });
      }
      
      toast.success(`Successfully changed role to ${newRole} for ${selectedUsers.length} users`);
      setSelectedUsers([]);
      refreshAdminUsers();
    } catch (error) {
      console.error('Error updating user roles:', error);
      toast.error('Failed to update user roles');
    }
  };

  const bulkEmailUsers = () => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }
    
    const selectedUserEmails = users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.email)
      .filter(Boolean);
    
    if (selectedUserEmails.length === 0) {
      toast.error('No email addresses found for selected users');
      return;
    }
    
    toast.info(`Email functionality requires edge function setup. ${selectedUserEmails.length} users selected with emails.`);
    console.log('Selected user emails:', selectedUserEmails);
  };

  const exportSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }
    
    const selectedUserData = users.filter(user => selectedUsers.includes(user.id));
    
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Role', 'Created', 'Last Login'],
      ...selectedUserData.map(user => [
        `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Unknown',
        user.email || '',
        user.phone_number || '',
        user.account_status || 'unknown',
        user.role || 'user',
        user.created_at || '',
        user.last_login || 'Never'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected_users_${selectedUsers.length}.csv`;
    a.click();
    
    toast.success(`Exported ${selectedUsers.length} selected users`);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || colors.user;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || colors.pending;
  };

  const TabButton = ({ tabKey, icon: Icon, label, count }: { tabKey: string; icon: any; label: string; count?: number }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeTab === tabKey
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          activeTab === tabKey ? 'bg-blue-500' : 'bg-gray-200'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  // Show loading only if auth is loaded but data is still loading
  // If auth is still loading, don't show our loading state (CentralizedAuthGuard handles it)
  if (loading && !authLoading) {
    console.log('🔍 [AdminUserDashboard] Showing component loading (auth loaded, data loading)');
    return (
      <div className="bg-gray-50 min-h-screen w-full overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Users...</h2>
          <p className="text-gray-600">Please wait while we fetch the user data.</p>
        </div>
      </div>
    );
  }

  // If auth is still loading, show minimal content (CentralizedAuthGuard skeleton is handling loading)
  if (authLoading) {
    console.log('🔍 [AdminUserDashboard] Auth loading - returning null (skeleton shown by CentralizedAuthGuard)');
    return null;
  }

  console.log('🔍 [AdminUserDashboard] Rendering main content - auth loaded:', !authLoading, 'data loaded:', !loading);

  return (
    <div className="bg-gray-50 min-h-screen w-full overflow-y-auto">
      <div className="w-full mx-auto px-4 py-8 pb-32 min-h-screen">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Table</h1>
          <p className="text-gray-600">Comprehensive user management and analytics</p>
        </div>

        {/* NAVIGATION TABS */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-1">
            <TabButton tabKey="users" icon={User} label="Users" count={users.length} />
            <TabButton tabKey="analytics" icon={BarChart3} label="Analytics" />
            <TabButton tabKey="activity" icon={Activity} label="Activity" />
            <TabButton tabKey="reports" icon={FileText} label="Reports" />
          </div>
        </div>

        {activeTab === 'users' && (
          <>
            {/* STATISTICS CARDS */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <UsersGroupIcon className="h-12 w-12 text-gray-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <svg className="h-12 w-12" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path style={{fill:"#EA533B"}} d="M403.51,247.992c12.189-23.721,13.499-45.899,3.546-63.137 c-10.316-17.868-31.605-28.033-59.944-28.622c-20.81-0.427-44.439,4.311-68.131,13.528c8.166-27.851,5.532-49.961-7.876-63.369 c-16.113-16.113-44.899-16.666-81.056-1.558c-33.715,14.088-70.764,40.33-104.325,73.889 c-49.982,49.983-83.19,107.958-84.779,147.93C0.318,330.616,0,334.579,0,338.441c0,35.793,25.09,69.017,70.648,93.547 c43.858,23.617,101.979,36.622,163.656,36.622s119.798-13.005,163.656-36.622c45.558-24.53,70.648-57.754,70.648-93.547 C468.609,304.067,445.576,272.184,403.51,247.992z"/>
                    <path style={{fill:"#D93C1C"}} d="M260.338,459.932c-61.677,0-119.798-13.005-163.656-36.622 c-45.558-24.53-70.648-57.754-70.648-93.547c0-3.863,0.318-7.825,0.945-11.787c1.589-39.973,34.797-97.947,84.78-147.93 c33.227-33.226,69.87-59.27,103.314-73.458c-7.854,1.823-16.218,4.566-25.023,8.245c-33.715,14.088-70.764,40.33-104.325,73.889 C35.742,228.707,2.534,286.682,0.945,326.654C0.318,330.616,0,334.579,0,338.441c0,35.793,25.09,69.017,70.648,93.547 c43.858,23.617,101.979,36.622,163.656,36.622c48.616,0,95.016-8.086,133.969-23.074 C335.352,454.941,298.529,459.932,260.338,459.932z"/>
                    <path style={{fill:"#FFFFFF"}} d="M364.19,312.032c-2.568-29.565-22.081-55.61-54.944-73.338 c-31.681-17.091-72.302-24.49-114.382-20.835c-42.079,3.656-80.818,17.949-109.076,40.247 c-29.314,23.131-44.045,52.151-41.476,81.715c2.569,29.565,22.082,55.61,54.946,73.338c26.389,14.236,58.976,21.748,93.447,21.747 c6.913,0,13.905-0.302,20.934-0.913c42.079-3.654,80.817-17.948,109.075-40.246C352.029,370.616,366.758,341.596,364.19,312.032z"/>
                    <path style={{fill:"#E5E5E5"}} d="M230.36,425.319c-7.029,0.611-14.021,0.913-20.934,0.913c-34.471,0.001-67.059-7.511-93.447-21.747 c-32.863-17.729-52.378-43.774-54.946-73.338c-2.569-29.564,12.161-58.584,41.476-81.715c5.799-4.575,12.046-8.808,18.665-12.687 c-12.993,5.932-24.911,13.095-35.388,21.361c-29.314,23.131-44.045,52.151-41.476,81.715c2.569,29.565,22.082,55.61,54.946,73.338 c26.389,14.236,58.976,21.748,93.447,21.747c6.913,0,13.905-0.302,20.934-0.913c33.445-2.905,64.771-12.535,90.41-27.559 C281.994,416.503,256.841,423.019,230.36,425.319z"/>
                    <path style={{fill:"#333333"}} d="M286.65,312.533c-9.507-39.544-55.55-62.508-102.638-51.189 c-47.088,11.32-77.661,52.703-68.156,92.249c4.682,19.473,18.156,35.492,37.943,45.105c12.283,5.967,26.102,9.003,40.355,9.003 c8.042,0,16.221-0.967,24.339-2.918C265.582,393.462,296.157,352.08,286.65,312.533z"/>
                    <circle style={{fill:"#FFFFFF"}} cx="177.898" cy="351.457" r="30.373"/>
                    <path style={{fill:"#FFA929"}} d="M373.152,117.153c-7.189,0-13.017,5.828-13.017,13.017c0,7.189,5.828,13.017,13.017,13.017 c26.318,0,47.729,21.411,47.729,47.729c0,7.189,5.828,13.017,13.017,13.017s13.017-5.828,13.017-13.017 C446.914,150.243,413.824,117.153,373.152,117.153z"/>
                    <path style={{fill:"#FFA929"}} d="M364.475,43.39c-3.261,0-6.564,0.108-9.817,0.322c-9.564,0.629-16.808,8.893-16.18,18.458 c0.629,9.564,8.9,16.804,18.458,16.18c2.498-0.164,5.035-0.248,7.539-0.248c62.206,0,112.813,50.608,112.813,112.813 c0,7.606-0.759,15.204-2.257,22.581c-1.396,6.875,1.691,14.209,7.576,18.025c5.99,3.884,14.111,3.587,19.829-0.675 c3.388-2.525,5.774-6.307,6.614-10.445c1.958-9.646,2.95-19.566,2.95-29.487C512,109.571,445.82,43.39,364.475,43.39z"/>
                    <circle style={{fill:"#FFFFFF"}} cx="234.305" cy="321.085" r="17.356"/>
                  </svg>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.account_status === 'active').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <svg className="h-12 w-12" viewBox="0 0 366.34 366.34" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="linear-gradient" x1="69.93" y1="295.83" x2="296.41" y2="295.83" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#16243f"/>
                        <stop offset="1" stopColor="#6878b1"/>
                      </linearGradient>
                    </defs>
                    <path style={{fill:"#f2a196"}} d="M296.41,291.18a184.56,184.56,0,0,1-226.48-1l48.66-22.81a46.83,46.83,0,0,0,6.65-3.82c.64-.44,1.28-.9,1.89-1.38a46.35,46.35,0,0,0,12.78-15.09,44.69,44.69,0,0,0,4.64-14.48,67.91,67.91,0,0,0,.74-9.91c0-3.46-.09-6.92-.21-10.38-.07-2.26-.13-4.53-.16-6.79q-.06-4.75-.1-9.51l2,1,5.2,2.69,2.41.41,27.88,4.74,31.12,5.3.94,32,.31,10.46.15,5.08V258l1,.42,11.07,4.5Z"/>
                    <path style={{fill:"#e88870"}} d="M214.82,258a16,16,0,0,1-10.07-1.56l-59.67-48.77c-.07-2.26-.13.1-.16-2.16q-.06-4.75-.1-9.51l2,1,5.2,2.69,2.41.41,27.88,4.74,31.12,5.3.94,32,.31,10.46.15,5.08V258Z"/>
                    <path style={{fill:"url(#linear-gradient)"}} d="M296.41,291.18a184.56,184.56,0,0,1-226.48-1l48.66-22.81a46.83,46.83,0,0,0,6.65-3.82c.64-.44,1.28-.9,1.89-1.38,23.55,16.76,55.69,27.33,83.49,14.82,6.62-3,12.7-7.84,16.3-14.06Z"/>
                    <path style={{fill:"#845161"}} d="M278.51,90.9c-.09.59-.2,1.17-.33,1.75a32.08,32.08,0,0,1-3.31,8.49l-.08.14c-.57,1-1.18,2-1.84,3a74.32,74.32,0,0,1-5.72,7.35L266,113c-.83.93-1.67,1.84-2.51,2.74,4.45-1,8.76,3.15,9.55,7.63s-1,9-3.21,13c-3.87,7.08-9.45,11.79-14.36,17.94-3.68,4.58-5.72,10-9.73,14.38l-.3.33c-10.59,11.12-27.31,13.72-41.23,18.47-5,1.72-59.22,17.12-59.22,20.48,0-.73-5.31-6-12-12.41-24-22.79-31.89-58-17.61-88.2,15.35-32.5,50.21-55.69,83.41-66.83,10.38-3.48,22.16-5.82,32-1s14.74,19.77,6.58,27.07a26.16,26.16,0,0,1,17.93-5.21,24.46,24.46,0,0,1,15.72,7.07,27,27,0,0,1,6.95,12.08A24.94,24.94,0,0,1,278.51,90.9Z"/>
                    <path style={{fill:"#69303a"}} d="M278.51,90.9c-.09.59-.2,1.17-.33,1.75-.09.17-.18.35-.27.55-1.13,2.58-1.65,5.36-3,7.94l-.08.14c-.57,1-1.18,2-1.84,3a67.09,67.09,0,0,1-5.72,7.35L266,113c-.83.93-1.67,1.84-2.51,2.74,4.45-1,8.76,3.15,9.55,7.63s-1,9-3.21,13c-3.87,7.08-9.45,11.79-14.36,17.94-3.68,4.58-5.72,10-9.73,14.38a37.7,37.7,0,0,1-8.54-19.47c-1.64-13.26-.64-27.71-1.09-41.13-.28-8.44-3-10,2.06-16.83a74.3,74.3,0,0,1,14-13.29c4.08-2.69,9.33-3.11,14.2-2.42a23.5,23.5,0,0,1,11.58,5A24.94,24.94,0,0,1,278.51,90.9Z"/>
                    <circle style={{fill:"#f2a196"}} cx="134.98" cy="168" r="17"/>
                    <circle style={{fill:"#e88870"}} cx="140.37" cy="168" r="15.22"/>
                    <path style={{fill:"#f2a196"}} d="M140.6,152,145,209l66.44,38.82A19.77,19.77,0,0,0,236.1,238c9.56-19.58,24.9-50.5,22.88-62-3-17-11-23-11-23q1.67-10,3.32-19.94c1.26-7.51,2.87-15.35,1-22.9-2.13-8.66-8.67-12.35-14.05-18.82-14.16,18.24-37.44,28.55-57.77,39C170,135.78,140.6,152,140.6,152Z"/>
                    <path style={{fill:"#00214e"}} d="M189.72,149.8c6.1,0,6.1,9.38,0,9.43h-.28c-6.1,0-6.1-9.38,0-9.43h.28Z"/>
                    <path style={{fill:"#00214e"}} d="M239.84,148.41c5.67.05,5.67,8.7,0,8.75h-.25c-5.66,0-5.66-8.7,0-8.75h.25Z"/>
                    <path style={{fill:"none",stroke:"#00214e",strokeMiterlimit:"10"}} d="M215.13,147.09c-.08.35,13.36,36.13,13.36,36.13l-17.94.87"/>
                    <path style={{fill:"none",stroke:"#00214e",strokeMiterlimit:"10"}} d="M172.65,140.17a80.57,80.57,0,0,1,28.13-.79"/>
                    <path style={{fill:"none",stroke:"#00214e",strokeMiterlimit:"10"}} d="M231.7,140.28a55.34,55.34,0,0,1,17.45-1.21"/>
                    <path style={{fill:"#ffffff"}} d="M192.17,194.1a1.85,1.85,0,0,1,2.68-.5c2.08,1.46,5.88,4.56,11.28,5.63,7.36,1.47,13.74-1.48,15.27.42.86,1.07-.19,2.37-2.2,4a19.74,19.74,0,0,1-14.86,3.69c-7.08-1.33-12.4-9.53-12.4-12.44A1.66,1.66,0,0,1,192.17,194.1Z"/>
                  </svg>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Male Users</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.floor(users.length * 0.6)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <svg className="h-12 w-12" viewBox="0 0 366.34 366.34" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="linear-gradient-female" x1="135.61" y1="137.64" x2="164.83" y2="68.33" gradientUnits="userSpaceOnUse">
                        <stop offset="0.29" stopColor="#00214e"/>
                        <stop offset="0.51" stopColor="#6878b1"/>
                        <stop offset="0.79" stopColor="#00214e"/>
                      </linearGradient>
                    </defs>
                    <path style={{fill:"#00214e"}} d="M244.67,107.86c-4.24-19.92-6-35.11-23.19-47.8-13.73-10.12-31.27-15.53-48.34-14.18-14.48,1.15-32.65,6.3-46.87,15A58.94,58.94,0,0,0,110.06,75c-6.31,8.32-10.83,18.44-14.27,29.18-5.18,16.15-8,33.72-10.79,48.71C80.15,178.4,75.81,204,71.46,229.6c29.94,3,186.24,2.11,186.24,2.11S254.12,152.15,244.67,107.86ZM170.5,128.3l-16.8-5.43,50.66-19,3.71,2.06Z"/>
                    <path style={{fill:"#f2d4cf"}} d="M296.41,282.34a184.56,184.56,0,0,1-226.48-1l48.66-22.81a47.68,47.68,0,0,0,4.35-2.34l1.12-.7c.4-.25.79-.51,1.18-.78a46.54,46.54,0,0,0,14.67-16.47c4-7.55,5.32-15.89,5.38-24.39,0-5.72-.31-11.44-.37-17.17q-.06-4.75-.1-9.51l2,1,5.2,2.69L182.29,196l31.12,5.3.94,32,.47,15.87,11.47,4.67,9,3.64Z"/>
                    <path style={{fill:"#daaea8"}} d="M214.16,229.6c-2.72,1.68-5.29,2.47-7.54,2.23-14.79-1.59-43.64-13.18-61.8-34.63q0-1.57-.06-3.15-.06-4.76-.1-9.51l2,1,5.2,2.69,30.29,5.15,31.12,5.3Z"/>
                    <path style={{fill:"#ff2609"}} d="M296.41,282.34a184.56,184.56,0,0,1-226.48-1l48.66-22.81q2.25-1.06,4.35-2.33c23.68,17.41,56.64,28.74,85.06,15.95,8.06-3.62,15.33-10.05,18.29-18.31l9,3.64Z"/>
                    <circle style={{fill:"#f2d4cf"}} cx="118.14" cy="153.89" r="17"/>
                    <circle style={{fill:"#daaea8"}} cx="124.14" cy="151.89" r="17"/>
                    <path style={{fill:"#f2d4cf"}} d="M233.68,128.14c11.74,40.69-13.2,89.88-28.54,89.88-21,0-72-16.78-83.73-57.47s3.87-80.92,34.87-89.87S221.93,87.46,233.68,128.14Z"/>
                    <path style={{fill:"none",stroke:"#00214e",strokeMiterlimit:"10"}} d="M202.93,124.13A31.08,31.08,0,0,1,225.78,122"/>
                    <path style={{fill:"none",stroke:"#00214e",strokeMiterlimit:"10"}} d="M154.05,126.42a36.76,36.76,0,0,1,31.23-1"/>
                    <ellipse style={{fill:"#00214e"}} cx="167.28" cy="139.45" rx="3.27" ry="7.94" transform="translate(15.86 295.97) rotate(-85.77)"/>
                    <ellipse style={{fill:"#00214e"}} cx="218.77" cy="137.8" rx="7.94" ry="3.27" transform="translate(-25.74 53.74) rotate(-13.23)"/>
                    <path style={{fill:"none",stroke:"#00214e",strokeMiterlimit:"10"}} d="M203.73,148.49s.29,5.65,1.62,8.3c.57,1.14,1.45,2.11,2,3.24,2.21,4.34-1.37,5.25-4.81,5.25"/>
                    <path style={{fill:"none",stroke:"#00214e",strokeMiterlimit:"10"}} d="M189.81,158.37a3.4,3.4,0,0,0,2.11,6.38"/>
                    <path style={{fill:"#ffffff"}} d="M171.83,173.88a1.87,1.87,0,0,1,2.69-.5c2.07,1.46,5.87,4.56,11.27,5.63,7.36,1.47,13.75-1.48,15.27.42.86,1.07-.19,2.38-2.2,4A19.68,19.68,0,0,1,184,187.17c-7.09-1.33-12.4-9.53-12.4-12.43A1.69,1.69,0,0,1,171.83,173.88Z"/>
                    <polygon style={{fill:"#00214e"}} points="226.5 95.61 204.36 103.9 153.7 122.87 153.69 122.87 115.86 137.04 115.28 110.47 114.5 74.61 137.99 67.29 175.5 55.61 226.5 95.61"/>
                    <path style={{fill:"url(#linear-gradient-female)"}} d="M204.36,103.9l-50.66,19h0l-38.41-12.4-19.49-6.29c3.44-10.74,8-20.86,14.27-29.18a58.94,58.94,0,0,1,16.21-14.09c3.5,1.89,7.47,4,11.72,6.38C161.45,80.11,193.57,97.91,204.36,103.9Z"/>
                  </svg>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Female Users</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.ceil(users.length * 0.4)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FILTERS AND SEARCH */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[250px]"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                    >
                      <Download size={16} />
                      <span>Export</span>
                      <ChevronDown size={16} className={`transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {exportDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        <ul className="py-2">
                          <li>
                            <button
                              onClick={exportToCSV}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText size={16} />
                                <span>Export as CSV</span>
                              </div>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={exportToExcel}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText size={16} />
                                <span>Export as Excel</span>
                              </div>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={exportToJSON}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText size={16} />
                                <span>Export as JSON</span>
                              </div>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={exportToPDF}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText size={16} />
                                <span>Export as PDF</span>
                              </div>
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* BULK ACTIONS BAR */}
            {selectedUsers.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-800 font-medium">
                      {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={() => setSelectedUsers([])}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Clear selection
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Export Selected */}
                    <button
                      onClick={exportSelectedUsers}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      <Download size={14} />
                      <span>Export Selected</span>
                    </button>
                    
                    {/* Status Change */}
                    <button
                      onClick={() => bulkChangeStatus('active')}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      <Check size={14} />
                      <span>Activate</span>
                    </button>
                    
                    <button
                      onClick={() => bulkChangeStatus('suspended')}
                      className="flex items-center space-x-1 px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
                    >
                      <X size={14} />
                      <span>Suspend</span>
                    </button>
                    
                    {/* Role Change Dropdown */}
                    <div className="relative">
                      <select
                        onChange={(e) => e.target.value && bulkChangeRole(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white"
                        defaultValue=""
                      >
                        <option value="" disabled>Change Role</option>
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                    
                    {/* Email Action */}
                    <button
                      onClick={bulkEmailUsers}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Mail size={14} />
                      <span>Email Users</span>
                    </button>
                    
                    {/* Delete */}
                    <button
                      onClick={bulkDeleteUsers}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* USERS TABLE */}
            <div className="bg-white rounded-lg shadow-sm border-2 border-gray-300 overflow-hidden" style={{ minHeight: '400px', resize: 'vertical', overflow: 'auto' }}>
              <TooltipProvider delayDuration={0}>
              <div className="w-full border-b border-gray-200">
                <table className="w-full table-fixed divide-y-2 divide-gray-300 border-collapse">
                  <thead className="bg-gray-50 border-b-2 border-gray-300">
                    <tr>
                      <th className="w-12 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </th>
                      <th 
                        className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 border-r border-gray-300"
                        onClick={() => handleSort('first_name')}
                      >
                        User
                      </th>
                      <th 
                        className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 border-r border-gray-300"
                        onClick={() => handleSort('email')}
                      >
                        Email
                      </th>
                      <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                        Phone
                      </th>
                      <th className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                        Verification
                      </th>
                      <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                        Status
                      </th>
                      <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                        Role
                      </th>
                      <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                        2FA
                      </th>
                      <th 
                        className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 border-r border-gray-300"
                        onClick={() => handleSort('created_at')}
                      >
                        Joined
                      </th>
                      <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y-2 divide-gray-200">
                    {currentUsers.map((user) => {
                      const displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Unknown User';
                      return (
                        <tr key={user.id} className="hover:bg-gray-50 border-b border-gray-200">
                          <td className="px-2 py-3 whitespace-nowrap border-r border-gray-300">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleSelectUser(user.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-3 py-3 border-r border-gray-300">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <Avatar 
                                  userId={user.id}
                                  size="sm"
                                  className="h-8 w-8"
                                  isOwnProfile={false}
                                  src={(user.avatar_url as string) || user.profile_image_url || user.profile_photo_url || null}
                                />
                              </div>
                              <div className="ml-2">
                                <div className="relative group">
                                  <div 
                                    className={`text-sm font-medium text-gray-900 truncate cursor-pointer transition-all duration-300 ease-out ${
                                      copiedField === `${user.id}-Name` ? 'text-green-600 transform scale-105' : 
                                      clickedField === `${user.id}-Name` ? 'text-blue-600 transform scale-102' :
                                      'hover:text-blue-600'
                                    }`}
                                    onClick={() => copyToClipboard(displayName, 'Name', user.id)}
                                  >
                                    {displayName}
                                  </div>
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                    {copiedField === `${user.id}-Name` ? 'Copied' : 'Copy'}
                                  </div>
                                </div>
                                <div className="relative group">
                                  <div 
                                    className={`text-xs text-gray-500 truncate cursor-pointer transition-all duration-300 ease-out ${
                                      copiedField === `${user.id}-ID` ? 'text-green-600 transform scale-105' : 
                                      clickedField === `${user.id}-ID` ? 'text-blue-600 transform scale-102' :
                                      'hover:text-blue-600'
                                    }`}
                                    onClick={() => copyToClipboard(user.id, 'ID', user.id)}
                                  >
                                    ID: {user.id.substring(0, 8)}...
                                  </div>
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                    {copiedField === `${user.id}-ID` ? 'Copied' : 'Copy'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 border-r border-gray-300">
                            <div className="relative group">
                              <div 
                                className={`text-sm text-gray-900 truncate cursor-pointer transition-all duration-300 ease-out ${
                                  copiedField === `${user.id}-Email` ? 'text-green-600 transform scale-105' : 
                                  clickedField === `${user.id}-Email` ? 'text-blue-600 transform scale-102' :
                                  'hover:text-blue-600'
                                }`}
                                onClick={() => copyToClipboard(user.email || 'N/A', 'Email', user.id)}
                              >
                                {user.email || 'N/A'}
                              </div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                {copiedField === `${user.id}-Email` ? 'Copied' : 'Copy'}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 border-r border-gray-300">
                            <div className="relative group">
                              <div 
                                className={`text-sm text-gray-900 truncate cursor-pointer transition-all duration-300 ease-out ${
                                  copiedField === `${user.id}-Phone` ? 'text-green-600 transform scale-105' : 
                                  clickedField === `${user.id}-Phone` ? 'text-blue-600 transform scale-102' :
                                  'hover:text-blue-600'
                                }`}
                                onClick={() => copyToClipboard(user.phone_number || 'N/A', 'Phone', user.id)}
                              >
                                {user.phone_number || 'N/A'}
                              </div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                {copiedField === `${user.id}-Phone` ? 'Copied' : 'Copy'}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 border-r border-gray-300">
                            <div className="flex space-x-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                user.email_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                <Mail className="w-3 h-3 mr-1" />
                                {user.email_verified ? 'E✓' : 'E✗'}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                user.phone_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone_verified ? 'P✓' : 'P✗'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-3 border-r border-gray-300">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.account_status || 'unknown')}`}>
                              {user.account_status || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-3 py-3 border-r border-gray-300">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getRoleColor(user.role || 'user')}`}>
                              {user.role === 'platform_owner_root' ? 'Platform Owner' :
                               user.role === 'super_admin' ? 'Super Admin' : 
                               user.role === 'admin' ? 'Admin' :
                               user.role === 'moderator' ? 'Moderator' :
                               user.role === 'user' ? 'User' : 
                               (user.role || 'User')}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-900 border-r border-gray-300">
                            <div className="flex justify-center">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                  user.two_factor_enabled 
                                    ? 'bg-green-50 text-green-600' 
                                    : 'bg-red-50 text-red-600'
                                }`}
                              >
                                {user.two_factor_enabled ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
                                {user.two_factor_enabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-300">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-3 py-3 text-sm font-medium">
                            <div className="relative dropdown-container">
                              <button
                                onClick={() => toggleDropdown(user.id)}
                                className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Action
                                <ChevronDown className="h-4 w-4 ml-1" />
                              </button>
                              {dropdownOpen[user.id] && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                                  {/* Mini Header with User Info */}
                                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                       <div className="flex-shrink-0">
                                          <Avatar 
                                            userId={user.id}
                                            size="sm"
                                            className="h-8 w-8"
                                          />
                                       </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Unknown User'}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                          {user.email || 'No email'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Menu Items */}
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        setShowUserDetailsModal(true);
                                        toggleDropdown(user.id);
                                      }}
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      <Eye className="mr-3 h-4 w-4" />
                                      View Details
                                    </button>
                                    <button
                                      onClick={() => {
                                        openModal('edit', user);
                                        toggleDropdown(user.id);
                                      }}
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      <Edit className="mr-3 h-4 w-4" />
                                      Edit User
                                    </button>
                                    <button
                                      onClick={() => {
                                        toggleUserStatus(user.id);
                                        toggleDropdown(user.id);
                                      }}
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      {user.account_status === 'active' ? <ShieldOff className="mr-3 h-4 w-4" /> : <Shield className="mr-3 h-4 w-4" />}
                                      {user.account_status === 'active' ? 'Suspend User' : 'Activate User'}
                                    </button>
                                    <button
                                      onClick={() => {
                                        openModal('delete', user);
                                        toggleDropdown(user.id);
                                      }}
                                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                      <Trash2 className="mr-3 h-4 w-4" />
                                      Delete User
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              </TooltipProvider>
            </div>

            {/* ADVANCED PAGINATION - Always visible at bottom */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left side - Items info */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700">
                    Showing {Math.min(filteredUsers.length, (currentPage - 1) * usersPerPage + 1)} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Per page:</label>
                    <select
                      value={usersPerPage}
                      onChange={(e) => {
                        setUsersPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                {/* Center - Page info */}
                <div className="text-sm font-medium text-gray-900">
                  Page {currentPage.toLocaleString()} of 100,000,000
                </div>

                {/* Right side - Navigation controls */}
                <div className="flex items-center gap-2">
                  {/* First */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  
                  {/* Previous */}
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page numbers with smart ellipsis */}
                  <div className="flex items-center gap-1">
                    {/* Show first page */}
                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => setCurrentPage(1)}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                        >
                          1
                        </button>
                        {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                      </>
                    )}

                    {/* Show pages around current */}
                    {Array.from({ length: 5 }, (_, i) => {
                      const page = currentPage - 2 + i;
                      if (page < 1 || page > 100000000) return null;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm border rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page.toLocaleString()}
                        </button>
                      );
                    })}

                    {/* Show last pages */}
                    {currentPage < 99999998 && (
                      <>
                        {currentPage < 99999997 && <span className="px-2 text-gray-500">...</span>}
                        <button
                          onClick={() => setCurrentPage(100000000)}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                        >
                          100,000,000
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage(Math.min(100000000, currentPage + 1))}
                    disabled={currentPage === 100000000}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  
                  {/* Last */}
                  <button
                    onClick={() => setCurrentPage(100000000)}
                    disabled={currentPage === 100000000}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>

                  {/* Jump to page */}
                  <div className="flex items-center gap-2 ml-4 border-l border-gray-200 pl-4">
                    <label className="text-sm text-gray-700">Go to:</label>
                    <input
                      type="number"
                      min="1"
                      max="100000000"
                      placeholder="Page"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const page = parseInt(e.currentTarget.value);
                          if (page >= 1 && page <= 100000000) {
                            setCurrentPage(page);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* User Details Modal */}
        <UserDetailsModal 
          isOpen={showUserDetailsModal}
          onClose={() => setShowUserDetailsModal(false)}
        />

        {/* MODALS */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {modalType === 'add' && 'Add New User'}
                  {modalType === 'edit' && 'Edit User'}
                  {modalType === 'view' && 'User Details'}
                  {modalType === 'delete' && 'Delete User'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {modalType === 'add' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={newUser.first_name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={newUser.last_name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newUser.phone_number}
                      onChange={(e) => setNewUser(prev => ({ ...prev, phone_number: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addUser}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Add User
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'delete' && selectedUser && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to delete user "{`${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() || selectedUser.username || 'Unknown User'}"? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={deleteUser}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'view' && selectedUser && (
                <div className="space-y-3">
                  <div className="text-center mb-4">
                    <img 
                      className="h-20 w-20 rounded-full mx-auto mb-2 object-cover" 
                      src={selectedUser.profile_image_url || selectedUser.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() || selectedUser.username || 'Unknown User')}&background=3b82f6&color=fff`} 
                      alt="User avatar"
                    />
                    <h4 className="text-lg font-medium">{`${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() || selectedUser.username || 'Unknown User'}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{selectedUser.email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-600">{selectedUser.phone_number || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-600">{selectedUser.account_status || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Role:</span>
                      <p className="text-gray-600">{selectedUser.role || 'User'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">2FA:</span>
                      <p className="text-gray-600">{selectedUser.two_factor_enabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Joined:</span>
                      <p className="text-gray-600">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'edit' && selectedUser && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={editData.first_name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={editData.last_name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={editData.role || 'user'}
                      onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateUser}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Update User
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDashboard;