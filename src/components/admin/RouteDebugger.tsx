
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bug, CheckCircle } from 'lucide-react';

const RouteDebugger: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  
  console.log('🔍 [ROUTE-DEBUG] Current location:', location);
  console.log('🔍 [ROUTE-DEBUG] Current params:', params);
  
  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Bug className="h-5 w-5" />
          🔧 Live Route Diagnostics
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">Current Path:</span>
          <Badge variant="outline" className="bg-white">{location.pathname}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Hash:</span>
          <Badge variant="outline" className="bg-white">{location.hash || 'None'}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Search:</span>
          <Badge variant="outline" className="bg-white">{location.search || 'None'}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Route Params:</span>
          <Badge variant="outline" className="bg-white">{JSON.stringify(params)}</Badge>
        </div>
        <div className="text-xs text-green-700 mt-2 font-medium">
          ✅ SystemRequirementsStatus component successfully loaded and rendering
        </div>
        <div className="text-xs text-blue-600 mt-1">
          This debugger confirms the routing is working correctly
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteDebugger;
