import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Moon, LogOut, Pencil, Wallet, Disc, Zap, Megaphone, Newspaper, LayoutGrid, RefreshCw, Command, Crown, Shield } from "lucide-react";
import Avatar from "@/components/Avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useAuth } from '@/contexts/AuthContext';
import { useSecureRoles } from '@/hooks/users/use-secure-roles';
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";
import { useUniversalUser } from '@/hooks/useUniversalUser';
import QuickSettingsPanel from './QuickSettingsPanel';
const UserProfileDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  
  // Safe auth access with early return
  let authContext, secureRolesContext, universalUserContext;
  try {
    authContext = useAuth();
    secureRolesContext = useSecureRoles();
    universalUserContext = useUniversalUser(authContext?.user?.id);
  } catch (error) {
    console.warn('UserProfileDropdown: Auth context not ready yet');
    return null;
  }
  
  const { user, userProfile, signOut } = authContext;
  const { currentUserRole, isSuperAdmin, isAdmin } = secureRolesContext;
  const { displayName, role: universalRole } = universalUserContext;
  const navigate = useNavigate();

  // Debug logging for admin access
  const isPlatformOwner =
    (userProfile?.primary_role === 'platform_owner_root') ||
    (currentUserRole === 'platform_owner_root') ||
    (universalRole === 'platform_owner_root');
  const hasAdminAccess =
    isPlatformOwner || isSuperAdmin || isAdmin ||
    universalRole === 'admin' || universalRole === 'super_admin';
  console.log('🔍 UserProfileDropdown Debug:', {
    userId: user?.id,
    currentUserRole,
    isSuperAdmin,
    isAdmin,
    isPlatformOwner,
    userPrimaryRole: userProfile?.primary_role,
    universalRole,
    hasAdminAccess
  });
  const handleLinkClick = (path: string) => {
    setOpen(false);
    setShowQuickSettings(false);
    navigate(path);
  };
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // Reset to default view when closing
    if (!newOpen) {
      setShowQuickSettings(false);
    }
  };

  const handleLogout = async () => {
    console.log('🚪 Logout clicked in dropdown');
    setOpen(false);
    setShowQuickSettings(false);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      console.log('Auto-navigation prevented - staying on current page');
    }
  };
  const menuItemClasses = "group flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors hover:text-red-900 hover:bg-gradient-to-r hover:from-red-200 hover:via-red-400 hover:to-red-600";
  const menuItemJustifyBetweenClasses = "group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors hover:text-red-900 hover:bg-gradient-to-r hover:from-red-200 hover:via-red-400 hover:to-red-600";
  return <div className="relative my-0 py-0 mx-0 mt-1">
      <TooltipProvider delayDuration={0}>
        <Tooltip open={showTooltip}>
          <Popover open={open} onOpenChange={handleOpenChange}>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button className="h-12 w-12 rounded-full bg-gray-300 hover:bg-gray-500 transition-colors duration-100" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                  <Avatar size="lg" className="h-12 w-12" />
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            
            <PopoverContent className="w-80 p-0 rounded-xl shadow-lg border-none z-[1000] bg-popover" align="end" sideOffset={12}>
              <div className="bg-popover rounded-xl overflow-hidden text-foreground relative">
                {/* Main content */}
                <div className={`transition-transform duration-300 ${showQuickSettings ? '-translate-x-full' : 'translate-x-0'}`}>
                  <div onClick={() => handleLinkClick('/profile')} className="group p-3 flex items-center justify-between cursor-pointer transition-colors rounded-t-xl hover:text-red-900 hover:bg-gradient-to-r hover:from-red-200 hover:via-red-400 hover:to-red-600">
                    <span className="text-lg font-semibold">{displayName}</span>
                    <Avatar size="sm" />
                  </div>
                
                  <div className="p-2 space-y-0.5">
                      <div className={menuItemClasses}>
                          <svg className="h-5 w-5 text-gray-500 group-hover:text-red-900 transition-colors" viewBox="0 0 484.8 484.8" xmlns="http://www.w3.org/2000/svg">
                            <path style={{fill: '#9E5523'}} d="M482.4,458.4c0,12.8-10.4,23.2-23.2,23.2H25.6c-12.8-0.8-23.2-11.2-23.2-23.2V116.8 c0-12.8,10.4-23.2,23.2-23.2h433.6c12.8,0,23.2,10.4,23.2,23.2L482.4,458.4L482.4,458.4z"/>
                            <path style={{fill: '#442B1B'}} d="M482.4,461.6c0,12.8-10.4,23.2-23.2,23.2H25.6c-12.8,0-23.2-10.4-23.2-23.2V120.8 c0-12.8,10.4-23.2,23.2-23.2h433.6c12.8,0,23.2,10.4,23.2,23.2L482.4,461.6L482.4,461.6z"/>
                            <polygon style={{fill: '#7EAF8A'}} points="395.2,0 2.4,100.8 2.4,215.2 24.8,303.2 445.6,195.2 "/>
                            <polygon style={{fill: '#578C65'}} points="376.8,31.2 2.4,128 2.4,236.8 24,320.8 424.8,217.6 "/>
                            <polyline style={{fill: '#43754F'}} points="424.8,217.6 376.8,31.2 185.6,81.6 2.4,236.8 "/>
                            <path style={{fill: '#914D1F'}} d="M2.4,131.2v330.4c0,12.8,10.4,23.2,23.2,23.2h433.6c12.8,0,23.2-10.4,23.2-23.2V131.2H2.4z"/>
                            <path style={{fill: '#844419'}} d="M459.2,484.8c12.8,0,23.2-10.4,23.2-23.2V131.2H2.4"/>
                            <polygon style={{opacity: 0.3, fill: '#9E5523'}} points="482.4,193.6 449.6,160 424,165.6 404.8,242.4 444.8,255.2 482.4,244.8 "/>
                            <path style={{fill: '#0093F7'}} d="M453.6,374.4c0,8.8-7.2,16.8-16.8,16.8H48c-8.8,0-16.8-7.2-16.8-16.8V169.6c0-8.8,7.2-16.8,16.8-16.8 h388.8c8.8,0,16.8,7.2,16.8,16.8L453.6,374.4L453.6,374.4z"/>
                            <path style={{fill: '#0580E5'}} d="M31.2,169.6c0-8.8,7.2-16.8,16.8-16.8h388.8c8.8,0,16.8,7.2,16.8,16.8v204c0,8.8-7.2,16.8-16.8,16.8"/>
                            <path style={{fill: '#24D1FF'}} d="M31.2,169.6c0-8.8,7.2-16.8,16.8-16.8h388.8c8.8,0,16.8,7.2,16.8,16.8"/>
                            <path style={{fill: '#AA5D29'}} d="M2.4,198.4v263.2c0,12.8,10.4,23.2,23.2,23.2h433.6c12.8,0,23.2-10.4,23.2-23.2V198.4H2.4z"/>
                            <path style={{fill: '#9E5523'}} d="M459.2,484.8c12.8,0,23.2-10.4,23.2-23.2V198.4H2.4"/>
                            <polygon style={{opacity: 0.3, fill: '#9E5523'}} points="482.4,263.2 449.6,230.4 424,236 404.8,312 444.8,325.6 482.4,315.2 "/>
                            <path style={{fill: '#12DB55'}} d="M453.6,444.8c0,8.8-7.2,16.8-16.8,16.8H48c-8.8,0-16.8-7.2-16.8-16.8V240c0-8.8,7.2-16.8,16.8-16.8 h388.8c8.8,0,16.8,7.2,16.8,16.8L453.6,444.8L453.6,444.8z"/>
                            <path style={{fill: '#10C146'}} d="M31.2,240c0-8.8,7.2-16.8,16.8-16.8h388.8c8.8,0,16.8,7.2,16.8,16.8v204c0,8.8-7.2,16.8-16.8,16.8"/>
                            <path style={{fill: '#29EF66'}} d="M31.2,240c0-8.8,7.2-16.8,16.8-16.8h388.8c8.8,0,16.8,7.2,16.8,16.8"/>
                            <path style={{fill: '#B56823'}} d="M2.4,267.2v194.4c0,12.8,10.4,23.2,23.2,23.2h433.6c12.8,0,23.2-10.4,23.2-23.2V267.2H2.4z"/>
                            <path style={{fill: '#A85E20'}} d="M31.2,267.2V444c0,8.8,7.2,16.8,16.8,16.8h388.8c8.8,0,16.8-7.2,16.8-16.8V267.2H31.2z"/>
                            <rect x="2.4" y="198.4" style={{fill: '#C67634'}} width="480" height="2.4"/>
                            <rect x="2.4" y="131.2" style={{fill: '#C67634'}} width="480" height="2.4"/>
                            <rect x="2.4" y="267.2" style={{fill: '#C67634'}} width="480" height="2.4"/>
                            <path style={{fill: '#D39754'}} d="M30.4,475.2h-7.2c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h7.2c0.8,0,1.6,0.8,1.6,1.6 S31.2,475.2,30.4,475.2z"/>
                            <path style={{fill: '#D39754'}} d="M440.8,475.2h-13.6c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h13.6c0.8,0,1.6,0.8,1.6,1.6 S441.6,475.2,440.8,475.2z M413.6,475.2H400c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h13.6c0.8,0,1.6,0.8,1.6,1.6 C415.2,474.4,414.4,475.2,413.6,475.2z M386.4,475.2h-13.6c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h13.6 c0.8,0,1.6,0.8,1.6,1.6S387.2,475.2,386.4,475.2z M358.4,475.2h-13.6c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h13.6 c0.8,0,1.6,0.8,1.6,1.6C360.8,474.4,360,475.2,358.4,475.2z M331.2,475.2h-13.6c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h13.6 c0.8,0,1.6,0.8,1.6,1.6S332,475.2,331.2,475.2z M304,475.2h-13.6c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6H304 c0.8,0,1.6,0.8,1.6,1.6S304.8,475.2,304,475.2z M276.8,475.2h-13.6c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h13.6 c0.8,0,1.6,0.8,1.6,1.6S277.6,475.2,276.8,475.2z M249.6,475.2H236c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h13.6 c0.8,0,1.6,0.8,1.6,1.6C251.2,474.4,250.4,475.2,249.6,475.2z M221.6,475.2H208c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h13.6 c0.8,0,1.6,0.8,1.6,1.6C224,474.4,223.2,475.2,221.6,475.2z M194.4,475.2h-13.6c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h13.6 c0.8,0,1.6,0.8,1.6,1.6S195.2,475.2,194.4,475.2z M167.2,475.2h-13.6c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h13.6 c0.8,0,1.6,0.8,1.6,1.6C168.8,474.4,168,475.2,167.2,475.2z M140,475.2h-13.6c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6H140 c0.8,0,1.6,0.8,1.6,1.6C141.6,474.4,140.8,475.2,140,475.2z M112.8,475.2H98.4c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6H112 c0.8,0,1.6,0.8,1.6,1.6C114.4,474.4,113.6,475.2,112.8,475.2z M84.8,475.2H71.2c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h13.6 c0.8,0,1.6,0.8,1.6,1.6C87.2,474.4,85.6,475.2,84.8,475.2z M57.6,475.2H44c-0.8,0-1.6-0.8-1.6-1.6s0.8-1.6,1.6-1.6h13.6 c0.8,0,1.6,0.8,1.6,1.6C59.2,474.4,58.4,475.2,57.6,475.2z"/>
                            <path style={{fill: '#D39754'}} d="M461.6,475.2h-7.2c-0.8,0-1.6-0.8-1.6-1.6c0-0.8,0.8-1.6,1.6-1.6h7.2c0.8,0,1.6,0.8,1.6,1.6 C463.2,474.4,462.4,475.2,461.6,475.2z"/>
                          </svg>
                          <span className="text-sm font-medium">Wallet: $0.00</span>
                      </div>
                      <div className={menuItemClasses}>
                          <svg viewBox="0 0 1024 1024" className="h-5 w-5 text-gray-500 group-hover:text-red-900 transition-colors" xmlns="http://www.w3.org/2000/svg">
                            <path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#F44336"/>
                            <path d="M512 234.666667l83.2 168.533333 185.6 27.733333-134.4 130.133334 32 185.6-166.4-87.466667-166.4 87.466667 32-185.6-134.4-130.133334 185.6-27.733333z" fill="#FFCA28"/>
                          </svg>
                          <span className="text-sm font-medium">Points: 0</span>
                      </div>

                      <Separator className="my-1" />

                      <div className={menuItemClasses}>
                          <svg viewBox="0 0 512.001 512.001" className="h-5 w-5 text-gray-700 group-hover:text-red-900 transition-colors" xmlns="http://www.w3.org/2000/svg">
                            <polygon style={{fill: '#F4B2B0'}} points="154.503,390.752 122.717,269.008 188.572,305.952 256,200.449 323.428,305.952 389.283,269.008 357.497,390.752 "/>
                            <path style={{fill: '#B3404A'}} d="M357.497,402.885H154.503c-5.521,0-10.345-3.726-11.74-9.068l-31.786-121.744 c-1.229-4.708,0.473-9.696,4.324-12.669c3.853-2.974,9.109-3.357,13.351-0.978l55.864,31.34l61.26-95.85 c2.229-3.488,6.083-5.599,10.223-5.599s7.994,2.111,10.223,5.599l61.26,95.85l55.864-31.34c4.243-2.381,9.499-1.996,13.351,0.978 c3.852,2.974,5.553,7.962,4.324,12.669l-31.786,121.744C367.842,399.158,363.017,402.885,357.497,402.885z M163.875,378.619h184.249 l22.212-85.07l-40.972,22.985c-5.605,3.146-12.696,1.371-16.159-4.048L256,222.98l-57.205,89.507 c-3.463,5.419-10.55,7.195-16.159,4.048l-40.972-22.985L163.875,378.619z"/>
                            <circle style={{fill: '#F4B2B0'}} cx="255.995" cy="110.326" r="37.612"/>
                            <circle style={{fill: '#F4B2B0'}} cx="462.257" cy="189.603" r="37.612"/>
                            <circle style={{fill: '#F4B2B0'}} cx="49.745" cy="189.603" r="37.612"/>
                            <path style={{fill: '#B3404A'}} d="M462.255,139.853c-27.429,0-49.745,22.316-49.745,49.745c0,1.121,0.051,2.229,0.124,3.332 l-67.098,34.965l-53.353-83.48c8.398-8.911,13.562-20.903,13.562-34.085c0-27.429-22.316-49.745-49.745-49.745 s-49.745,22.316-49.745,49.745c0,13.183,5.164,25.175,13.562,34.085l-59.334,92.84c-3.61,5.647-1.957,13.149,3.69,16.758 c5.646,3.607,13.149,1.956,16.757-3.69l59.314-92.806c0.167,0.056,0.339,0.103,0.507,0.158c0.323,0.104,0.647,0.205,0.972,0.302 c0.347,0.103,0.695,0.201,1.045,0.297c0.415,0.115,0.831,0.228,1.251,0.332c0.109,0.027,0.22,0.051,0.33,0.076 c3.741,0.901,7.64,1.392,11.654,1.392c4.014,0,7.912-0.49,11.653-1.392c0.11-0.027,0.222-0.05,0.332-0.076 c0.419-0.104,0.835-0.217,1.25-0.332c0.349-0.096,0.698-0.194,1.045-0.297c0.325-0.097,0.649-0.198,0.972-0.302 c0.169-0.055,0.34-0.102,0.507-0.158l59.314,92.806c2.3,3.6,6.211,5.601,10.232,5.601c1.895,0,3.813-0.444,5.598-1.375 l73.41-38.255c8.843,13.845,24.333,23.052,41.944,23.052c27.429,0,49.745-22.316,49.745-49.745S489.685,139.853,462.255,139.853z M256,84.85c14.049,0,25.479,11.429,25.479,25.479c0,9.659-5.403,18.079-13.344,22.399c-0.001,0-0.002,0.001-0.004,0.001 c-0.643,0.349-1.309,0.662-1.984,0.957c-0.2,0.087-0.403,0.167-0.604,0.249c-0.519,0.211-1.048,0.404-1.583,0.581 c-0.193,0.063-0.383,0.132-0.579,0.192c-0.698,0.211-1.406,0.397-2.127,0.548c-0.164,0.034-0.329,0.057-0.493,0.089 c-0.593,0.113-1.194,0.205-1.801,0.275c-0.217,0.025-0.434,0.05-0.654,0.07c-0.761,0.069-1.529,0.116-2.308,0.116 s-1.546-0.049-2.308-0.116c-0.218-0.019-0.436-0.045-0.654-0.07c-0.607-0.07-1.207-0.163-1.801-0.275 c-0.164-0.032-0.329-0.055-0.493-0.089c-0.721-0.152-1.43-0.337-2.128-0.548c-0.193-0.058-0.383-0.127-0.575-0.19 c-0.537-0.177-1.068-0.371-1.589-0.582c-0.2-0.081-0.4-0.16-0.598-0.246c-9.012-3.93-15.334-12.916-15.334-23.36 C230.521,96.279,241.951,84.85,256,84.85z M462.255,215.078c-14.049,0-25.479-11.429-25.479-25.479 c0-14.05,11.431-25.479,25.479-25.479s25.479,11.429,25.479,25.479C487.734,203.648,476.303,215.078,462.255,215.078z"/>
                            <path style={{fill: '#B3404A'}} d="M427.098,316.289c-6.475-1.691-13.112,2.19-14.805,8.674L385.612,427.15H126.39L75.477,232.157 c14.384-8.73,24.014-24.54,24.014-42.559c0-27.429-22.316-49.745-49.745-49.745S0,162.169,0,189.598s22.316,49.745,49.745,49.745 c0.842,0,1.679-0.022,2.512-0.063l53.02,203.068c1.394,5.341,6.219,9.068,11.74,9.068h277.968c5.521,0,10.345-3.726,11.74-9.068 l29.048-111.255C437.465,324.61,433.581,317.983,427.098,316.289z M24.266,189.598c0-14.05,11.431-25.479,25.479-25.479 s25.479,11.429,25.479,25.479c0,14.05-11.431,25.479-25.479,25.479S24.266,203.648,24.266,189.598z"/>
                          </svg>
                          <span className="text-sm font-medium">Upgrade To Pro</span>
                      </div>
                      <div className={menuItemClasses}>
                          <svg viewBox="0 0 48 48" className="h-5 w-5 text-gray-700 group-hover:text-red-900 transition-colors" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#90CAF9" d="M17.4,33H15v-4h4l0.4,1.5C19.7,31.8,18.7,33,17.4,33z"/>
                            <path fill="#90CAF9" d="M37,36c0,0-11.8-7-18-7V15c5.8,0,18-7,18-7V36z"/>
                            <circle fill="#283593" cx="9" cy="22" r="5"/>
                            <path fill="#283593" d="M40,19h-3v6h3c1.7,0,3-1.3,3-3S41.7,19,40,19z"/>
                            <path fill="#283593" d="M18.6,41.2c-0.9,0.6-2.5,1.2-4.6,1.4c-0.6,0.1-1.2-0.3-1.4-1L8.2,27.9c0,0,8.8-6.2,8.8,1.1 c0,5.5,1.5,8.4,2.2,9.5c0.5,0.7,0.5,1.6,0,2.3C19,41,18.8,41.1,18.6,41.2z"/>
                            <path fill="#3F51B5" d="M9,29h10V15H9c-1.1,0-2,0.9-2,2v10C7,28.1,7.9,29,9,29z"/>
                            <path fill="#42A5F5" d="M38,38L38,38c-1.1,0-2-0.9-2-2V8c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2v28C40,37.1,39.1,38,38,38z"/>
                          </svg>
                          <span className="text-sm font-medium">Advertising</span>
                      </div>
                      
                      <Separator className="my-1" />

                      <div onClick={() => handleLinkClick('/profile/settings')} className={menuItemClasses}>
                          <svg viewBox="0 0 1024 1024" className="h-5 w-5 text-gray-700 group-hover:text-red-900 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                            <path d="M539.4 550.9m-164.7 0a164.7 164.7 0 1 0 329.4 0 164.7 164.7 0 1 0-329.4 0Z" fill="#FFB89A"/>
                            <path d="M679.3 405.4c-8.9-14-27.4-18.2-41.4-9.3-14 8.9-18.2 27.4-9.3 41.4 14 22.1 21.4 47.7 21.4 74 0 16.6 13.4 30 30 30s30-13.4 30-30c0-37.7-10.6-74.4-30.7-106.1z" fill="#33CC99"/>
                            <path d="M607.4 611.4c-25.9 24.9-60 38.6-96 38.6-76.4 0-138.5-62.1-138.5-138.5S435 373 511.4 373c22.9 0 44.7 5.4 64.8 16 14.6 7.8 32.8 2.2 40.6-12.5 7.8-14.6 2.2-32.8-12.5-40.6-28.4-15.1-60.5-23-92.9-23-109.5 0-198.5 89.1-198.5 198.5C312.9 620.9 402 710 511.5 710c51.5 0 100.4-19.7 137.5-55.4 11.9-11.5 12.3-30.5 0.8-42.4-11.4-11.9-30.4-12.3-42.4-0.8z" fill="#33CC99"/>
                            <path d="M853.7 370.4c-17.4-42.2-14.2-90.5 7.7-138.6a448.25 448.25 0 0 0-68.7-69c-48.2 21.8-96.6 24.9-138.8 7.4-42.3-17.6-74.3-54.2-92.8-104-16.4-1.8-33-2.7-49.8-2.7-15.9 0-31.6 0.8-47.1 2.5-18.7 49.8-50.7 86.4-93.1 104-42.5 17.6-91.2 14.1-139.7-8.2-25.2 20.2-48.1 43-68.4 68.1 22.3 48.6 25.6 97.3 7.9 139.9-17.7 42.6-54.6 74.6-104.9 93.1-1.7 16-2.6 32.3-2.6 48.7 0 16.1 0.9 32 2.5 47.6 50.2 18.6 87.1 50.8 104.7 93.4 17.6 42.6 14.1 91.3-8.2 139.9 20.2 25.1 43.1 48 68.3 68.3 48.6-22.2 97.3-25.5 139.8-7.8 42.4 17.6 74.3 54.3 92.9 104.2 15.8 1.7 31.9 2.6 48.2 2.6 16.5 0 32.7-0.9 48.7-2.6 18.7-49.8 50.7-86.3 93.1-103.8 42.2-17.4 90.6-14.2 138.8 7.7 25.4-20.4 48.5-43.5 68.9-68.9-21.8-48.2-24.9-96.5-7.3-138.7 17.5-42.1 53.9-74 103.3-92.5 1.8-16.2 2.7-32.7 2.7-49.3 0-16.3-0.9-32.4-2.6-48.2-49.8-19-86-50.9-103.5-93.1zM798 630.3c-21.8 52.5-21 110.8 0.6 168.3-57.5-21.7-115.8-22.7-168.3-1-52.6 21.7-93.2 63.5-118.6 119.4-25.3-56-65.8-97.9-118.3-119.7-25.8-10.7-53.1-16-80.9-16-28.8 0-58.2 5.6-87.4 16.6 21.7-57.5 22.7-115.8 1-168.3-21.7-52.6-63.5-93.2-119.4-118.6 56-25.3 97.9-65.8 119.7-118.3 21.8-52.5 21-110.8-0.6-168.3 29.4 11.1 59 16.8 87.9 16.8 27.7 0 54.7-5.2 80.4-15.8 52.6-21.7 93.2-63.5 118.6-119.4 25.3 56 65.8 97.9 118.3 119.7 52.5 21.8 110.8 21 168.3-0.6-21.7 57.5-22.7 115.8-1 168.3C820 446 861.8 486.6 917.7 512c-56 25.2-97.9 65.7-119.7 118.3z" fill="#45484C"/>
                          </svg>
                          <span className="text-sm font-medium">Redakto</span>
                      </div>
                      <div onClick={() => handleLinkClick('/settings')} className={menuItemClasses}>
                          <Settings className="h-5 w-5 text-gray-700 group-hover:text-red-900 transition-colors" />
                          <span className="text-sm font-medium">General Setting</span>
                      </div>
                      <div className={menuItemClasses}>
                          <svg height="200px" width="200px" viewBox="0 0 512.001 512.001" className="h-5 w-5 text-gray-700 group-hover:text-red-900 transition-colors" xmlns="http://www.w3.org/2000/svg">
                            <path style={{fill: '#CAD1D8'}} d="M24,16h464c13.254,0,24,10.745,24,24v432c0,13.254-10.745,24-24,24H24C10.745,496,0,485.255,0,472V40 C0,26.745,10.745,16,24,16z"/>
                            <circle style={{fill: '#9BA7AF'}} cx="24.002" cy="47.995" r="7.998"/>
                            <circle style={{fill: '#9BA7AF'}} cx="56.002" cy="47.995" r="7.998"/>
                            <circle style={{fill: '#9BA7AF'}} cx="88.002" cy="47.995" r="7.998"/>
                            <path style={{fill: '#FFFFFF'}} d="M24,80h464c4.418,0,8,3.582,8,8v384c0,4.418-3.582,8-8,8H24c-4.418,0-8-3.582-8-8V88 C16,83.582,19.582,80,24,80z"/>
                            <path style={{fill: '#E2E5E7'}} d="M120,40h368c4.418,0,8,3.582,8,8l0,0c0,4.418-3.582,8-8,8H120c-4.418,0-8-3.582-8-8l0,0 C112,43.582,115.582,40,120,40z"/>
                            <path style={{fill: '#CAD1D8'}} d="M224,168.001h224c4.418,0,8,3.582,8,8l0,0c0,4.418-3.582,8.001-8,8.001H224 c-4.418,0-8.001-3.582-8.001-8.001l0,0C216.001,171.582,219.582,168.001,224,168.001z"/>
                            <path style={{fill: '#CAD1D8'}} d="M224,232.001h176c4.418,0,8,3.582,8,8l0,0c0,4.418-3.582,8.001-8,8.001H224 c-4.418,0-8.001-3.582-8.001-8.001l0,0C216.001,235.582,219.582,232.001,224,232.001z"/>
                            <path style={{fill: '#CAD1D8'}} d="M224,200.001h136c4.418,0,8,3.582,8,8l0,0c0,4.418-3.582,8.001-8,8.001H224 c-4.418,0-8.001-3.582-8.001-8.001l0,0C216.001,203.582,219.582,200.001,224,200.001z"/>
                            <path style={{fill: '#595A66'}} d="M272,144L272,144c0,4.418-3.582,8.001-8,8.001h-40c-4.418,0-8.001-3.582-8.001-8.001l0,0 c0-4.418,3.582-8.001,8.001-8.001h40C268.418,136.001,272,139.582,272,144z"/>
                            <path style={{fill: '#CAD1D8'}} d="M64,336h224c4.418,0,8,3.582,8,8l0,0c0,4.418-3.582,8-8,8H64c-4.418,0-8-3.582-8-8l0,0 C56,339.582,59.582,336,64,336z"/>
                            <path style={{fill: '#CAD1D8'}} d="M64,400h176c4.418,0,8.001,3.582,8.001,8l0,0c0,4.418-3.582,8-8.001,8H64c-4.418,0-8-3.582-8-8l0,0 C56,403.582,59.582,400,64,400z"/>
                            <path style={{fill: '#CAD1D8'}} d="M64,368h136.001c4.418,0,8,3.582,8,8l0,0c0,4.418-3.582,8-8,8H64c-4.418,0-8-3.582-8-8l0,0 C56,371.582,59.582,368,64,368z"/>
                            <path style={{fill: '#595A66'}} d="M112,312L112,312c0,4.418-3.582,8-8.001,8H64c-4.418,0-8-3.582-8-8l0,0c0-4.418,3.582-8,8-8h40 C108.418,304,112,307.582,112,312z"/>
                            <path style={{fill: '#ABE1FA'}} d="M64,136.001h112c4.418,0,8.001,3.582,8.001,8v96c0,4.418-3.582,8.001-8.001,8.001H64 c-4.418,0-8-3.582-8-8.001v-96C56,139.582,59.582,136.001,64,136.001z"/>
                            <circle style={{fill: '#F19F35'}} cx="96" cy="160" r="7.998"/>
                            <path style={{fill: '#595A66'}} d="M184.001,240v-22.32l-36.24-36.24c-2.809-2.797-7.351-2.797-10.16,0l-66.56,66.56h104.96 C180.418,248.001,184.001,244.418,184.001,240z"/>
                            <path style={{fill: '#595A66'}} d="M65.6,196.8l-9.6,9.44v33.76c0,4.418,3.582,8.001,8,8.001h57.2l-44.8-51.2 c-2.63-2.983-7.18-3.267-10.163-0.638C66.012,196.361,65.799,196.574,65.6,196.8z"/>
                            <path style={{fill: '#35363E'}} d="M115.52,225.12c-4.304-4.906-11.392-6.257-17.2-3.28l22.88,26.16h14.32L115.52,225.12z"/>
                            <path style={{fill: '#6F707E'}} d="M142.864,189.813L142.864,189.813c1.562,1.562,1.562,4.095,0,5.657l-11.314,11.314 c-1.562,1.562-4.095,1.562-5.657,0l0,0c-1.562-1.562-1.562-4.095,0-5.657l11.314-11.314 C138.77,188.251,141.302,188.251,142.864,189.813z"/>
                            <path style={{fill: '#35363E'}} d="M184.001,217.68l-5.52-5.52c-1.988-1.988-5.212-1.988-7.2,0c-1.987,1.988-1.988,5.211,0,7.2l0,0 l4.16,4.16c4.011,4.041,6.952,9.018,8.56,14.48L184.001,217.68L184.001,217.68z"/>
                            <path style={{fill: '#6F707E'}} d="M70,203.12c-1.4-1.372-3.641-1.372-5.04,0L56,212v7.12c1.326,0.515,2.831,0.201,3.84-0.8L70,208 c1.372-1.4,1.372-3.641,0-5.04l0,0V203.12z"/>
                            <path style={{fill: '#ABE1FA'}} d="M336,304h112c4.418,0,8,3.582,8,8v96c0,4.418-3.582,8-8,8H336c-4.418,0-8-3.582-8-8v-96 C328,307.582,331.582,304,336,304z"/>
                            <circle style={{fill: '#F19F35'}} cx="367.995" cy="327.998" r="7.998"/>
                            <path style={{fill: '#595A66'}} d="M456,408v-22.32l-36.24-36.24c-2.809-2.797-7.351-2.797-10.16,0l-66.56,66.56H448 C452.418,416,456,412.418,456,408z"/>
                            <path style={{fill: '#595A66'}} d="M337.6,364.8l-9.6,9.44V408c0,4.418,3.582,8,8,8h57.2l-44.8-51.2 c-2.63-2.983-7.18-3.267-10.163-0.638C338.012,364.361,337.799,364.575,337.6,364.8z"/>
                            <path style={{fill: '#35363E'}} d="M387.52,393.12c-4.304-4.906-11.392-6.257-17.2-3.28l22.88,26.16h14.32L387.52,393.12z"/>
                            <path style={{fill: '#6F707E'}} d="M414.803,357.82L414.803,357.82c1.562,1.562,1.562,4.095,0,5.657L403.49,374.79 c-1.562,1.562-4.095,1.562-5.657,0l0,0c-1.562-1.562-1.562-4.095,0-5.657l11.314-11.314 C410.708,356.258,413.242,356.258,414.803,357.82z"/>
                            <path style={{fill: '#35363E'}} d="M456,385.68l-5.52-5.52c-1.988-1.988-5.212-1.988-7.2,0s-1.988,5.212,0,7.2l0,0l4.16,4.16 c4.011,4.041,6.952,9.018,8.56,14.48v-20.32H456z"/>
                            <path style={{fill: '#6F707E'}} d="M342,371.12c-1.4-1.372-3.641-1.372-5.04,0l-8.96,8.88v7.12c1.326,0.515,2.831,0.201,3.84-0.8 L342,376c1.372-1.4,1.372-3.641,0-5.04l0,0V371.12z"/>
                          </svg>
                          <span className="text-sm font-medium">Subscriptions</span>
                      </div>
                      {hasAdminAccess && (
                        <>
                          <Separator className="my-1" />
                          <div onClick={() => handleLinkClick('/admin/login')} className={`${menuItemClasses} ${isPlatformOwner ? 'bg-gradient-to-r from-yellow-50 to-red-50 border-2 border-red-300 shadow-sm' : 'bg-gradient-to-r from-purple-50 to-red-50 border border-red-200'}`}>
                              {isPlatformOwner ? (
                                <Crown className="h-5 w-5 text-red-600 group-hover:text-red-900 transition-colors" />
                              ) : isSuperAdmin ? (
                                <Crown className="h-5 w-5 text-red-600 group-hover:text-red-900 transition-colors" />
                              ) : (
                                <Shield className="h-5 w-5 text-blue-600 group-hover:text-red-900 transition-colors" />
                              )}
                              <div className="flex flex-col">
                                  <span className={`text-sm font-medium ${isPlatformOwner ? 'font-bold text-red-700' : ''}`}>
                                    {isPlatformOwner ? '🚀 Platform Owner' : 'Admin Area'}
                                  </span>
                                  <span className="text-xs text-red-600 font-semibold">
                                    {isPlatformOwner ? 'Admin Dashboard Access' : (isSuperAdmin ? '👑 Super Admin' : '🛡️ Admin')}
                                  </span>
                              </div>
                          </div>
                          <Separator className="my-1" />
                        </>
                      )}

                      <Separator className="my-1" />

                      <div onClick={handleLogout} className={menuItemClasses}>
                          <svg height="20" width="20" viewBox="0 0 503.808 503.808" className="h-5 w-5 text-gray-700 group-hover:text-red-900 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                            <g transform="translate(1 1)">
                              <path fill="#6f7171" d="M327.704,251.075v51.2v128c0,18.773-15.36,34.133-34.133,34.133h-153.6V37.741h153.6 c18.773,0,34.133,15.36,34.133,34.133V251.075z"/>
                              <path fill="#f99280" d="M139.971,37.741v426.667v8.533c0,18.773-13.653,29.867-29.867,23.893l-81.067-32.427 c-19.627-6.827-25.6-15.36-25.6-34.133v-358.4c0-18.773,6.827-27.307,25.6-34.133l81.067-32.427 c16.213-5.973,29.867,5.12,29.867,23.893V37.741z"/>
                            </g>
                            <path fill="#51565F" d="M119.637,503.808c-3.413,0-6.827-0.853-10.24-1.707L28.33,469.675 c-20.48-7.68-28.16-17.92-28.16-38.4v-358.4c0-20.48,7.68-30.72,28.16-38.4l81.067-32.427c8.533-3.413,17.067-2.56,23.893,2.56 c7.68,5.12,11.947,14.507,11.947,25.6v443.733c0,11.093-4.267,20.48-11.947,25.6C129.877,502.101,124.757,503.808,119.637,503.808z M119.637,8.875c-2.56,0-5.12,0.853-7.68,1.707L30.891,43.008c-17.92,6.827-23.04,13.653-23.04,29.867v358.4 c0,17.067,5.12,23.893,23.04,29.867l81.067,32.427c5.973,2.56,11.947,1.707,16.213-0.853c5.12-3.413,7.68-10.24,7.68-18.773V30.208 c0-8.533-2.56-15.36-7.68-18.773C126.464,9.728,123.051,8.875,119.637,8.875z M294.571,469.675H175.104 c-2.56,0-4.267-1.707-4.267-4.267c0-2.56,1.707-4.267,4.267-4.267h119.467c16.213,0,29.867-13.653,29.867-29.867v-128 c0-2.56,1.707-4.267,4.267-4.267s4.267,1.707,4.267,4.267v128C332.971,452.608,315.904,469.675,294.571,469.675z M414.037,341.675 c-0.853,0-2.56,0-3.413-0.853c-1.707-1.707-1.707-4.267,0-5.973l77.653-77.653H192.171c-2.56,0-4.267-1.707-4.267-4.267 c0-2.56,1.707-4.267,4.267-4.267h296.96l-77.653-77.653c-1.707-1.707-1.707-4.267,0-5.973c1.707-1.707,4.267-1.707,5.973,0 l85.333,85.333c0,0,0.853,0.853,0.853,1.707l0,0l0,0c0,0.853,0,0.853,0,1.707l0,0l0,0l0,0l0,0l0,0l0,0l0,0l0,0l0,0 c0,0.853,0,0.853,0,1.707l0,0l0,0c0,0.853-0.853,0.853-0.853,0.853l0,0l0,0l0,0l0,0l0,0l-85.333,85.333 C416.597,340.821,414.891,341.675,414.037,341.675z M106.837,281.941c-2.56,0-4.267-1.707-4.267-4.267v-51.2 c0-2.56,1.707-4.267,4.267-4.267s4.267,1.707,4.267,4.267v51.2C111.104,280.234,109.397,281.941,106.837,281.941z M328.704,205.141 c-2.56,0-4.267-1.707-4.267-4.267v-128c0-16.213-13.653-29.867-29.867-29.867h-120.32c-2.56,0-4.267-1.707-4.267-4.267 c0-2.56,1.707-4.267,4.267-4.267h120.32c21.333,0,38.4,17.067,38.4,38.4v128C332.971,203.434,331.264,205.141,328.704,205.141z"/>
                          </svg>
                          <span className="text-sm font-medium">Log Out</span>
                      </div>

                      <Separator className="my-1" />

                      <div className={menuItemJustifyBetweenClasses}>
                          <span className="text-sm font-medium">Switch Account</span>
                          <RefreshCw className="h-4 w-4 text-gray-600 group-hover:text-red-900 transition-colors" />
                      </div>
                      <div className={menuItemJustifyBetweenClasses}>
                          <span className="text-sm font-medium">Keyboard shortcuts</span>
                          <Command className="h-4 w-4 text-gray-600 group-hover:text-red-900 transition-colors" />
                      </div>
                      <div 
                        onClick={() => setShowQuickSettings(true)}
                        className={menuItemJustifyBetweenClasses}
                      >
                        <span className="text-sm font-medium">Settings and Privacy</span>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 group-hover:text-red-900 transition-colors">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path d="M18.48 18.5368H21M4.68 12L3 12.044M4.68 12C4.68 13.3255 5.75451 14.4 7.08 14.4C8.40548 14.4 9.48 13.3255 9.48 12C9.48 10.6745 8.40548 9.6 7.08 9.6C5.75451 9.6 4.68 10.6745 4.68 12ZM10.169 12.0441H21M12.801 5.55124L3 5.55124M21 5.55124H18.48M3 18.5368H12.801M17.88 18.6C17.88 19.9255 16.8055 21 15.48 21C14.1545 21 13.08 19.9255 13.08 18.6C13.08 17.2745 14.1545 16.2 15.48 16.2C16.8055 16.2 17.88 17.2745 17.88 18.6ZM17.88 5.4C17.88 6.72548 16.8055 7.8 15.48 7.8C14.1545 7.8 13.08 6.72548 13.08 5.4C13.08 4.07452 14.1545 3 15.48 3C16.8055 3 17.88 4.07452 17.88 5.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
                          </g>
                        </svg>
                      </div>
                  </div>
                </div>
                
                {/* Quick Settings Panel */}
                {showQuickSettings && (
                  <QuickSettingsPanel onBack={() => setShowQuickSettings(false)} />
                )}
              </div>
            </PopoverContent>
          </Popover>
          <TooltipContent side="top" sideOffset={10} align="end" alignOffset={-15} className="bg-neutral-800/85 text-white border-none px-3 py-1.5 text-sm rounded backdrop-blur-sm z-[100]">
            Llogaria
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>;
};
export default UserProfileDropdown;