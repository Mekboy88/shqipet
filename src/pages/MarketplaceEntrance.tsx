import React, { useState } from "react";
import { Store, Users, Shield, BadgePercent, Sparkles, Truck, RefreshCw, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import wallpaperImage from "@/assets/marketplace-wallpaper.jpg";

export default function MarketplaceEntrance() {
  console.log("🐛 MarketplaceEntrance component rendering...");
  
  const navigate = useNavigate();
  const [mode, setMode] = useState<"new" | "used" | null>(null);

  const handleModeSelect = (selectedMode: "new" | "used") => {
    console.log("🐛 Mode selected:", selectedMode);
    navigate(selectedMode === 'new' ? '/marketplace/platform' : '/marketplace/users');
  };

  return (
    <div 
      className="min-h-screen bg-transparent text-foreground"
      style={{
        backgroundImage: `url(${wallpaperImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-muted grid place-items-center ring-1 ring-border">
              <Sparkles className="size-4" />
            </div>
            <span className="font-semibold tracking-tight">Shqipet Marketplace</span>
            <span className="ml-2 text-xs text-muted-foreground">(Preview)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl">Help</Button>
            <Button className="rounded-xl">
              <ShoppingCart className="mr-2 size-4" /> Cart
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Choose Your Marketplace</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Start in the platform-run store for factory-new items, or browse the community-driven users market for pre-loved goods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl border hover:shadow-sm transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="size-10 rounded-xl bg-muted grid place-items-center ring-1 ring-border">
                  <Store className="size-5" />
                </div>
                Platform Store (New)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc ml-5 space-y-1">
                <li>Everything brand new • sealed • full warranty</li>
                <li>Trusted logistics, returns & support</li>
                <li>Automatic price compare vs users market — shows the cheaper option</li>
              </ul>
              <div className="mt-4 flex items-center gap-2">
                <Badge icon={<Truck className="size-3" />}>Fast Delivery</Badge>
                <Badge icon={<BadgePercent className="size-3" />}>Verified Deals</Badge>
                <Badge icon={<Shield className="size-3" />}>Buyer Protection</Badge>
              </div>
              <div className="mt-6">
                <Button onClick={() => handleModeSelect("new")} className="rounded-xl w-full">Enter Platform Store</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border hover:shadow-sm transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="size-10 rounded-xl bg-muted grid place-items-center ring-1 ring-border">
                  <Users className="size-5" />
                </div>
                Users Market (Used)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc ml-5 space-y-1">
                <li>Community listings with condition & seller ratings</li>
                <li>Secure messaging and escrow-ready checkout (planned)</li>
                <li>Compare used price vs platform new price instantly</li>
              </ul>
              <div className="mt-4 flex items-center gap-2">
                <Badge icon={<RefreshCw className="size-3" />}>Sustainability</Badge>
                <Badge icon={<Star className="size-3" />}>Top Sellers</Badge>
              </div>
              <div className="mt-6">
                <Button onClick={() => handleModeSelect("used")} variant="outline" className="rounded-xl w-full">Enter Users Market</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-muted-foreground text-sm">
          <p>
            Tip: On product pages we display <span className="font-medium text-foreground">the cheaper option first</span> — whether new or used.
          </p>
        </div>
      </main>
    </div>
  );
}

function Badge({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
      {icon}
      {children}
    </span>
  );
}