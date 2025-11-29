
import { LucideIcon } from 'lucide-react';

export type ColorVariant = 
  | "navyWhite" | "charcoalBurgundy" | "blackGold" | "brownCream"
  | "midnightSilver" | "greenTan" | "slateRust" | "purpleGold"
  | "maroonBeige" | "navyOrange" | "forestGreen" | "royalBlue"
  | "burgundySilver" | "tealGold" | "oliveWhite" | "indigoSand"
  | "crimsonIvory";

export type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  colorVariant: ColorVariant;
  href?: string;
  submenu?: SubMenuItem[];
};

export type SubMenuItem = {
  id: string;
  label: string;
  href?: string;
  description?: string;
  icon?: LucideIcon;
  colorVariant?: ColorVariant;
  submenu?: {
    id: string;
    label: string;
    href: string;
  }[];
};
