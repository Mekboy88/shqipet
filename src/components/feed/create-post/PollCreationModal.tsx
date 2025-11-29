import React, { useState } from 'react';
import { X, Plus, BarChart3, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import SlidingWindow from '@/components/create-post/sliding-windows/SlidingWindow';

interface PollOption {
  id: string;
  text: string;
}

interface PollData {
  question: string;
  options: PollOption[];
  duration: number; // in hours
  allowMultiple: boolean;
  showResults: 'after_vote' | 'after_end' | 'always';
}

interface PollCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePoll: (pollData: PollData) => void;
}

const PollCreationModal: React.FC<PollCreationModalProps> = ({
  isOpen,
  onClose,
  onCreatePoll
}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ]);
  const [duration, setDuration] = useState(24);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [showResults, setShowResults] = useState<'after_vote' | 'after_end' | 'always'>('after_vote');

  if (!isOpen) return null;

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, { id: Date.now().toString(), text: '' }]);
    }
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleCreatePoll = () => {
    const validOptions = options.filter(opt => opt.text.trim() !== '');
    
    if (!question.trim()) {
      return;
    }
    
    if (validOptions.length < 2) {
      return;
    }

    onCreatePoll({
      question: question.trim(),
      options: validOptions,
      duration,
      allowMultiple,
      showResults
    });

    // Reset form
    setQuestion('');
    setOptions([{ id: '1', text: '' }, { id: '2', text: '' }]);
    setDuration(24);
    setAllowMultiple(false);
    setShowResults('after_vote');
  };

  const isValid = question.trim() !== '' && options.filter(opt => opt.text.trim() !== '').length >= 2;

  const pollIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 512 512"
      className="h-6 w-6"
      fill="currentColor"
    >
      <g>
        <g>
          <g>
            <path d="M383.851,264.917c-0.853-5.141-5.312-8.917-10.517-8.917H352c-5.888,0-10.667,4.779-10.667,10.667v27.243 c0,3.797,2.027,7.296,5.312,9.216c10.048,5.845,16.021,16.128,16.021,27.541c0,17.643-14.357,32-32,32h-256 c-17.643,0-32-14.357-32-32c0-11.392,5.995-21.696,16.021-27.541c3.285-1.92,5.312-5.419,5.312-9.216v-27.243 C64,260.779,59.221,256,53.333,256H32c-5.227,0-9.664,3.776-10.517,8.917L1.643,384h402.069L383.851,264.917z"/>
            <path d="M74.667,341.333h256c5.888,0,10.667-4.779,10.667-10.667S336.555,320,330.667,320H320v-61.355 c0-3.755-1.984-7.253-5.227-9.173c-3.243-1.941-7.253-2.005-10.539-0.213c-23.019,12.523-49.899,7.68-67.115-9.557 c-19.115-19.115-22.101-49.301-7.339-71.424l32.491-44.672c2.368-3.243,2.688-7.531,0.896-11.115 c-1.813-3.563-5.504-5.824-9.515-5.824H96c-5.888,0-10.667,4.779-10.667,10.667V320H74.667C68.779,320,64,324.779,64,330.667 S68.779,341.333,74.667,341.333z"/>
            <path d="M501.333,0c-25.109,0-57.024,16.107-66.475,21.205L298.667,0.363c-19.136,0-65.323,1.237-80.299,12.267L133.035,65.6 c-4.053,2.517-5.931,7.403-4.629,11.989c1.323,4.587,5.504,7.744,10.261,7.744h96c0.853,0,1.685-0.107,2.517-0.299l14.293-3.52 C270.997,78.656,288,94.016,288,113.195c0,7.403-2.304,14.485-6.677,20.459l-33.557,46.101 c-9.365,14.037-7.509,32.896,4.437,44.843c6.699,6.699,15.637,10.411,25.131,10.411c9.493,0,18.411-3.691,25.131-10.411 l54.08-54.08c20.203-1.131,38.677-9.856,52.395-23.957c18.923,17.557,79.552,23.104,91.563,24.043 c0.277,0.064,0.555,0.064,0.832,0.064c2.667,0,5.269-1.003,7.232-2.837c2.197-2.027,3.435-4.864,3.435-7.829V10.667 C512,4.779,507.221,0,501.333,0z"/>
            <path d="M0,501.333C0,507.221,4.779,512,10.667,512h384c5.888,0,10.667-4.779,10.667-10.667v-96H0V501.333z"/>
          </g>
        </g>
      </g>
    </svg>
  );

  return (
    <SlidingWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Create Poll"
      icon={pollIcon}
      className="w-[420px]"
      style={{
        left: 'calc(50% - 960px - 40px)'
      }}
    >
      <div className="space-y-6 max-h-[500px] overflow-y-auto">
        {/* Question Input */}
        <div className="space-y-2">
          <Label htmlFor="question" className="text-sm font-medium text-foreground">
            Poll Question
          </Label>
          <Input
            id="question"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="text-base"
            maxLength={280}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Make it clear and engaging</span>
            <span>{question.length}/280</span>
          </div>
        </div>

        {/* Poll Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Poll Options</Label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    className="pr-10"
                    maxLength={120}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    {option.text.length}/120
                  </div>
                </div>
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 10 && (
            <Button
              variant="ghost"
              onClick={addOption}
              className="w-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          )}
        </div>

        {/* Poll Settings */}
        <div className="grid grid-cols-1 gap-4">
          {/* Duration */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Poll Duration
            </Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">1 day</SelectItem>
                <SelectItem value="48">2 days</SelectItem>
                <SelectItem value="72">3 days</SelectItem>
                <SelectItem value="168">1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show Results */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Show Results
            </Label>
            <Select value={showResults} onValueChange={(value) => setShowResults(value as 'after_vote' | 'after_end' | 'always')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="after_vote">After voting</SelectItem>
                <SelectItem value="after_end">After poll ends</SelectItem>
                <SelectItem value="always">Always visible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Allow Multiple Selections */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
          <div>
            <p className="font-medium text-foreground">Allow multiple selections</p>
            <p className="text-sm text-muted-foreground">Users can choose more than one option</p>
          </div>
          <Switch
            checked={allowMultiple}
            onCheckedChange={setAllowMultiple}
            className="bg-gradient-to-r from-red-500/10 to-gray-800/10 rounded-xl border border-red-200 data-[state=checked]:!bg-green-100"
          />
        </div>

        {/* Preview */}
        {question.trim() && (
          <div className="border border-border rounded-xl p-4 bg-muted/20">
            <p className="text-sm font-medium text-muted-foreground mb-3">Preview</p>
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">{question}</h3>
              <div className="space-y-2">
                {options.filter(opt => opt.text.trim()).map((option, index) => (
                  <div key={option.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border cursor-pointer hover:bg-muted/50">
                    <div className={`w-4 h-4 border-2 border-muted-foreground rounded ${allowMultiple ? '' : 'rounded-full'}`} />
                    <span className="text-sm text-foreground">{option.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{allowMultiple ? 'Multiple selections allowed' : 'Single selection'}</span>
                <span>Ends in {duration === 1 ? '1 hour' : duration < 24 ? `${duration} hours` : duration === 24 ? '1 day' : `${duration / 24} days`}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-sm text-muted-foreground">
            {options.filter(opt => opt.text.trim()).length}/10 options
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              variant="ghost"
              onClick={handleCreatePoll}
              disabled={!isValid}
              className="flex-1 p-4 bg-gradient-to-r from-red-500/10 to-gray-800/10 rounded-xl border border-red-200"
            >
              Create Poll
            </Button>
          </div>
        </div>
      </div>
    </SlidingWindow>
  );
};

export default PollCreationModal;