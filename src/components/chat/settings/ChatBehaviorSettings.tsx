import React from 'react';
import { useChatSettings } from '@/contexts/ChatSettingsContext';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  ArrowDown,
  Eye,
  Keyboard,
  FileText,
  Send,
  Trash2,
  Archive,
  Download
} from 'lucide-react';

const ChatBehaviorSettings: React.FC = () => {
  const {
    autoScroll,
    scrollDelay,
    readReceipts,
    typingIndicators,
    enterToSend,
    autoSave,
    autoSaveInterval,
    messageHistory,
    doubleClickAction,
    longPressAction,
    swipeActions,
    quickReactions,
    smartReplies,
    updateSetting
  } = useChatSettings();

  return (
    <div className="space-y-6 max-h-full overflow-y-auto pr-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ scrollBehavior: 'smooth' }}>
      {/* Scrolling Behavior */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <ArrowDown className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Scrolling Behavior</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Auto-scroll to Latest</p>
              <p className="text-xs text-muted-foreground">Automatically scroll to new messages</p>
            </div>
            <Switch checked={autoScroll} onCheckedChange={(value) => updateSetting('autoScroll', value)} />
          </div>
          
          {autoScroll && (
            <>
              <Separator className="bg-primary/10" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">Scroll Delay</p>
                  <Badge variant="outline" className="text-xs">{scrollDelay}ms</Badge>
                </div>
                <Slider
                  value={[scrollDelay]}
                  onValueChange={(value) => updateSetting('scrollDelay', value[0])}
                  max={2000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Delay before auto-scrolling to new messages
                </p>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Message Behavior */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Message Behavior</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Read Receipts</p>
              <p className="text-xs text-muted-foreground">Show when messages are read</p>
            </div>
            <Switch checked={readReceipts} onCheckedChange={(value) => updateSetting('readReceipts', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Typing Indicators</p>
              <p className="text-xs text-muted-foreground">Show when someone is typing</p>
            </div>
            <Switch checked={typingIndicators} onCheckedChange={(value) => updateSetting('typingIndicators', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Quick Reactions</p>
              <p className="text-xs text-muted-foreground">Enable emoji reactions on hover</p>
            </div>
            <Switch checked={quickReactions} onCheckedChange={(value) => updateSetting('quickReactions', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Smart Replies</p>
              <p className="text-xs text-muted-foreground">Suggest quick reply options</p>
            </div>
            <Switch checked={smartReplies} onCheckedChange={(value) => updateSetting('smartReplies', value)} />
          </div>
        </div>
      </Card>

      {/* Input Behavior */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Input Behavior</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Enter to Send</p>
              <p className="text-xs text-muted-foreground">Press Enter to send messages (Shift+Enter for new line)</p>
            </div>
            <Switch checked={enterToSend} onCheckedChange={(value) => updateSetting('enterToSend', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Auto-save Drafts</p>
              <p className="text-xs text-muted-foreground">Automatically save message drafts</p>
            </div>
            <Switch checked={autoSave} onCheckedChange={(value) => updateSetting('autoSave', value)} />
          </div>
          
          {autoSave && (
            <>
              <Separator className="bg-primary/10" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">Auto-save Interval</p>
                  <Badge variant="outline" className="text-xs">{autoSaveInterval}s</Badge>
                </div>
                <Slider
                  value={[autoSaveInterval]}
                  onValueChange={(value) => updateSetting('autoSaveInterval', value[0])}
                  max={120}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Gesture Actions */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Send className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Gesture Actions</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Swipe Actions</p>
              <p className="text-xs text-muted-foreground">Enable swipe gestures on messages</p>
            </div>
            <Switch checked={swipeActions} onCheckedChange={(value) => updateSetting('swipeActions', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Double-click Action</p>
            </div>
            <Select value={doubleClickAction} onValueChange={(value) => updateSetting('doubleClickAction', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="edit">Edit Message</SelectItem>
                <SelectItem value="react">Quick React</SelectItem>
                <SelectItem value="reply">Reply to Message</SelectItem>
                <SelectItem value="copy">Copy Message</SelectItem>
                <SelectItem value="none">No Action</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Long Press Action</p>
            </div>
            <Select value={longPressAction} onValueChange={(value) => updateSetting('longPressAction', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menu">Show Context Menu</SelectItem>
                <SelectItem value="select">Select Message</SelectItem>
                <SelectItem value="react">Quick React</SelectItem>
                <SelectItem value="copy">Copy Message</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Data Management</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Message History</p>
            </div>
            <Select value={messageHistory} onValueChange={(value) => updateSetting('messageHistory', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unlimited">Keep All Messages</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="1month">1 Month</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              How long to keep message history locally
            </p>
          </div>
        </div>
      </Card>

      {/* Preview Section */}
      <Card className="p-6 border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Behavior Preview</h3>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${enterToSend ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span>Enter key {enterToSend ? 'sends messages' : 'creates new lines'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${readReceipts ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span>Read receipts are {readReceipts ? 'enabled' : 'disabled'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${typingIndicators ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span>Typing indicators are {typingIndicators ? 'shown' : 'hidden'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${autoScroll ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span>Auto-scroll is {autoScroll ? 'enabled' : 'disabled'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatBehaviorSettings;