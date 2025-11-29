import { useState, useEffect, useCallback } from 'react';

interface DraftFormOptions {
  formId: string;
  saveInterval?: number; // Auto-save interval in ms
  clearOnSubmit?: boolean;
  excludeFields?: string[]; // Fields to exclude from auto-save
}

interface FormData {
  [key: string]: any;
}

export const useDraftFormRestore = (options: DraftFormOptions) => {
  const {
    formId,
    saveInterval = 2000, // Save every 2 seconds
    clearOnSubmit = true,
    excludeFields = ['password', 'confirmPassword', 'token']
  } = options;

  const [formData, setFormData] = useState<FormData>({});
  const [isDrafted, setIsDrafted] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const storageKey = `draft_form_${formId}`;

  // Load draft from localStorage
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(storageKey);
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft.data || {});
        setIsDrafted(true);
        setLastSaved(new Date(parsedDraft.timestamp));
        return parsedDraft.data;
      }
    } catch (error) {
      console.warn('Failed to load form draft:', error);
    }
    return {};
  }, [storageKey]);

  // Save draft to localStorage
  const saveDraft = useCallback((data: FormData) => {
    try {
      // Filter out excluded fields
      const filteredData = Object.keys(data).reduce((acc, key) => {
        if (!excludeFields.includes(key) && data[key] !== '' && data[key] != null) {
          acc[key] = data[key];
        }
        return acc;
      }, {} as FormData);

      // Only save if there's actually data to save
      if (Object.keys(filteredData).length > 0) {
        const draftData = {
          data: filteredData,
          timestamp: new Date().toISOString(),
          formId
        };
        
        localStorage.setItem(storageKey, JSON.stringify(draftData));
        setLastSaved(new Date());
        setIsDrafted(true);
      }
    } catch (error) {
      console.warn('Failed to save form draft:', error);
    }
  }, [storageKey, excludeFields, formId]);

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setFormData({});
      setIsDrafted(false);
      setLastSaved(null);
    } catch (error) {
      console.warn('Failed to clear form draft:', error);
    }
  }, [storageKey]);

  // Update form data and trigger save
  const updateFormData = useCallback((newData: FormData) => {
    setFormData(newData);
    saveDraft(newData);
  }, [saveDraft]);

  // Update a single field
  const updateField = useCallback((fieldName: string, value: any) => {
    const newData = { ...formData, [fieldName]: value };
    updateFormData(newData);
  }, [formData, updateFormData]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (clearOnSubmit) {
      clearDraft();
    }
  }, [clearOnSubmit, clearDraft]);

  // Auto-save effect
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      const timeoutId = setTimeout(() => {
        saveDraft(formData);
      }, saveInterval);

      return () => clearTimeout(timeoutId);
    }
  }, [formData, saveDraft, saveInterval]);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (Object.keys(draft).length > 0) {
      setFormData(draft);
    }
  }, [loadDraft]);

  // Check if field has draft value
  const hasFieldDraft = useCallback((fieldName: string) => {
    return fieldName in formData && formData[fieldName] !== '';
  }, [formData]);

  // Get field draft value
  const getFieldDraft = useCallback((fieldName: string) => {
    return formData[fieldName] || '';
  }, [formData]);

  // Get draft age
  const getDraftAge = useCallback(() => {
    if (!lastSaved) return null;
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }, [lastSaved]);

  return {
    formData,
    isDrafted,
    lastSaved,
    updateFormData,
    updateField,
    clearDraft,
    handleSubmit,
    hasFieldDraft,
    getFieldDraft,
    getDraftAge
  };
};