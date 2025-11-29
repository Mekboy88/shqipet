import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import LocalizationNav from './LocalizationNav';

export default function ImportExportPage() {
  return (
    <div className="space-y-6">
      <LocalizationNav />
      <h1 className="text-2xl font-semibold">Import / Export</h1>
      <Card className="rounded-xl shadow-sm ring-1 ring-[hsl(var(--surface-soft-gray-border))] bg-[hsl(var(--surface-soft-gray))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UploadCloud className="h-5 w-5" /> Import / Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="secondary" className="w-full">Export settings JSON</Button>
          <Button variant="outline" className="w-full">Import settings JSON</Button>
        </CardContent>
      </Card>
    </div>
  );
}
