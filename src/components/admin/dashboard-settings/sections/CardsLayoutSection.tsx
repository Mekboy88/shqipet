import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Eye, EyeOff } from "lucide-react";

interface CardsLayoutSectionProps {
  settings: any;
  updateSettings: (updates: any) => void;
}

const CardsLayoutSection: React.FC<CardsLayoutSectionProps> = ({
  settings,
  updateSettings
}) => {
  const availableCards = [
    { id: 'totalUsers', label: 'Total Users', description: 'User count and growth metrics' },
    { id: 'onlineUsers', label: 'Online Users', description: 'Currently active users' },
    { id: 'contentPosts', label: 'Content Posts', description: 'Posts, articles, and content metrics' },
    { id: 'comments', label: 'Comments', description: 'Comment activity and engagement' },
    { id: 'groups', label: 'Groups', description: 'Community groups and memberships' },
    { id: 'messages', label: 'Messages', description: 'Direct messages and conversations' },
    { id: 'revenue', label: 'Revenue', description: 'Financial metrics and billing' },
    { id: 'platformHealth', label: 'Platform Health', description: 'System status and performance' },
    { id: 'activityTrend', label: 'Activity Trend', description: 'User activity over time' },
    { id: 'userDistribution', label: 'User Distribution', description: 'Geographic and demographic data' },
  ];

  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  const densityOptions = [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
  ];

  const dateWindowOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  const toggleCardVisibility = (cardId: string) => {
    const currentCards = settings?.layout?.cards || [];
    const cardIndex = currentCards.findIndex((c: any) => c.id === cardId);
    
    let newCards;
    if (cardIndex >= 0) {
      newCards = [...currentCards];
      newCards[cardIndex] = { ...newCards[cardIndex], visible: !newCards[cardIndex].visible };
    } else {
      newCards = [...currentCards, { id: cardId, visible: true, size: 'medium', order: currentCards.length }];
    }

    updateSettings({
      layout: {
        ...settings?.layout,
        cards: newCards
      }
    });
  };

  const updateCardSize = (cardId: string, size: string) => {
    const currentCards = settings?.layout?.cards || [];
    const cardIndex = currentCards.findIndex((c: any) => c.id === cardId);
    
    if (cardIndex >= 0) {
      const newCards = [...currentCards];
      newCards[cardIndex] = { ...newCards[cardIndex], size };
      
      updateSettings({
        layout: {
          ...settings?.layout,
          cards: newCards
        }
      });
    }
  };

  const getCardSettings = (cardId: string) => {
    const currentCards = settings?.layout?.cards || [];
    return currentCards.find((c: any) => c.id === cardId) || { visible: false, size: 'medium', order: 0 };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Card Visibility</CardTitle>
          <CardDescription>Choose which cards to display on your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCards.map(card => {
              const cardSettings = getCardSettings(card.id);
              return (
                <div key={card.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    {cardSettings.visible ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium">{card.label}</div>
                      <div className="text-xs text-muted-foreground">{card.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {cardSettings.size}
                    </Badge>
                    <Switch
                      checked={cardSettings.visible}
                      onCheckedChange={() => toggleCardVisibility(card.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card Sizes</CardTitle>
          <CardDescription>Configure the size of each visible card</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {availableCards
              .filter(card => getCardSettings(card.id).visible)
              .map(card => (
                <div key={card.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="font-medium">{card.label}</Label>
                  <Select
                    value={getCardSettings(card.id).size}
                    onValueChange={(value) => updateCardSize(card.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sizeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout Settings</CardTitle>
          <CardDescription>Configure overall dashboard layout and defaults</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Layout Density</Label>
              <Select
                value={settings?.layout?.density || 'comfortable'}
                onValueChange={(value) => updateSettings({
                  layout: {
                    ...settings?.layout,
                    density: value
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {densityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Default Date Window</Label>
              <Select
                value={settings?.layout?.defaultDateWindow || '24h'}
                onValueChange={(value) => updateSettings({
                  layout: {
                    ...settings?.layout,
                    defaultDateWindow: value
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateWindowOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardsLayoutSection;