
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { 
  Role, 
  RoleFormData, 
  ALL_PERMISSIONS, 
  PERMISSION_CATEGORIES, 
  PermissionCategory 
} from '@/types/role';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
}

export const RoleForm: React.FC<RoleFormProps> = ({ isOpen, onClose, role }) => {
  const isEditing = !!role;

  const [formData, setFormData] = useState<RoleFormData>({
    name: role?.name || '',
    description: role?.description || '',
    active: role?.active ?? true,
    permissions: role?.permissions || [],
  });

  // Group permissions by category for UI rendering
  const permissionsByCategory = ALL_PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<PermissionCategory, typeof ALL_PERMISSIONS>);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, active: checked }));
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => {
      const hasPermission = prev.permissions.includes(permissionId);
      
      if (hasPermission) {
        return {
          ...prev,
          permissions: prev.permissions.filter(id => id !== permissionId),
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permissionId],
        };
      }
    });
  };

  const handleCategorySelectAll = (category: PermissionCategory, select: boolean) => {
    const categoryPermissionIds = permissionsByCategory[category]?.map(p => p.id) || [];
    
    setFormData(prev => {
      if (select) {
        // Add all category permissions that aren't already included
        const newPermissions = [...new Set([...prev.permissions, ...categoryPermissionIds])];
        return { ...prev, permissions: newPermissions };
      } else {
        // Remove all permissions from this category
        return {
          ...prev,
          permissions: prev.permissions.filter(id => !categoryPermissionIds.includes(id))
        };
      }
    });
  };

  const countCategoryCheckedPermissions = (category: PermissionCategory) => {
    const categoryPermissionIds = permissionsByCategory[category]?.map(p => p.id) || [];
    return formData.permissions.filter(id => categoryPermissionIds.includes(id)).length;
  };
  
  const isCategoryFullySelected = (category: PermissionCategory) => {
    const categoryPermissions = permissionsByCategory[category] || [];
    const categoryPermissionIds = categoryPermissions.map(p => p.id);
    return categoryPermissionIds.every(id => formData.permissions.includes(id));
  };

  const isCategoryPartiallySelected = (category: PermissionCategory) => {
    const count = countCategoryCheckedPermissions(category);
    const total = permissionsByCategory[category]?.length || 0;
    return count > 0 && count < total;
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Role name is required");
      return;
    }

    // Here you would integrate with your backend API to save the role
    toast.success(
      isEditing 
        ? `Role "${formData.name}" has been updated` 
        : `Role "${formData.name}" has been created`
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Role' : 'Create New Role'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Tabs defaultValue="basic">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            
            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Role Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of this role's purpose"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleToggleChange}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </TabsContent>
            
            {/* Permissions Tab */}
            <TabsContent value="permissions" className="mt-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <Label>Role Permissions</Label>
                  <Badge variant="outline" className="ml-2">
                    {formData.permissions.length} Selected
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Set the specific permissions for this role. These determine what actions users with this role can perform.
                </p>
                
                <Accordion type="multiple" className="w-full">
                  {PERMISSION_CATEGORIES.map(category => {
                    const categoryPermissions = permissionsByCategory[category.id as PermissionCategory];
                    const checkedCount = countCategoryCheckedPermissions(category.id as PermissionCategory);
                    const totalCount = categoryPermissions?.length || 0;
                    
                    return (
                      <AccordionItem value={category.id} key={category.id} className="border rounded-md mb-2">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`category-${category.id}`}
                                checked={isCategoryFullySelected(category.id as PermissionCategory)}
                                data-state={
                                  isCategoryFullySelected(category.id as PermissionCategory) 
                                    ? "checked" 
                                    : isCategoryPartiallySelected(category.id as PermissionCategory) 
                                      ? "indeterminate" 
                                      : "unchecked"
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCategorySelectAll(
                                    category.id as PermissionCategory,
                                    !isCategoryFullySelected(category.id as PermissionCategory)
                                  );
                                }}
                              />
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <Badge variant="outline" className="ml-auto">
                              {checkedCount}/{totalCount}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-2">
                            {categoryPermissions?.map(permission => (
                              <div 
                                key={permission.id} 
                                className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-md transition-colors"
                              >
                                <Checkbox
                                  id={permission.id}
                                  checked={formData.permissions.includes(permission.id)}
                                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                                />
                                <div>
                                  <Label 
                                    htmlFor={permission.id}
                                    className="cursor-pointer font-normal"
                                  >
                                    {permission.name}
                                  </Label>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info size={14} className="inline ml-1 text-muted-foreground cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-xs">{permission.description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
