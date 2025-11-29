
import { useState, useEffect } from 'react';
import { Role, DEFAULT_ROLES } from '@/types/role';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call to fetch roles from the backend
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create sample roles from the default roles
        const mockRoles: Role[] = DEFAULT_ROLES.map((role, index) => ({
          ...role,
          id: `role-${index + 1}`,
          userCount: Math.floor(Math.random() * 50),
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
          createdBy: {
            id: 'user-1',
            name: 'System Administrator',
          },
          updatedBy: {
            id: 'user-1',
            name: 'System Administrator',
          },
        }));
        
        setRoles(mockRoles);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch roles'));
        console.error('Error fetching roles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const addRole = (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    const newRole: Role = {
      ...role,
      id: `role-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        id: 'current-user',
        name: 'Current Admin',
      },
      updatedBy: {
        id: 'current-user',
        name: 'Current Admin',
      },
    };
    
    setRoles(prev => [...prev, newRole]);
    return newRole;
  };

  const updateRole = (id: string, updates: Partial<Omit<Role, 'id' | 'createdAt' | 'createdBy'>>) => {
    setRoles(prev => 
      prev.map(role => 
        role.id === id 
          ? { 
              ...role, 
              ...updates,
              updatedAt: new Date().toISOString(),
              updatedBy: {
                id: 'current-user',
                name: 'Current Admin',
              },
            } 
          : role
      )
    );
  };

  const deleteRole = (id: string) => {
    setRoles(prev => prev.filter(role => role.id !== id));
  };

  return {
    roles,
    isLoading,
    error,
    addRole,
    updateRole,
    deleteRole,
  };
}
