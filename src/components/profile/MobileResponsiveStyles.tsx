import React from 'react';

const MobileResponsiveStyles: React.FC = () => {
  return (
    <style>{`
      /* Mobile Responsive Styles */
      @media (max-width: 768px) {
        .profile-cover-photo {
          height: 300px !important;
        }
        
        .profile-avatar {
          width: 120px !important;
          height: 120px !important;
        }
        
        .profile-navigation-tabs {
          flex-direction: column;
          gap: 8px !important;
        }
        
        .profile-navigation-tabs button {
          padding: 12px 16px !important;
          min-width: 100% !important;
        }
        
        .profile-sidebar {
          width: 100% !important;
          margin-left: 0 !important;
          margin-bottom: 20px;
        }
        
        .profile-content-grid {
          flex-direction: column !important;
          gap: 16px !important;
        }
        
        .profile-action-buttons {
          position: relative !important;
          top: auto !important;
          right: auto !important;
          margin-top: 16px;
          flex-direction: column;
          gap: 8px;
        }
        
        .profile-action-buttons button {
          width: 100% !important;
          justify-content: center;
        }
        
        .post-creation-area {
          padding: 12px !important;
        }
        
        .post-creation-buttons {
          flex-direction: column !important;
          gap: 8px !important;
        }
        
        .post-creation-buttons button {
          width: 100% !important;
          justify-content: center;
        }
      }
      
      @media (max-width: 640px) {
        .profile-cover-photo {
          height: 250px !important;
          border-radius: 12px !important;
        }
        
        .profile-avatar {
          width: 100px !important;
          height: 100px !important;
          left: 12px !important;
          bottom: 12px !important;
        }
        
        .profile-user-info {
          left: 120px !important;
          bottom: 20px !important;
          max-width: calc(100vw - 140px) !important;
        }
        
        .profile-user-info h1 {
          font-size: 1.5rem !important;
        }
        
        .profile-user-info .user-bio {
          font-size: 0.75rem !important;
          padding: 8px !important;
        }
        
        .profile-navigation-tabs button svg {
          width: 12px !important;
          height: 12px !important;
        }
        
        .profile-navigation-tabs button {
          font-size: 0.75rem !important;
          padding: 8px 12px !important;
        }
      }
      
      /* Enhanced Hover Effects for Desktop */
      @media (min-width: 769px) {
        .profile-navigation-tabs button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.2) !important;
        }
        
        .profile-action-buttons button:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        
        .post-creation-buttons button:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        
        .sidebar-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.1) !important;
        }
      }
      
      /* Smooth Transitions */
      .profile-navigation-tabs button,
      .profile-action-buttons button,
      .post-creation-buttons button,
      .sidebar-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      
      /* Focus States */
      .profile-navigation-tabs button:focus,
      .profile-action-buttons button:focus,
      .post-creation-buttons button:focus {
        outline: 2px solid rgba(59, 130, 246, 0.5) !important;
        outline-offset: 2px !important;
      }
      
      /* Loading States */
      .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%) !important;
        background-size: 200% 100% !important;
        animation: loading 1.5s infinite !important;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Accessibility Improvements */
      @media (prefers-reduced-motion: reduce) {
        .profile-navigation-tabs button,
        .profile-action-buttons button,
        .post-creation-buttons button,
        .sidebar-card {
          transition: none !important;
        }
        
        .loading-skeleton {
          animation: none !important;
        }
      }
      
    `}</style>
  );
};

export default MobileResponsiveStyles;