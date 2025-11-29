import { MenuItem } from './types';
import { CreditCard, Globe, BrainCircuit, Languages, Lock } from './icons';
import { Star } from 'lucide-react';

export const businessMenuItems: MenuItem[] = [
  {
    id: 'financial-management',
    label: '💰 Financial Management',
    icon: CreditCard,
    colorVariant: 'forestGreen',
    submenu: [
      { id: 'payment-processing', label: '💳 Payment Processing', href: '/admin/finance/payments' },
      { id: 'revenue-tracking', label: '💰 Revenue Tracking', href: '/admin/finance/revenue' },
      { id: 'fundraising-management', label: '🎁 Fundraising Management', href: '/admin/finance/fundraising' },
      { id: 'financial-reports', label: '📊 Financial Reports', href: '/admin/finance/reports' },
      { id: 'advertising-revenue', label: '💸 Advertising Revenue', href: '/admin/finance/ad-revenue' },
      { id: 'marketplace-transactions', label: '🛒 Marketplace Transactions', href: '/admin/finance/marketplace' },
      { id: 'subscription-management', label: '💼 Subscription Management', href: '/admin/finance/subscriptions' }
    ]
  },
  {
    id: 'ecommerce-management',
    label: '🛒 E-Commerce Management',
    icon: Globe,
    colorVariant: 'royalBlue',
    submenu: [
      { id: 'store-setup', label: '🏪 Store Setup', href: '/admin/ecommerce/store' },
      { id: 'inventory-management', label: '📦 Inventory Management', href: '/admin/ecommerce/inventory' },
      { id: 'shipping-delivery', label: '🚚 Shipping & Delivery', href: '/admin/ecommerce/shipping' },
      { id: 'payment-gateways', label: '💳 Payment Gateways', href: '/admin/ecommerce/gateways' },
      { id: 'product-catalog', label: '🎯 Product Catalog', href: '/admin/ecommerce/catalog' },
      { id: 'sales-analytics', label: '📊 Sales Analytics', href: '/admin/ecommerce/analytics' },
      { id: 'order-management', label: '🔄 Order Management', href: '/admin/ecommerce/orders' },
      { id: 'pricing-management', label: '💰 Pricing Management', href: '/admin/ecommerce/pricing' },
      { id: 'discount-coupons', label: '🏷️ Discount & Coupons', href: '/admin/ecommerce/discounts' },
      { id: 'product-reviews', label: '📝 Product Reviews', href: '/admin/ecommerce/reviews' },
      { id: 'return-management', label: '🔄 Return Management', href: '/admin/ecommerce/returns' }
    ]
  },
  {
    id: 'business-tools',
    label: '🏢 Business Tools',
    icon: BrainCircuit,
    colorVariant: 'burgundySilver',
    submenu: [
      { id: 'crm-integration', label: '📊 CRM Integration', href: '/admin/business/crm' },
      { id: 'lead-generation', label: '📈 Lead Generation', href: '/admin/business/leads' },
      { id: 'project-management', label: '💼 Project Management', href: '/admin/business/projects' },
      { id: 'meeting-scheduler', label: '📅 Meeting Scheduler', href: '/admin/business/meetings' },
      { id: 'document-management', label: '📝 Document Management', href: '/admin/business/documents' },
      { id: 'invoice-generation', label: '💰 Invoice Generation', href: '/admin/business/invoices' },
      { id: 'business-analytics', label: '📊 Business Analytics', href: '/admin/business/analytics' },
      { id: 'team-collaboration', label: '👥 Team Collaboration', href: '/admin/business/collaboration' },
      { id: 'marketing-tools', label: '🎯 Marketing Tools', href: '/admin/business/marketing' },
      { id: 'customer-support', label: '📞 Customer Support', href: '/admin/business/support' }
    ]
  },
  {
    id: 'advertising-platform',
    label: '🎯 Advertising Platform',
    icon: Languages,
    colorVariant: 'tealGold',
    submenu: [
      { id: 'ad-campaign-manager', label: '📢 Ad Campaign Manager', href: '/admin/ads/campaigns' },
      { id: 'audience-targeting', label: '🎯 Audience Targeting', href: '/admin/ads/targeting' },
      { id: 'ad-performance', label: '📊 Ad Performance', href: '/admin/ads/performance' },
      { id: 'budget-management', label: '💰 Budget Management', href: '/admin/ads/budget' },
      { id: 'ad-creative-tools', label: '🎨 Ad Creative Tools', href: '/admin/ads/creative' },
      { id: 'roi-tracking', label: '📈 ROI Tracking', href: '/admin/ads/roi' },
      { id: 'ab-testing', label: '🔄 A/B Testing', href: '/admin/ads/testing' },
      { id: 'mobile-ads', label: '📱 Mobile Ads', href: '/admin/ads/mobile' },
      { id: 'video-ads', label: '🎬 Video Ads', href: '/admin/ads/video' },
      { id: 'ad-analytics', label: '📊 Ad Analytics', href: '/admin/ads/analytics' }
    ]
  },
  {
    id: 'real-estate',
    label: '🏠 Real Estate',
    icon: Lock,
    colorVariant: 'oliveWhite',
    submenu: [
      { id: 'property-listings', label: '🏡 Property Listings', href: '/admin/realestate/listings' },
      { id: 'property-search', label: '🔍 Property Search', href: '/admin/realestate/search' },
      { id: 'virtual-tours', label: '🏠 Virtual Tours', href: '/admin/realestate/tours' },
      { id: 'price-estimates', label: '💰 Price Estimates', href: '/admin/realestate/estimates' },
      { id: 'market-analytics', label: '📊 Market Analytics', href: '/admin/realestate/market' },
      { id: 'neighborhood-info', label: '🏘️ Neighborhood Info', href: '/admin/realestate/neighborhood' },
      { id: 'rental-management', label: '📝 Rental Management', href: '/admin/realestate/rental' },
      { id: 'agent-network', label: '🤝 Agent Network', href: '/admin/realestate/agents' },
      { id: 'property-photos', label: '📷 Property Photos', href: '/admin/realestate/photos' },
      { id: 'lease-management', label: '📋 Lease Management', href: '/admin/realestate/lease' }
    ]
  }
];
