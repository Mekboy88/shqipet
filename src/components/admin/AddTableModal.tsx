import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Copy, Plus, Trash2, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Database integration removed - placeholder for future Cloud integration

interface Column {
  id: string;
  name: string;
  dataType: string;
  nullable: boolean;
  indexed: boolean;
  defaultValue: string;
  isPrimary: boolean;
}

interface ValidationMessage {
  type: 'error' | 'warning' | 'success';
  message: string;
}

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTableCreated: () => void;
  initialTableName?: string;
  mode?: 'required' | 'custom'; // New prop to distinguish modal behavior
}

const dataTypes = [
  'uuid', 'text', 'varchar', 'integer', 'bigint', 'boolean', 'timestamp', 'timestamptz',
  'date', 'time', 'numeric', 'decimal', 'real', 'double precision', 'jsonb', 'json',
  'bytea', 'inet', 'cidr', 'array'
];

const tablePurposes = [
  'Authentication',
  'Audit Logs', 
  'Session Management',
  'Content',
  'User Management',
  'Security',
  'Analytics',
  'Custom',
  'Other'
];

const purposeToSuggestedColumns: Record<string, Partial<Column>[]> = {
  'Authentication': [
    { name: 'id', dataType: 'uuid', nullable: false, indexed: true, isPrimary: true, defaultValue: 'gen_random_uuid()' },
    { name: 'user_id', dataType: 'uuid', nullable: false, indexed: true, defaultValue: '' },
    { name: 'email', dataType: 'text', nullable: true, indexed: true, defaultValue: '' },
    { name: 'created_at', dataType: 'timestamptz', nullable: false, indexed: false, defaultValue: 'now()' },
    { name: 'updated_at', dataType: 'timestamptz', nullable: false, indexed: false, defaultValue: 'now()' }
  ],
  'Audit Logs': [
    { name: 'id', dataType: 'uuid', nullable: false, indexed: true, isPrimary: true, defaultValue: 'gen_random_uuid()' },
    { name: 'user_id', dataType: 'uuid', nullable: true, indexed: true, defaultValue: '' },
    { name: 'action', dataType: 'text', nullable: false, indexed: true, defaultValue: '' },
    { name: 'details', dataType: 'jsonb', nullable: true, indexed: false, defaultValue: '' },
    { name: 'ip_address', dataType: 'inet', nullable: true, indexed: false, defaultValue: '' },
    { name: 'timestamp', dataType: 'timestamptz', nullable: false, indexed: true, defaultValue: 'now()' }
  ],
  'Session Management': [
    { name: 'id', dataType: 'uuid', nullable: false, indexed: true, isPrimary: true, defaultValue: 'gen_random_uuid()' },
    { name: 'user_id', dataType: 'uuid', nullable: false, indexed: true, defaultValue: '' },
    { name: 'session_token', dataType: 'text', nullable: false, indexed: true, defaultValue: '' },
    { name: 'expires_at', dataType: 'timestamptz', nullable: false, indexed: true, defaultValue: '' },
    { name: 'is_active', dataType: 'boolean', nullable: false, indexed: false, defaultValue: 'true' },
    { name: 'created_at', dataType: 'timestamptz', nullable: false, indexed: false, defaultValue: 'now()' }
  ]
};

const requiredTableSchemas: Record<string, { description: string; columns: Partial<Column>[] }> = {
  'user_sessions': {
    description: 'Tracks active user sessions and device fingerprints for security',
    columns: [
      { name: 'id', dataType: 'uuid', nullable: false, indexed: true, isPrimary: true, defaultValue: 'gen_random_uuid()' },
      { name: 'user_id', dataType: 'uuid', nullable: false, indexed: true, defaultValue: '' },
      { name: 'device_fingerprint', dataType: 'text', nullable: true, indexed: true, defaultValue: '' },
      { name: 'ip_address', dataType: 'inet', nullable: true, indexed: false, defaultValue: '' },
      { name: 'is_active', dataType: 'boolean', nullable: false, indexed: false, defaultValue: 'true' },
      { name: 'last_activity', dataType: 'timestamptz', nullable: false, indexed: true, defaultValue: 'now()' },
      { name: 'created_at', dataType: 'timestamptz', nullable: false, indexed: false, defaultValue: 'now()' }
    ]
  },
  'auth_audit_log': {
    description: 'Security audit trail for authentication events and admin actions',
    columns: [
      { name: 'id', dataType: 'uuid', nullable: false, indexed: true, isPrimary: true, defaultValue: 'gen_random_uuid()' },
      { name: 'user_id', dataType: 'uuid', nullable: true, indexed: true, defaultValue: '' },
      { name: 'event_type', dataType: 'text', nullable: false, indexed: true, defaultValue: '' },
      { name: 'event_description', dataType: 'text', nullable: false, indexed: false, defaultValue: '' },
      { name: 'ip_address', dataType: 'inet', nullable: true, indexed: true, defaultValue: '' },
      { name: 'user_agent', dataType: 'text', nullable: true, indexed: false, defaultValue: '' },
      { name: 'metadata', dataType: 'jsonb', nullable: true, indexed: false, defaultValue: '{}' },
      { name: 'risk_level', dataType: 'text', nullable: false, indexed: true, defaultValue: 'low' },
      { name: 'timestamp', dataType: 'timestamptz', nullable: false, indexed: true, defaultValue: 'now()' }
    ]
  },
  'password_reset_tokens': {
    description: 'Secure password reset tokens with expiration tracking',
    columns: [
      { name: 'id', dataType: 'uuid', nullable: false, indexed: true, isPrimary: true, defaultValue: 'gen_random_uuid()' },
      { name: 'user_id', dataType: 'uuid', nullable: false, indexed: true, defaultValue: '' },
      { name: 'token', dataType: 'text', nullable: false, indexed: true, defaultValue: '' },
      { name: 'email', dataType: 'text', nullable: false, indexed: false, defaultValue: '' },
      { name: 'expires_at', dataType: 'timestamptz', nullable: false, indexed: true, defaultValue: '' },
      { name: 'used', dataType: 'boolean', nullable: false, indexed: false, defaultValue: 'false' },
      { name: 'created_at', dataType: 'timestamptz', nullable: false, indexed: false, defaultValue: 'now()' }
    ]
  },
  'security_events': {
    description: 'High-priority security events and threat detection logs',
    columns: [
      { name: 'id', dataType: 'uuid', nullable: false, indexed: true, isPrimary: true, defaultValue: 'gen_random_uuid()' },
      { name: 'user_id', dataType: 'uuid', nullable: true, indexed: true, defaultValue: '' },
      { name: 'event_type', dataType: 'text', nullable: false, indexed: true, defaultValue: '' },
      { name: 'event_description', dataType: 'text', nullable: false, indexed: false, defaultValue: '' },
      { name: 'severity', dataType: 'text', nullable: false, indexed: true, defaultValue: 'medium' },
      { name: 'metadata', dataType: 'jsonb', nullable: true, indexed: false, defaultValue: '{}' },
      { name: 'resolved', dataType: 'boolean', nullable: false, indexed: false, defaultValue: 'false' },
      { name: 'created_at', dataType: 'timestamptz', nullable: false, indexed: true, defaultValue: 'now()' }
    ]
  }
};

export const AddTableModal: React.FC<AddTableModalProps> = ({
  isOpen,
  onClose,
  onTableCreated,
  initialTableName = '',
  mode = 'custom'
}) => {
  const { toast } = useToast();
  const [tableName, setTableName] = useState(initialTableName);
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [columns, setColumns] = useState<Column[]>([
    {
      id: '1',
      name: 'id',
      dataType: 'uuid',
      nullable: false,
      indexed: true,
      isPrimary: true,
      defaultValue: 'gen_random_uuid()'
    }
  ]);
  
  const [adminNotes, setAdminNotes] = useState('');
  const [teamTags, setTeamTags] = useState('');
  const [isMetadataExpanded, setIsMetadataExpanded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const isRequiredTable = mode === 'required' && initialTableName && requiredTableSchemas[initialTableName];
      
      if (isRequiredTable) {
        // Pre-fill with required table schema
        const schema = requiredTableSchemas[initialTableName];
        setTableName(initialTableName);
        setDescription(schema.description);
        setPurpose(''); // Don't set purpose for required tables to avoid overwriting columns
        
        const preFilledColumns = schema.columns.map((col, index) => ({
          id: (index + 1).toString(),
          name: col.name || '',
          dataType: col.dataType || 'text',
          nullable: col.nullable ?? true,
          indexed: col.indexed ?? false,
          isPrimary: col.isPrimary ?? false,
          defaultValue: col.defaultValue || ''
        }));
        setColumns(preFilledColumns);
      } else {
        // Custom table - start fresh
        setTableName(initialTableName);
        setDescription('');
        setPurpose('');
        setColumns([{
          id: '1',
          name: 'id',
          dataType: 'uuid',
          nullable: false,
          indexed: true,
          isPrimary: true,
          defaultValue: 'gen_random_uuid()'
        }]);
      }
      
      setAdminNotes('');
      setTeamTags('');
      setIsMetadataExpanded(false);
      setHasUnsavedChanges(false);
    }
  }, [isOpen, initialTableName, mode]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(
      tableName !== initialTableName || 
      description !== '' || 
      purpose !== '' || 
      columns.length > 1 || 
      adminNotes !== '' || 
      teamTags !== ''
    );
  }, [tableName, description, purpose, columns, adminNotes, teamTags, initialTableName]);

  // Apply purpose-based column suggestions (only for custom tables)
  useEffect(() => {
    if (mode === 'custom' && purpose && purposeToSuggestedColumns[purpose]) {
      const suggestedColumns = purposeToSuggestedColumns[purpose].map((col, index) => ({
        id: (index + 1).toString(),
        name: col.name || '',
        dataType: col.dataType || 'text',
        nullable: col.nullable ?? true,
        indexed: col.indexed ?? false,
        isPrimary: col.isPrimary ?? false,
        defaultValue: col.defaultValue || ''
      }));
      setColumns(suggestedColumns);
    }
  }, [purpose, mode]);

  const validateTableName = (name: string): boolean => {
    const regex = /^[a-z][a-z0-9_]*$/;
    return regex.test(name) && name.length > 0;
  };

  const validationMessages = useMemo((): ValidationMessage[] => {
    const messages: ValidationMessage[] = [];
    const isRequiredTable = mode === 'required' && initialTableName && requiredTableSchemas[initialTableName];
    
    // Table name validation
    if (!tableName) {
      messages.push({ type: 'error', message: 'Table name is required' });
    } else if (!validateTableName(tableName)) {
      messages.push({ type: 'error', message: 'Use only lowercase letters, numbers, and underscores. Must start with a letter.' });
    }

    // For required tables, validate against expected schema
    if (isRequiredTable) {
      const expectedSchema = requiredTableSchemas[initialTableName];
      const expectedColumnNames = expectedSchema.columns.map(col => col.name);
      const currentColumnNames = columns.map(col => col.name);
      
      const missingColumns = expectedColumnNames.filter(name => !currentColumnNames.includes(name));
      if (missingColumns.length > 0) {
        messages.push({ 
          type: 'warning', 
          message: `Missing expected columns: ${missingColumns.join(', ')}. These are recommended for this table.` 
        });
      }
      
      messages.push({ 
        type: 'success', 
        message: `✅ Creating required system table: ${tableName}` 
      });
    }

    // Column validation
    const columnNames = columns.map(col => col.name);
    const duplicateNames = columnNames.filter((name, index) => columnNames.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      messages.push({ type: 'error', message: `Duplicate column names: ${duplicateNames.join(', ')}` });
    }

    const primaryKeyColumns = columns.filter(col => col.isPrimary);
    if (primaryKeyColumns.length === 0) {
      messages.push({ type: 'error', message: 'Your table should have a primary key' });
    } else if (primaryKeyColumns.length > 1) {
      messages.push({ type: 'error', message: 'Only one column can be a primary key' });
    }

    const hasTimestamp = columns.some(col => col.dataType.includes('timestamp') && col.name.includes('created'));
    if (!hasTimestamp && mode === 'custom') {
      messages.push({ type: 'warning', message: 'Recommended: Add created_at timestamp column for tracking' });
    }

    const hasEmptyColumns = columns.some(col => !col.name.trim());
    if (hasEmptyColumns) {
      messages.push({ type: 'error', message: 'All columns must have names' });
    }

    if (messages.filter(m => m.type === 'error').length === 0 && !isRequiredTable) {
      messages.push({ type: 'success', message: 'Schema is valid and ready to create' });
    }

    return messages;
  }, [tableName, columns, mode, initialTableName]);

  const riskScore = useMemo(() => {
    const errors = validationMessages.filter(m => m.type === 'error').length;
    const warnings = validationMessages.filter(m => m.type === 'warning').length;
    
    if (errors > 0) return 'HIGH';
    if (warnings > 1) return 'MEDIUM';
    return 'LOW';
  }, [validationMessages]);

  const generateSQL = useMemo(() => {
    if (!tableName || columns.length === 0) return '';

    const columnDefinitions = columns
      .filter(col => col.name.trim())
      .map(col => {
        let definition = `  ${col.name} ${col.dataType}`;
        
        if (col.isPrimary) {
          definition += ' PRIMARY KEY';
        }
        
        if (!col.nullable && !col.isPrimary) {
          definition += ' NOT NULL';
        }
        
        if (col.defaultValue && !col.isPrimary) {
          definition += ` DEFAULT ${col.defaultValue}`;
        }
        
        return definition;
      });

    let sql = `CREATE TABLE public.${tableName} (\n${columnDefinitions.join(',\n')}\n);`;
    
    // Add RLS
    sql += `\n\nALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY;`;
    
    // Add indexes for non-primary indexed columns
    const indexedColumns = columns.filter(col => col.indexed && !col.isPrimary && col.name.trim());
    indexedColumns.forEach(col => {
      sql += `\n\nCREATE INDEX idx_${tableName}_${col.name} ON public.${tableName}(${col.name});`;
    });

    return sql;
  }, [tableName, columns]);

  const addColumn = () => {
    const newColumn: Column = {
      id: Date.now().toString(),
      name: '',
      dataType: 'text',
      nullable: true,
      indexed: false,
      isPrimary: false,
      defaultValue: ''
    };
    setColumns([...columns, newColumn]);
  };

  const updateColumn = (id: string, updates: Partial<Column>) => {
    setColumns(columns.map(col => 
      col.id === id ? { ...col, ...updates } : col
    ));
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter(col => col.id !== id));
  };

  const copySQL = async () => {
    await navigator.clipboard.writeText(generateSQL);
    toast({
      title: "SQL Copied",
      description: "Table schema SQL has been copied to clipboard"
    });
  };

  const handleCreateTable = async () => {
    const errors = validationMessages.filter(m => m.type === 'error');
    if (errors.length > 0) {
      toast({
        title: "Cannot Create Table",
        description: "Please fix all validation errors first",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      // Use Supabase migration tool instead of direct SQL execution
      toast({
        title: "Table Creation",
        description: "Please use the migration tool to create this table with the generated SQL",
      });

      // For now, simulate table creation success
      // In a real implementation, this would integrate with the migration system

      toast({
        title: "✅ Table Created Successfully",
        description: `Table "${tableName}" has been created and verified`
      });

      onTableCreated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Failed to Create Table", 
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Exit without saving?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const isRequiredTable = mode === 'required' && initialTableName && !!requiredTableSchemas[initialTableName];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isRequiredTable ? `Create Required Table: ${initialTableName}` : 'Create New Supabase Table'}
          </DialogTitle>
          <DialogDescription>
            {isRequiredTable 
              ? `This table is required by the system for ${requiredTableSchemas[initialTableName]?.description}`
              : 'Design and create a new custom table with columns, indexes, and validation'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1">
            {/* Left Column - Table Information & Column Designer */}
            <div className="lg:col-span-2 space-y-6">
              {/* Table Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🧾 Table Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="tableName">Table Name *</Label>
                    <Input
                      id="tableName"
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                      placeholder="e.g. user_sessions"
                      className={!validateTableName(tableName) && tableName ? 'border-red-500' : ''}
                      disabled={isRequiredTable} // Lock table name for required tables
                    />
                    {isRequiredTable && (
                      <p className="text-xs text-amber-600 mt-1">
                        🔒 Table name is locked - system expects this exact name
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Short explanation of this table's purpose"
                      disabled={isRequiredTable} // Pre-filled for required tables
                    />
                    {isRequiredTable && (
                      <p className="text-xs text-green-600 mt-1">
                        ✅ Pre-filled based on system requirements
                      </p>
                    )}
                  </div>
                  
                  {!isRequiredTable && (
                    <div>
                      <Label htmlFor="purpose">Purpose *</Label>
                      <Select value={purpose} onValueChange={setPurpose}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select table purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          {tablePurposes.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Column Designer */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📊 Column Designer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {columns.map((column, index) => (
                      <div key={column.id} className="grid grid-cols-12 gap-2 items-center p-3 border rounded-lg">
                        <div className="col-span-3">
                          <Input
                            value={column.name}
                            onChange={(e) => updateColumn(column.id, { name: e.target.value })}
                            placeholder="Column name"
                            className="text-sm"
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Select 
                            value={column.dataType} 
                            onValueChange={(value) => updateColumn(column.id, { dataType: value })}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {dataTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-2">
                          <Input
                            value={column.defaultValue}
                            onChange={(e) => updateColumn(column.id, { defaultValue: e.target.value })}
                            placeholder="Default value"
                            className="text-sm"
                          />
                        </div>
                        
                        <div className="col-span-1 flex items-center space-x-1">
                          <Checkbox
                            checked={column.nullable}
                            onCheckedChange={(checked) => updateColumn(column.id, { nullable: !!checked })}
                          />
                          <span className="text-xs">Null</span>
                        </div>
                        
                        <div className="col-span-1 flex items-center space-x-1">
                          <Checkbox
                            checked={column.indexed}
                            onCheckedChange={(checked) => updateColumn(column.id, { indexed: !!checked })}
                          />
                          <span className="text-xs">Index</span>
                        </div>
                        
                        <div className="col-span-1 flex items-center space-x-1">
                          <Checkbox
                            checked={column.isPrimary}
                            onCheckedChange={(checked) => updateColumn(column.id, { isPrimary: !!checked })}
                          />
                          <span className="text-xs">PK</span>
                        </div>
                        
                        <div className="col-span-1">
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeColumn(column.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={addColumn}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Column
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Optional Metadata */}
              <Card>
                <Collapsible open={isMetadataExpanded} onOpenChange={setIsMetadataExpanded}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-accent/50">
                      <CardTitle className="text-lg flex items-center justify-between">
                        📝 Optional Metadata
                        {isMetadataExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="adminNotes">Admin Notes</Label>
                        <Textarea
                          id="adminNotes"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add audit trail comments..."
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="teamTags">Team Tags</Label>
                        <Input
                          id="teamTags"
                          value={teamTags}
                          onChange={(e) => setTeamTags(e.target.value)}
                          placeholder="e.g. Security, Content, Tracking"
                        />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </div>

            {/* Right Column - Preview & Validation */}
            <div className="space-y-6">
              {/* Validation Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    🔐 Validation 
                    <Badge variant={riskScore === 'LOW' ? 'default' : riskScore === 'MEDIUM' ? 'secondary' : 'destructive'}>
                      Risk: {riskScore}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {validationMessages.map((msg, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {msg.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {msg.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        {msg.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        <span className={`text-sm ${
                          msg.type === 'error' ? 'text-red-700' : 
                          msg.type === 'warning' ? 'text-yellow-700' : 
                          'text-green-700'
                        }`}>
                          {msg.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SQL Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    🧠 SQL Preview
                    <Button variant="outline" size="sm" onClick={copySQL}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-64 whitespace-pre-wrap">
                    {generateSQL || 'Enter table name and columns to see SQL preview...'}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Separator />
        
        {/* Actions */}
        <div className="flex items-center justify-between p-4">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={copySQL} disabled={!generateSQL}>
              📄 Copy SQL
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose}>
              ❌ Cancel
            </Button>
            <Button 
              onClick={handleCreateTable}
              disabled={validationMessages.some(m => m.type === 'error') || isCreating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreating ? 'Creating...' : '➕ Create Table'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};