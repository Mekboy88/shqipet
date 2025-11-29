import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Globe2, Clock3, DollarSign, ShieldCheck, UploadCloud } from 'lucide-react';

// Persistent navigation for Localization section
const NavButton: React.FC<{ to: string; active?: boolean; className: string; ariaLabel: string; icon: React.ReactNode; label: string; }> = ({ to, active, className, ariaLabel, icon, label }) => (
  <Button
    asChild
    variant="outline"
    className={`${className} rounded-xl px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 ${active ? 'border-2' : 'border'}`}
    aria-label={ariaLabel}
  >
    <Link to={to} className="flex items-center gap-2 h-full">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  </Button>
);

export default function LocalizationNav() {
  const { pathname } = useLocation();
  return (
    <div className="flex justify-center">
      <nav className="flex w-full flex-wrap gap-3 justify-center min-h-20 py-3" aria-label="Localization navigation">
        <NavButton
          to="/admin/localization/time"
          active={pathname.endsWith('/time')}
          className="bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border border-emerald-200"
          ariaLabel="Go to Time & Calendar settings"
          icon={<Clock3 className="h-5 w-5" />}
          label="Time & Calendar"
        />
        <NavButton
          to="/admin/localization/currency-settings"
          active={pathname.endsWith('/currency-settings')}
          className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border border-purple-200"
          ariaLabel="Go to Currency settings"
          icon={<DollarSign className="h-5 w-5" />}
          label="Currency & Rates"
        />
        <NavButton
          to="/admin/localization/privacy"
          active={pathname.endsWith('/privacy')}
          className="bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border border-amber-200"
          ariaLabel="Go to Privacy & Geolocation settings"
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Privacy & Geolocation"
        />
        <NavButton
          to="/admin/localization/import-export"
          active={pathname.endsWith('/import-export')}
          className="bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border border-rose-200"
          ariaLabel="Go to Import / Export"
          icon={<UploadCloud className="h-5 w-5" />}
          label="Import / Export"
        />
      </nav>
    </div>
  );
}
