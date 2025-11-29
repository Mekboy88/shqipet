import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OptimizationSuggestion {
  suggestion_type: 'cost' | 'performance' | 'security' | 'storage';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact_score: number;
  potential_savings?: number;
  potential_improvement?: string;
  category: string;
  affected_service?: string;
  recommendation: string;
  auto_applicable: boolean;
  metadata: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting optimization analysis...');
    const suggestions: OptimizationSuggestion[] = [];

    // 1. COST OPTIMIZATION ANALYSIS
    console.log('Analyzing cost patterns...');
    
    // Check free tier violations
    const { data: usageData } = await supabase
      .from('resource_usage')
      .select('service_name, usage_amount')
      .gte('usage_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const { data: pricingData } = await supabase
      .from('service_pricing')
      .select('*');

    if (usageData && pricingData) {
      const usageByService = usageData.reduce((acc, row) => {
        acc[row.service_name] = (acc[row.service_name] || 0) + parseFloat(row.usage_amount);
        return acc;
      }, {} as Record<string, number>);

      pricingData.forEach(pricing => {
        const totalUsage = usageByService[pricing.service_name] || 0;
        if (totalUsage > pricing.free_tier_limit) {
          const overage = totalUsage - pricing.free_tier_limit;
          const monthlyCost = overage * parseFloat(pricing.cost_per_unit);
          
          suggestions.push({
            suggestion_type: 'cost',
            severity: monthlyCost > 50 ? 'critical' : monthlyCost > 20 ? 'high' : 'medium',
            title: `${pricing.service_name} Exceeding Free Tier`,
            description: `Your ${pricing.service_name} usage (${totalUsage.toFixed(2)} ${pricing.unit_type}) exceeds the free tier limit by ${overage.toFixed(2)} ${pricing.unit_type}`,
            impact_score: Math.min(95, 60 + Math.floor(monthlyCost)),
            potential_savings: monthlyCost,
            category: 'Cost Efficiency',
            affected_service: pricing.service_name,
            recommendation: `Reduce ${pricing.service_name} usage by ${((overage / totalUsage) * 100).toFixed(0)}% or upgrade to a paid plan`,
            auto_applicable: false,
            metadata: { service: pricing.service_name, overage, monthlyCost }
          });
        }
      });
    }

    // 2. PERFORMANCE OPTIMIZATION ANALYSIS
    console.log('Analyzing performance metrics...');
    
    const { data: slowQueries } = await supabase.rpc('admin_get_live_operation_metrics', { p_window_minutes: 60 });
    
    if (slowQueries && slowQueries.recent_events) {
      const events = slowQueries.recent_events;
      if (Array.isArray(events) && events.length > 10) {
        suggestions.push({
          suggestion_type: 'performance',
          severity: 'high',
          title: 'High Volume of Recent Events',
          description: `${events.length} system events detected in the last hour, which may indicate performance bottlenecks`,
          impact_score: 75,
          potential_improvement: '40% faster response times',
          category: 'Performance',
          recommendation: 'Review and optimize frequently called database queries and add appropriate indexes',
          auto_applicable: false,
          metadata: { event_count: events.length }
        });
      }
    }

    // 3. STORAGE OPTIMIZATION ANALYSIS
    console.log('Analyzing storage patterns...');
    
    const { data: uploadLogs } = await supabase
      .from('upload_logs')
      .select('file_size, upload_status')
      .gte('started_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (uploadLogs && uploadLogs.length > 0) {
      const totalSize = uploadLogs.reduce((sum, log) => sum + (log.file_size || 0), 0);
      const avgSize = totalSize / uploadLogs.length;
      const largeFiles = uploadLogs.filter(log => (log.file_size || 0) > 10 * 1024 * 1024); // >10MB

      if (largeFiles.length > 0) {
        const totalLargeSize = largeFiles.reduce((sum, log) => sum + (log.file_size || 0), 0);
        const potentialSavings = totalLargeSize * 0.6; // 60% compression potential

        suggestions.push({
          suggestion_type: 'storage',
          severity: largeFiles.length > 50 ? 'high' : 'medium',
          title: 'Large Uncompressed Files Detected',
          description: `${largeFiles.length} files larger than 10MB detected (${(totalLargeSize / 1024 / 1024 / 1024).toFixed(2)} GB total)`,
          impact_score: Math.min(85, 50 + largeFiles.length),
          potential_improvement: `${(potentialSavings / 1024 / 1024 / 1024).toFixed(2)} GB storage freed`,
          category: 'Storage',
          affected_service: 'File Storage',
          recommendation: 'Enable automatic image compression and video transcoding on upload',
          auto_applicable: true,
          metadata: { large_file_count: largeFiles.length, total_size: totalLargeSize }
        });
      }

      // Check for failed uploads
      const failedUploads = uploadLogs.filter(log => log.upload_status === 'failed');
      if (failedUploads.length > uploadLogs.length * 0.1) {
        suggestions.push({
          suggestion_type: 'performance',
          severity: 'medium',
          title: 'High Upload Failure Rate',
          description: `${((failedUploads.length / uploadLogs.length) * 100).toFixed(1)}% of uploads are failing`,
          impact_score: 65,
          potential_improvement: '90% upload success rate',
          category: 'Reliability',
          affected_service: 'Upload Service',
          recommendation: 'Investigate upload failures and implement retry logic with better error handling',
          auto_applicable: false,
          metadata: { failure_rate: failedUploads.length / uploadLogs.length }
        });
      }
    }

    // 4. SECURITY OPTIMIZATION ANALYSIS
    console.log('Analyzing security patterns...');
    
    const { data: securityEvents } = await supabase
      .from('security_events')
      .select('*')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (securityEvents && securityEvents.length > 0) {
      const criticalEvents = securityEvents.filter(e => e.risk_level === 'critical' || e.risk_level === 'high');
      
      if (criticalEvents.length > 0) {
        suggestions.push({
          suggestion_type: 'security',
          severity: 'critical',
          title: 'Critical Security Events Detected',
          description: `${criticalEvents.length} high-risk security events in the last 7 days`,
          impact_score: 95,
          category: 'Security',
          recommendation: 'Review and address all critical security events immediately. Consider implementing additional security measures.',
          auto_applicable: false,
          metadata: { critical_count: criticalEvents.length }
        });
      }
    }

    // Check for brute force attempts
    const { data: bruteForce } = await supabase
      .from('brute_force_alerts')
      .select('*')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (bruteForce && bruteForce.length > 0) {
      suggestions.push({
        suggestion_type: 'security',
        severity: bruteForce.length > 10 ? 'high' : 'medium',
        title: 'Brute Force Attacks Detected',
        description: `${bruteForce.length} brute force attempts detected in the last 7 days`,
        impact_score: Math.min(90, 60 + bruteForce.length),
        category: 'Security',
        affected_service: 'Authentication',
        recommendation: 'Implement rate limiting on login endpoints and consider adding CAPTCHA for repeated failed attempts',
        auto_applicable: false,
        metadata: { attempt_count: bruteForce.length }
      });
    }


    console.log(`Generated ${suggestions.length} optimization suggestions`);

    // Clear old suggestions and insert new ones
    await supabase
      .from('optimization_suggestions')
      .delete()
      .eq('status', 'open');

    if (suggestions.length > 0) {
      const { error: insertError } = await supabase
        .from('optimization_suggestions')
        .insert(suggestions);

      if (insertError) {
        console.error('Error inserting suggestions:', insertError);
        throw insertError;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        suggestions_generated: suggestions.length,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-optimizations:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
