import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, RotateCcw, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoEditorProps {
  isEditMode: boolean;
  isDragging: boolean;
  isResizing: boolean;
  isSaving: boolean;
  scaleX: number;
  scaleY: number;
  onEditToggle: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent, direction?: 'corner' | 'horizontal' | 'vertical') => void;
  onSave: () => void;
  onReset: () => void;
  onCancel: () => void;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  isEditMode,
  isDragging,
  isResizing,
  isSaving,
  scaleX,
  scaleY,
  onEditToggle,
  onDragStart,
  onResizeStart,
  onSave,
  onReset,
  onCancel,
}) => {
  if (!isEditMode) {
    return (
      <div className="absolute top-4 right-4 transition-opacity duration-200">
        <Button
          size="sm"
          variant="secondary"
          onClick={onEditToggle}
          className="bg-white/90 hover:bg-white shadow-lg"
        >
          <Move className="w-4 h-4 mr-1" />
          Edit Position
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Edit Mode Overlay */}
      <div className="absolute inset-0 border-2 border-gray-300 rounded-xl pointer-events-none" />
      
      {/* Resize Handles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner Handles (proportional scaling) */}
        <div
          className={cn(
            "absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform",
            isResizing && "scale-150 bg-blue-600"
          )}
          onMouseDown={(e) => onResizeStart(e, 'corner')}
        />
        <div
          className={cn(
            "absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize pointer-events-auto transform translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform",
            isResizing && "scale-150 bg-blue-600"
          )}
          onMouseDown={(e) => onResizeStart(e, 'corner')}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 w-4 h-4 bg-blue-500 rounded-full cursor-nesw-resize pointer-events-auto transform -translate-x-1/2 translate-y-1/2 hover:scale-150 transition-transform",
            isResizing && "scale-150 bg-blue-600"
          )}
          onMouseDown={(e) => onResizeStart(e, 'corner')}
        />
        <div
          className={cn(
            "absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize pointer-events-auto transform translate-x-1/2 translate-y-1/2 hover:scale-150 transition-transform",
            isResizing && "scale-150 bg-blue-600"
          )}
          onMouseDown={(e) => onResizeStart(e, 'corner')}
        />

        {/* Edge Handles - Horizontal (left & right for horizontal-only scaling) */}
        <div
          className={cn(
            "absolute left-0 top-1/2 w-4 h-4 bg-green-500 rounded-full cursor-ew-resize pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform",
            isResizing && "scale-150 bg-green-600"
          )}
          onMouseDown={(e) => onResizeStart(e, 'horizontal')}
        />
        <div
          className={cn(
            "absolute right-0 top-1/2 w-4 h-4 bg-green-500 rounded-full cursor-ew-resize pointer-events-auto transform translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform",
            isResizing && "scale-150 bg-green-600"
          )}
          onMouseDown={(e) => onResizeStart(e, 'horizontal')}
        />

        {/* Edge Handles - Vertical (top & bottom for vertical-only scaling) */}
        <div
          className={cn(
            "absolute top-0 left-1/2 w-4 h-4 bg-purple-500 rounded-full cursor-ns-resize pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform",
            isResizing && "scale-150 bg-purple-600"
          )}
          onMouseDown={(e) => onResizeStart(e, 'vertical')}
        />
        <div
          className={cn(
            "absolute bottom-0 left-1/2 w-4 h-4 bg-purple-500 rounded-full cursor-ns-resize pointer-events-auto transform -translate-x-1/2 translate-y-1/2 hover:scale-150 transition-transform",
            isResizing && "scale-150 bg-purple-600"
          )}
          onMouseDown={(e) => onResizeStart(e, 'vertical')}
        />
      </div>

      {/* Drag Handle (Center) */}
      <div
        className={cn(
          "absolute inset-0 cursor-move flex items-center justify-center",
          isDragging ? "bg-gray-100/20" : "hover:bg-gray-100/10"
        )}
        onMouseDown={onDragStart}
      >
        {!isDragging && !isResizing && (
          <div className="bg-gray-700/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg">
            Drag to move
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2">
        {/* Scale Indicator */}
        <div className="px-3 py-1 text-xs font-medium text-neutral-700">
          W: {Math.round(scaleX * 100)}% H: {Math.round(scaleY * 100)}%
        </div>

        {/* Reset Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={onReset}
          disabled={isSaving}
          className="h-8"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>

        {/* Cancel Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="h-8"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Cancel
        </Button>

        {/* Save Button */}
        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="h-8"
        >
          <Save className="w-3.5 h-3.5 mr-1" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Instructions */}
      {!isDragging && !isResizing && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-700/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
          Blue corners: proportional • Green edges: horizontal • Purple edges: vertical
        </div>
      )}
    </>
  );
};
