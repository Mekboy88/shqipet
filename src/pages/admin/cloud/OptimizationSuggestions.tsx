import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Sparkles, 
  RefreshCw, 
  Search, 
  DollarSign,
  Zap,
  HardDrive,
  Shield,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useOptimizationSuggestions, OptimizationSuggestion } from '@/hooks/useOptimizationSuggestions';
import { useOptimizationActions } from '@/hooks/useOptimizationActions';
import { OptimizationScore } from '@/components/admin/cloud/optimizations/OptimizationScore';
import { SuggestionCard } from '@/components/admin/cloud/optimizations/SuggestionCard';
import { SuggestionDetailModal } from '@/components/admin/cloud/optimizations/SuggestionDetailModal';

export default function OptimizationSuggestions() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<OptimizationSuggestion | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { suggestions, stats, isLoading, refetch } = useOptimizationSuggestions({
    type: selectedType,
    severity: selectedSeverity,
    search: searchQuery,
    status: 'open'
  });

  const { applySuggestion, dismissSuggestion, generateSuggestions } = useOptimizationActions();

  const handleApply = (id: string) => {
    applySuggestion.mutate(id);
  };

  const handleDismiss = (id: string) => {
    dismissSuggestion.mutate({ id });
  };

  const handleViewDetails = (suggestion: OptimizationSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsDetailModalOpen(true);
  };

  const handleGenerateSuggestions = () => {
    generateSuggestions.mutate();
  };

  const filterByType = (type: string) => {
    return suggestions.filter(s => type === 'all' || s.suggestion_type === type);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              Optimization Suggestions
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered recommendations to improve performance, reduce costs, and enhance security
            </p>
          </div>
          <Button 
            onClick={handleGenerateSuggestions}
            disabled={generateSuggestions.isPending}
          >
            {generateSuggestions.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Analyze Now
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Critical</span>
              <Badge variant="destructive">{stats.critical}</Badge>
            </div>
            <div className="text-2xl font-bold">{stats.critical}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">High Priority</span>
              <Badge className="bg-orange-500">{stats.high}</Badge>
            </div>
            <div className="text-2xl font-bold">{stats.high}</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Potential Savings</span>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-500">
              ${stats.totalSavings.toFixed(2)}
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Issues</span>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
        </div>

        {/* Optimization Score */}
        <OptimizationScore stats={stats} />

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search suggestions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </Card>

        {/* Tabs with Suggestions */}
        <Tabs value={selectedType} onValueChange={setSelectedType}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              All ({suggestions.length})
            </TabsTrigger>
            <TabsTrigger value="cost" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Cost ({filterByType('cost').length})
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Performance ({filterByType('performance').length})
            </TabsTrigger>
            <TabsTrigger value="storage" className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Storage ({filterByType('storage').length})
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security ({filterByType('security').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedType} className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : suggestions.length === 0 ? (
              <Card className="p-12 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Suggestions</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedType === 'all' 
                    ? "Everything looks optimized! Generate new suggestions to get the latest recommendations."
                    : `No ${selectedType} suggestions at the moment.`
                  }
                </p>
                <Button onClick={handleGenerateSuggestions}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Suggestions
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {suggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onApply={handleApply}
                    onDismiss={handleDismiss}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Modal */}
      <SuggestionDetailModal
        suggestion={selectedSuggestion}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApply={handleApply}
        onDismiss={handleDismiss}
      />
    </div>
  );
}
