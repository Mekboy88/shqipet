import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ShoppingCart, Heart, DollarSign, Zap, MapPin, Timer } from 'lucide-react';

export const MarketplaceDatingRealtime = () => {
  const [isActive, setIsActive] = useState(true);
  const [marketStats, setMarketStats] = useState({
    activeBids: 45,
    newMatches: 23,
    liveOffers: 78,
    proximityUpdates: 156
  });

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setMarketStats(prev => ({
        activeBids: prev.activeBids + Math.floor(Math.random() * 6) - 3,
        newMatches: prev.newMatches + Math.floor(Math.random() * 4) - 1,
        liveOffers: prev.liveOffers + Math.floor(Math.random() * 8) - 4,
        proximityUpdates: prev.proximityUpdates + Math.floor(Math.random() * 10) - 5
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const marketplaceBehaviors = [
    {
      icon: <DollarSign className="w-4 h-4" />,
      title: "Live Bidding Updates",
      description: "Real-time price increases and bid notifications",
      status: "active",
      latency: "< 50ms"
    },
    {
      icon: <ShoppingCart className="w-4 h-4" />,
      title: "Offer Display Sync",
      description: "Live marketplace offers and availability",
      status: "active",
      latency: "< 75ms"
    },
    {
      icon: <Heart className="w-4 h-4" />,
      title: "Match Notifications",
      description: "Instant swipe responses and match alerts",
      status: "active",
      latency: "< 100ms"
    },
    {
      icon: <Zap className="w-4 h-4" />,
      title: "Reaction Sync",
      description: "Heart, boost, and super-like reactions",
      status: "active",
      latency: "< 60ms"
    }
  ];

  const datingFeatures = [
    {
      icon: <MapPin className="w-4 h-4" />,
      title: "Proximity Updates",
      description: "Real-time location-based matching",
      status: "active",
      update: "Every 30s"
    },
    {
      icon: <Timer className="w-4 h-4" />,
      title: "Auction Countdown",
      description: "Live countdown timers for auctions",
      status: "active",
      update: "Real-time"
    }
  ];

  const integrationPoints = [
    "Marketplace socket stream per item_id",
    "Dating socket per user_pair_id",
    "Visual updates on proximity/location filters",
    "Auction countdown auto-sync",
    "Match visibility toggle (silent swipe mode)",
    "User proximity sync for geolocation",
    "Real-time inventory updates"
  ];

  const liveAuctions = [
    { item: "🎮 Gaming Setup", currentBid: "$1,250", timeLeft: "2h 15m", bidders: 8 },
    { item: "📱 iPhone 15 Pro", currentBid: "$899", timeLeft: "45m", bidders: 12 },
    { item: "🚗 Tesla Model 3", currentBid: "$35,000", timeLeft: "1d 3h", bidders: 23 },
    { item: "💍 Diamond Ring", currentBid: "$2,100", timeLeft: "6h 20m", bidders: 5 }
  ];

  const recentMatches = [
    { users: "Alex & Sarah", location: "2.1km away", time: "2 mins ago" },
    { users: "Mike & Emma", location: "850m away", time: "5 mins ago" },
    { users: "John & Lisa", location: "1.3km away", time: "8 mins ago" },
    { users: "David & Anna", location: "3.2km away", time: "12 mins ago" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            📦 Marketplace / Dating Real-Time System
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Live Trading</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Live Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Active Bids</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{marketStats.activeBids}</div>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-medium text-pink-800">New Matches</span>
              </div>
              <div className="text-2xl font-bold text-pink-900">{marketStats.newMatches}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Live Offers</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{marketStats.liveOffers}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Proximity Updates</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{marketStats.proximityUpdates}</div>
            </div>
          </div>

          {/* Live Auctions */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Live Auctions</h4>
            <div className="grid gap-3">
              {liveAuctions.map((auction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{auction.item}</div>
                    <div className="text-sm text-gray-600">{auction.bidders} bidders</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{auction.currentBid}</div>
                    <div className="text-sm text-gray-500">{auction.timeLeft}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Matches */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Recent Matches</h4>
            <div className="grid gap-3">
              {recentMatches.map((match, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-pink-50 border border-pink-100 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{match.users}</div>
                    <div className="text-sm text-pink-600">{match.location}</div>
                  </div>
                  <div className="text-sm text-gray-500">{match.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketplace Behaviors */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Real-Time Marketplace Behaviors</h4>
            <div className="grid gap-3">
              {marketplaceBehaviors.map((behavior, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-green-600">{behavior.icon}</div>
                    <div>
                      <div className="font-medium text-gray-800">{behavior.title}</div>
                      <div className="text-sm text-gray-600">{behavior.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <Badge variant="secondary" className="text-xs">
                      {behavior.latency}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dating Features */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Dating Features</h4>
            <div className="grid gap-3">
              {datingFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-pink-600">{feature.icon}</div>
                    <div>
                      <div className="font-medium text-gray-800">{feature.title}</div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.update}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Points */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-800">Integration Points</h4>
            <div className="grid gap-2">
              {integrationPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Monitor Auctions
            </Button>
            <Button size="sm" variant="outline">
              Track Matches
            </Button>
            <Button size="sm" variant="outline">
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};