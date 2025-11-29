
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FilePenLine, FileText, Circle, MessageSquare, Gamepad2, MessagesSquare, Users as GroupsIcon, FileDown, PlusCircle, CalendarRange } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, iconBgColor, iconColor }: { title: string, value: string, icon: React.ElementType, iconBgColor: string, iconColor: string }) => (
  <Card className="shadow-sm">
    <CardContent className="pt-6">
      <div className="flex items-center space-x-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium uppercase text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const generateChartData = (year: number) => {
  const base = {
    Users: 2000 + (year - 2023) * 200,
    Posts: 4000 + (year - 2023) * 300,
    Pages: 100 + (year - 2023) * 20,
    Groups: 40 + (year - 2023) * 5,
  };
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, index) => ({
    name: month,
    Users: Math.floor(base.Users * (1 + Math.sin(index) * 0.2) * (1 + (Math.random() - 0.5) * 0.1)),
    Posts: Math.floor(base.Posts * (1 + Math.sin(index) * 0.2) * (1 + (Math.random() - 0.5) * 0.1)),
    Pages: Math.floor(base.Pages * (1 + Math.sin(index) * 0.1) * (1 + (Math.random() - 0.5) * 0.1)),
    Groups: Math.floor(base.Groups * (1 + Math.sin(index) * 0.1) * (1 + (Math.random() - 0.5) * 0.1)),
  }));
};

const allChartData = {
  2025: generateChartData(2025),
  2024: generateChartData(2024),
  2023: generateChartData(2023),
};

const years = Object.keys(allChartData).map(Number).sort((a, b) => b - a);
const months = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
  { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
  { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
];

const AdminDashboardContent = () => {
  const stats = [
    { title: 'Total Users', value: '90,359', icon: Users, iconBgColor: 'bg-blue-100', iconColor: 'text-blue-500' },
    { title: 'Total Posts', value: '198,094', icon: FilePenLine, iconBgColor: 'bg-sky-100', iconColor: 'text-sky-500' },
    { title: 'Total Pages', value: '1,216', icon: FileText, iconBgColor: 'bg-amber-100', iconColor: 'text-amber-500' },
    { title: 'Total Groups', value: '546', icon: GroupsIcon, iconBgColor: 'bg-pink-100', iconColor: 'text-pink-500' },
    { title: 'Online Users', value: '14', icon: Circle, iconBgColor: 'bg-green-100', iconColor: 'text-green-500' },
    { title: 'Total Comments', value: '5,369', icon: MessageSquare, iconBgColor: 'bg-indigo-100', iconColor: 'text-indigo-500' },
    { title: 'Total Games', value: '191', icon: Gamepad2, iconBgColor: 'bg-cyan-100', iconColor: 'text-cyan-500' },
    { title: 'Total Messages', value: '17,165', icon: MessagesSquare, iconBgColor: 'bg-yellow-100', iconColor: 'text-yellow-500' },
  ];

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterType, setFilterType] = useState<'month' | 'range'>('month');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
      to: new Date(),
  });
  const [showMoreContent, setShowMoreContent] = useState(false);

  const filteredChartData = React.useMemo(() => {
    if (filterType === 'month') {
        const data = allChartData[selectedYear as keyof typeof allChartData] || [];
        return data; // Show all 12 months
    }

    if (!dateRange?.from) {
        return [];
    }

    const from = dateRange.from;
    const to = dateRange.to || from;

    let data: any[] = [];
    
    const startYear = from.getFullYear();
    const endYear = to.getFullYear();
    
    const availableYears = Object.keys(allChartData).map(Number);

    for (let year = startYear; year <= endYear; year++) {
        if (!availableYears.includes(year)) continue;

        const yearData = allChartData[year as keyof typeof allChartData];
        const startMonth = (year === startYear) ? from.getMonth() : 0;
        const endMonth = (year === endYear) ? to.getMonth() : 11;

        data = data.concat(yearData.slice(startMonth, endMonth + 1));
    }
    return data;
  }, [filterType, selectedMonth, selectedYear, dateRange]);

  const handleExportPDF = () => {
    try {
      toast.info("Generating your PDF report...", {
        description: "This may take a few moments.",
      });

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const addPageHeader = () => {
        // Shqipet Logo
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text('Shqipet', 14, 22);

        // Date
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 14, 15, { align: 'right' });
        
        // Horizontal line
        doc.setDrawColor(226, 232, 240); // tailwind gray-200
        doc.line(14, 32, pageWidth - 14, 32);
      };

      const addPageFooter = (pageNumber: number) => {
        doc.setFontSize(8);
        doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      };
      
      // --- Page 1 ---
      addPageHeader();

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`Statistics for ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`, 14, 45);
      
      const head = [['Metric', 'Current Value', 'Monthly Change']];
      const body = stats.map(stat => {
        const change = (Math.random() * 20 - 10);
        const changeText = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
        return [
          { content: stat.title, styles: { fontStyle: 'bold' } },
          stat.value,
          { 
            content: changeText, 
            styles: { textColor: change >= 0 ? [22, 163, 74] : [220, 38, 38], halign: 'center' } // green-600, red-600
          }
        ];
      });

      (doc as any).autoTable({
        head: head,
        body: body,
        startY: 50,
        theme: 'grid',
        headStyles: { 
          fillColor: [30, 41, 59], // tailwind slate-800
          textColor: 255, 
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'center' },
        },
        styles: { fontSize: 10, cellPadding: 3.5 },
        alternateRowStyles: { fillColor: [241, 245, 249] }, // tailwind slate-100
      });
      
      addPageFooter(1);


      // --- Page 2 ---
      doc.addPage();
      addPageHeader();
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Monthly Growth Chart', 14, 45);

      const canvas = document.querySelector('.recharts-surface') as HTMLCanvasElement;
      if(canvas) {
        try {
          const imgData = canvas.toDataURL('image/png', 1.0);
          const imgProps = doc.getImageProperties(imgData);
          const pdfWidth = pageWidth - 30;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          let yPos = 55;
          doc.addImage(imgData, 'PNG', 15, yPos, pdfWidth, pdfHeight);
        } catch (e) {
          console.error("Error generating chart image for PDF", e);
          doc.text("Could not generate chart image.", 14, 55);
        }
      } else {
          doc.text("Chart canvas not found.", 14, 55);
      }

      addPageFooter(2);

      doc.save(`Shqipet-Dashboard-Report-${selectedYear}-${selectedMonth}.pdf`);
      
      toast.success('PDF report has been generated!', {
        description: 'Check your downloads folder.',
      });

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF", {
        description: "An unexpected error occurred. Please try again."
      });
    }
  };

  const recentActivities = [
      { user: 'John Doe', action: 'New post created', time: '2 minutes ago' },
      { user: 'Jane Smith', action: 'Updated profile', time: '1 hour ago' },
      { user: 'Admin', action: 'Deleted a comment', time: '3 hours ago' },
      { user: 'Padington', action: 'Logged in', time: '5 hours ago' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, Padington</h1>
          <Breadcrumb className="text-sm text-muted-foreground mt-1">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-600">Admin Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-gray-800">DASHBOARD</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      
      <Alert className="bg-rose-50 border-rose-200 text-rose-800">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <span className="font-bold">Important!</span> There are some errors found on your system, please review System Status.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-lg">STATICS</CardTitle>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-2 sm:space-y-0">
            <Select value={filterType} onValueChange={(value) => setFilterType(value as 'month' | 'range')}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">By Month</SelectItem>
                <SelectItem value="range">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {filterType === 'month' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[240px] justify-start text-left font-normal"
                    )}
                  >
                    <CalendarRange className="mr-2 h-4 w-4" />
                    {`${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <div className="grid gap-2">
                    <Select value={String(selectedMonth)} onValueChange={(value) => setSelectedMonth(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month.value} value={String(month.value)}>{month.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            {filterType === 'range' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal sm:w-[260px]",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarRange className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
            <Button variant="outline" size="sm" onClick={handleExportPDF} className="w-full sm:w-auto">
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={filteredChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value > 0 ? `${value / 1000}k` : '0'} />
              <Tooltip
                cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ paddingBottom: '20px' }} />
              <Bar dataKey="Users" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={10} />
              <Bar dataKey="Posts" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={10} />
              <Bar dataKey="Pages" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={10} />
              <Bar dataKey="Groups" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button variant="outline" onClick={() => setShowMoreContent(!showMoreContent)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {showMoreContent ? 'Show Less' : 'Show More Useful Content'}
        </Button>
      </div>

      {showMoreContent && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{activity.user}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{activity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">API Status</span>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-semibold text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Database</span>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-semibold text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Storage</span>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-semibold text-green-600">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">CPU Usage</span>
                <span className="font-semibold">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Memory Usage</span>
                <span className="font-semibold">4.2 GB / 16 GB</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardContent;
