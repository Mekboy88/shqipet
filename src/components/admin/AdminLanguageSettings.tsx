import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Save, X, Languages, Check } from 'lucide-react';
import { useLanguageSettings, AdminLanguageSettings } from '@/hooks/useLanguageSettings';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EditingLanguage extends Partial<AdminLanguageSettings> {
  isNew?: boolean;
}

const AdminLanguageSettingsComponent: React.FC = () => {
  const { adminLanguages, fetchAdminLanguages, updateLanguageSettings, addLanguage, deleteLanguage } = useLanguageSettings();
  const { toast } = useToast();
  
  const [editingLanguage, setEditingLanguage] = useState<EditingLanguage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    fetchAdminLanguages();
  }, [fetchAdminLanguages]);

  const filteredLanguages = adminLanguages.filter(lang => 
    lang.language_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.native_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.language_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (language: AdminLanguageSettings) => {
    setEditingLanguage({ ...language });
  };

  const handleAddNew = () => {
    setEditingLanguage({
      isNew: true,
      language_code: '',
      language_name: '',
      native_name: '',
      flag_emoji: '',
      is_enabled: true,
      is_default: false,
      sort_order: Math.max(...adminLanguages.map(l => l.sort_order), 0) + 1
    });
  };

  const handleSave = async () => {
    if (!editingLanguage) return;

    // Validation
    if (!editingLanguage.language_code || !editingLanguage.language_name) {
      toast({
        title: 'Validation Error',
        description: 'Language code and name are required',
        variant: 'destructive',
      });
      return;
    }

    const success = editingLanguage.isNew
      ? await addLanguage({
          language_code: editingLanguage.language_code!,
          language_name: editingLanguage.language_name!,
          native_name: editingLanguage.native_name || null,
          flag_emoji: editingLanguage.flag_emoji || null,
          is_enabled: editingLanguage.is_enabled ?? true,
          is_default: editingLanguage.is_default ?? false,
          sort_order: editingLanguage.sort_order ?? 0
        } as any)
      : await updateLanguageSettings(editingLanguage.id!, {
          language_code: editingLanguage.language_code!,
          language_name: editingLanguage.language_name!,
          native_name: editingLanguage.native_name || null,
          flag_emoji: editingLanguage.flag_emoji || null,
          is_enabled: editingLanguage.is_enabled,
          is_default: editingLanguage.is_default,
          sort_order: editingLanguage.sort_order
        });

    if (success) {
      setEditingLanguage(null);
    }
  };

  const handleDelete = async (id: string, languageName: string) => {
    if (window.confirm(`Are you sure you want to delete ${languageName}? This action cannot be undone.`)) {
      await deleteLanguage(id);
    }
  };

  const handleSetDefault = async (language: AdminLanguageSettings) => {
    // First, remove default from all other languages
    const updates = adminLanguages
      .filter(l => l.is_default && l.id !== language.id)
      .map(l => updateLanguageSettings(l.id, { is_default: false }));
    
    await Promise.all(updates);
    
    // Then set this language as default
    await updateLanguageSettings(language.id, { is_default: true });
  };

  const handleCancel = () => {
    setEditingLanguage(null);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Languages className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Language Settings</h2>
              <p className="text-sm text-muted-foreground">
                Manage available languages for user selection
              </p>
            </div>
          </div>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Language
          </Button>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label>Search Languages</Label>
          <Input
            placeholder="Search by name, native name, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Editing Form */}
        {editingLanguage && (
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {editingLanguage.isNew ? 'Add New Language' : 'Edit Language'}
                </h3>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="flex items-center gap-1">
                    <Save className="w-3 h-3" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="w-3 h-3" />
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Language Code *</Label>
                  <Input
                    placeholder="e.g., en, sq, fr"
                    value={editingLanguage.language_code || ''}
                    onChange={(e) => setEditingLanguage({
                      ...editingLanguage,
                      language_code: e.target.value.toLowerCase()
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Language Name *</Label>
                  <Input
                    placeholder="e.g., English, Albanian"
                    value={editingLanguage.language_name || ''}
                    onChange={(e) => setEditingLanguage({
                      ...editingLanguage,
                      language_name: e.target.value
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Native Name</Label>
                  <Input
                    placeholder="e.g., English, Shqip"
                    value={editingLanguage.native_name || ''}
                    onChange={(e) => setEditingLanguage({
                      ...editingLanguage,
                      native_name: e.target.value
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Flag Emoji</Label>
                  <Input
                    placeholder="🇺🇸"
                    value={editingLanguage.flag_emoji || ''}
                    onChange={(e) => setEditingLanguage({
                      ...editingLanguage,
                      flag_emoji: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={editingLanguage.sort_order || 0}
                    onChange={(e) => setEditingLanguage({
                      ...editingLanguage,
                      sort_order: parseInt(e.target.value) || 0
                    })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={editingLanguage.is_enabled ?? true}
                    onCheckedChange={(checked) => setEditingLanguage({
                      ...editingLanguage,
                      is_enabled: checked
                    })}
                  />
                  <Label htmlFor="enabled">Enabled</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="default"
                    checked={editingLanguage.is_default ?? false}
                    onCheckedChange={(checked) => setEditingLanguage({
                      ...editingLanguage,
                      is_default: checked
                    })}
                  />
                  <Label htmlFor="default">Default Language</Label>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Languages List */}
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''} found
          </div>

          <div className="space-y-2">
            {filteredLanguages
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((language) => (
                <Card key={language.id} className={cn(
                  "p-4 transition-colors",
                  !language.is_enabled && "opacity-50 bg-muted/30"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{language.flag_emoji || '🌐'}</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {language.native_name || language.language_name}
                          </span>
                          {language.native_name && language.native_name !== language.language_name && (
                            <span className="text-sm text-muted-foreground">
                              ({language.language_name})
                            </span>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {language.language_code}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Sort: {language.sort_order}</span>
                          {language.is_default && (
                            <Badge variant="default" className="text-xs">
                              <Check className="w-3 h-3 mr-1" />
                              Default
                            </Badge>
                          )}
                          {!language.is_enabled && (
                            <Badge variant="destructive" className="text-xs">
                              Disabled
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {language.is_enabled && !language.is_default && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetDefault(language)}
                          className="text-xs"
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(language)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(language.id, language.language_name)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No languages found matching your search.
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
          <Card className="p-3">
            <div className="text-2xl font-bold text-primary">{adminLanguages.length}</div>
            <div className="text-xs text-muted-foreground">Total Languages</div>
          </Card>
          <Card className="p-3">
            <div className="text-2xl font-bold text-green-600">
              {adminLanguages.filter(l => l.is_enabled).length}
            </div>
            <div className="text-xs text-muted-foreground">Enabled</div>
          </Card>
          <Card className="p-3">
            <div className="text-2xl font-bold text-orange-600">
              {adminLanguages.filter(l => !l.is_enabled).length}
            </div>
            <div className="text-xs text-muted-foreground">Disabled</div>
          </Card>
          <Card className="p-3">
            <div className="text-2xl font-bold text-blue-600">
              {adminLanguages.filter(l => l.is_default).length}
            </div>
            <div className="text-xs text-muted-foreground">Default</div>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default AdminLanguageSettingsComponent;