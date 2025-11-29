// Comprehensive audit functions for Luna AI

export interface AuditResult {
  score: number;
  issues: string[];
  recommendations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComprehensiveAudit {
  frontend: {
    performance: AuditResult;
    accessibility: AuditResult;
    responsiveDesign: AuditResult;
    seo: AuditResult;
  };
  backend: {
    security: AuditResult;
    performance: AuditResult;
    apis: AuditResult;
    database: AuditResult;
  };
  overall: {
    score: number;
    criticalIssues: string[];
    recommendations: string[];
    nextActions: string[];
  };
}

export const auditPerformance = async (): Promise<AuditResult> => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const resources = performance.getEntriesByType('resource');
  
  const loadTime = navigation?.loadEventEnd - navigation?.loadEventStart || 0;
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check load times
  if (loadTime > 3000) {
    issues.push(`Slow page load time: ${Math.round(loadTime)}ms`);
    recommendations.push('Optimize images, enable compression, use CDN');
  }
  
  // Check resource sizes
  const largeResources = resources.filter(r => {
    const resource = r as PerformanceResourceTiming;
    return resource.transferSize && resource.transferSize > 1000000;
  });
  if (largeResources.length > 0) {
    issues.push(`${largeResources.length} large resources detected`);
    recommendations.push('Compress large assets and implement lazy loading');
  }
  
  // Check for unused CSS/JS
  const stylesheets = resources.filter(r => r.name.includes('.css')).length;
  const scripts = resources.filter(r => r.name.includes('.js')).length;
  
  if (stylesheets > 10) {
    issues.push('Too many CSS files - consider bundling');
    recommendations.push('Combine CSS files to reduce HTTP requests');
  }
  
  const score = Math.max(0, 100 - (issues.length * 15));
  const priority = score < 50 ? 'critical' : score < 70 ? 'high' : score < 85 ? 'medium' : 'low';
  
  return { score, issues, recommendations, priority };
};

export const auditAccessibility = async (): Promise<AuditResult> => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check for missing alt attributes
  const images = document.querySelectorAll('img');
  const missingAlt = Array.from(images).filter(img => !img.alt).length;
  if (missingAlt > 0) {
    issues.push(`${missingAlt} images missing alt attributes`);
    recommendations.push('Add descriptive alt text to all images');
  }
  
  // Check heading structure
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const h1Count = document.querySelectorAll('h1').length;
  if (h1Count !== 1) {
    issues.push(`Incorrect H1 usage: ${h1Count} H1 tags found`);
    recommendations.push('Use exactly one H1 tag per page');
  }
  
  // Check for form labels
  const inputs = document.querySelectorAll('input, textarea, select');
  const unlabeledInputs = Array.from(inputs).filter(input => {
    const id = input.id;
    return !id || !document.querySelector(`label[for="${id}"]`);
  }).length;
  
  if (unlabeledInputs > 0) {
    issues.push(`${unlabeledInputs} form inputs without proper labels`);
    recommendations.push('Associate all form inputs with descriptive labels');
  }
  
  // Check color contrast (basic check)
  const elements = document.querySelectorAll('*');
  let lowContrastElements = 0;
  Array.from(elements).slice(0, 50).forEach(el => {
    const styles = getComputedStyle(el);
    const bgColor = styles.backgroundColor;
    const textColor = styles.color;
    if (bgColor && textColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      // Basic contrast check - would need more sophisticated color analysis
      if (bgColor === textColor) {
        lowContrastElements++;
      }
    }
  });
  
  if (lowContrastElements > 0) {
    issues.push(`Potential color contrast issues detected`);
    recommendations.push('Ensure text has sufficient contrast ratio (4.5:1 minimum)');
  }
  
  const score = Math.max(0, 100 - (issues.length * 20));
  const priority = score < 50 ? 'critical' : score < 70 ? 'high' : score < 85 ? 'medium' : 'low';
  
  return { score, issues, recommendations, priority };
};

export const auditSecurity = async (): Promise<AuditResult> => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check HTTPS
  if (window.location.protocol !== 'https:') {
    issues.push('Site not using HTTPS');
    recommendations.push('Enable HTTPS to secure data transmission');
  }
  
  // Check for mixed content
  const resources = performance.getEntriesByType('resource');
  const mixedContent = resources.filter(r => 
    window.location.protocol === 'https:' && r.name.startsWith('http:')
  ).length;
  
  if (mixedContent > 0) {
    issues.push(`${mixedContent} mixed content resources detected`);
    recommendations.push('Ensure all resources use HTTPS');
  }
  
  // Check CSP headers
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!cspMeta) {
    issues.push('No Content Security Policy detected');
    recommendations.push('Implement CSP headers to prevent XSS attacks');
  }
  
  // Check for inline scripts
  const inlineScripts = document.querySelectorAll('script:not([src])').length;
  if (inlineScripts > 0) {
    issues.push(`${inlineScripts} inline scripts detected`);
    recommendations.push('Move inline scripts to external files for better security');
  }
  
  // Check for exposed sensitive data
  const forms = document.querySelectorAll('form');
  const insecureForms = Array.from(forms).filter(form => 
    form.method.toLowerCase() === 'get' && 
    form.querySelector('input[type="password"]')
  ).length;
  
  if (insecureForms > 0) {
    issues.push('Password forms using GET method detected');
    recommendations.push('Use POST method for forms containing sensitive data');
  }
  
  const score = Math.max(0, 100 - (issues.length * 25));
  const priority = score < 50 ? 'critical' : score < 70 ? 'high' : score < 85 ? 'medium' : 'low';
  
  return { score, issues, recommendations, priority };
};

export const auditResponsiveDesign = async (): Promise<AuditResult> => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    issues.push('Missing viewport meta tag');
    recommendations.push('Add viewport meta tag for mobile responsiveness');
  } else {
    const content = viewport.getAttribute('content') || '';
    if (!content.includes('width=device-width')) {
      issues.push('Viewport not set to device width');
      recommendations.push('Set viewport width to device-width');
    }
  }
  
  // Check for media queries
  let mediaQueryCount = 0;
  try {
    Array.from(document.styleSheets).forEach(sheet => {
      Array.from(sheet.cssRules).forEach(rule => {
        if (rule.type === CSSRule.MEDIA_RULE) {
          mediaQueryCount++;
        }
      });
    });
  } catch (e) {
    // CORS or other access issues
  }
  
  if (mediaQueryCount === 0) {
    issues.push('No media queries detected');
    recommendations.push('Implement responsive breakpoints with media queries');
  }
  
  // Check for fixed width elements
  const elements = document.querySelectorAll('*');
  let fixedWidthElements = 0;
  Array.from(elements).slice(0, 100).forEach(el => {
    const styles = getComputedStyle(el);
    if (styles.width && styles.width.includes('px') && !styles.width.includes('%')) {
      const width = parseInt(styles.width);
      if (width > 600) {
        fixedWidthElements++;
      }
    }
  });
  
  if (fixedWidthElements > 5) {
    issues.push(`${fixedWidthElements} elements with fixed large widths`);
    recommendations.push('Use relative units (%, rem, em) instead of fixed pixels');
  }
  
  const score = Math.max(0, 100 - (issues.length * 20));
  const priority = score < 50 ? 'critical' : score < 70 ? 'high' : score < 85 ? 'medium' : 'low';
  
  return { score, issues, recommendations, priority };
};

export const performComprehensiveAudit = async (): Promise<ComprehensiveAudit> => {
  const [performance, accessibility, responsiveDesign, security] = await Promise.all([
    auditPerformance(),
    auditAccessibility(),
    auditResponsiveDesign(),
    auditSecurity()
  ]);
  
  // Mock backend audits (would need actual API calls in real implementation)
  const backendSecurity: AuditResult = {
    score: 85,
    issues: ['Rate limiting not configured', 'API endpoints lack input validation'],
    recommendations: ['Implement rate limiting', 'Add comprehensive input validation'],
    priority: 'medium'
  };
  
  const backendPerformance: AuditResult = {
    score: 78,
    issues: ['Database queries not optimized', 'No caching strategy'],
    recommendations: ['Add database indexes', 'Implement Redis caching'],
    priority: 'medium'
  };
  
  const apis: AuditResult = {
    score: 90,
    issues: ['Some endpoints missing error handling'],
    recommendations: ['Add comprehensive error handling to all endpoints'],
    priority: 'low'
  };
  
  const database: AuditResult = {
    score: 82,
    issues: ['No backup strategy configured', 'Connection pooling not optimized'],
    recommendations: ['Set up automated backups', 'Optimize connection pool settings'],
    priority: 'medium'
  };
  
  const overallScore = Math.round(
    (performance.score + accessibility.score + responsiveDesign.score + 
     security.score + backendSecurity.score + backendPerformance.score + 
     apis.score + database.score) / 8
  );
  
  const criticalIssues = [
    ...performance.issues.filter(() => performance.priority === 'critical'),
    ...accessibility.issues.filter(() => accessibility.priority === 'critical'),
    ...security.issues.filter(() => security.priority === 'critical')
  ];
  
  const recommendations = [
    ...performance.recommendations.slice(0, 2),
    ...accessibility.recommendations.slice(0, 2),
    ...security.recommendations.slice(0, 1)
  ];
  
  const nextActions = [
    'Fix critical security issues first',
    'Optimize page load performance',
    'Improve accessibility compliance',
    'Implement proper monitoring and logging'
  ];
  
  return {
    frontend: {
      performance,
      accessibility,
      responsiveDesign,
      seo: { score: 75, issues: ['Missing meta descriptions'], recommendations: ['Add SEO meta tags'], priority: 'medium' }
    },
    backend: {
      security: backendSecurity,
      performance: backendPerformance,
      apis,
      database
    },
    overall: {
      score: overallScore,
      criticalIssues,
      recommendations,
      nextActions
    }
  };
};