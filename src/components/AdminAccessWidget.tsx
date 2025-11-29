
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import AdminAccessManager from '@/components/admin/AdminAccessManager';

const AdminAccessWidget: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Admin Access Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AdminAccessManager />
      </CardContent>
    </Card>
  );
};

export default AdminAccessWidget;
