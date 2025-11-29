import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
import LocalizationNav from './LocalizationNav';


export default function LocalizationCurrencyPage() {
  return <Navigate to="/admin/localization/time" replace />;
}
