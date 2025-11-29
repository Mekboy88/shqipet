import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ChevronRight, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface ProfessionalPresentationSettingsDropdownProps {
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  sections: {
    home: boolean;
    skills: boolean;
    portfolio: boolean;
    blogs: boolean;
    contact: boolean;
    cv: boolean;
  };
  setSections: React.Dispatch<React.SetStateAction<{
    home: boolean;
    skills: boolean;
    portfolio: boolean;
    blogs: boolean;
    contact: boolean;
    cv: boolean;
  }>>;
  socials: Array<{
    label: string;
    url: string;
    icon?: string;
  }>;
  setSocials: React.Dispatch<React.SetStateAction<Array<{
    label: string;
    url: string;
    icon?: string;
  }>>>;
  hireButton: {
    enabled: boolean;
    text: string;
    url: string;
    email: string;
  };
  setHireButton: React.Dispatch<React.SetStateAction<{
    enabled: boolean;
    text: string;
    url: string;
    email: string;
  }>>;
  hireButtonLoaded?: boolean;
  isSavingHireButton?: boolean;
}
const ProfessionalPresentationSettingsIcon: React.FC<{
  className?: string;
  size?: number;
}> = ({
  className = "",
  size = 24
}) => {
  return <svg height={size} width={size} version="1.1" viewBox="0 0 512 512" className={className}>
      <path style={{
      fill: "#2D2D2D"
    }} d="M0,376V52c0.104-5.704,4.696-10.296,10.4-10.4h491.2c5.704,0.104,10.296,4.696,10.4,10.4v324H0z" />
      <g>
        <path style={{
        fill: "#BCBCBC"
      }} d="M512,376v41.6c-0.104,5.704-4.696,10.296-10.4,10.4H10.4c-5.704-0.104-10.296-4.696-10.4-10.4V376 H512z" />
        <rect x="146.4" y="501.6" style={{
        fill: "#BCBCBC"
      }} width="219.2" height="10.4" />
      </g>
      <polygon style={{
      fill: "#2D2D2D"
    }} points="328.8,501.6 183.2,501.6 193.6,428 318.4,428" />
      <rect x="20.8" y="62.4" style={{
      fill: "#FFFFFF"
    }} width="470.4" height="292.8" />
      <polygon points="318.4,428 193.6,428 187.792,469.08 320.272,441.224" />
      <polygon style={{
      fill: "#D8D6D6"
    }} points="90.12,331.76 183.12,307.424 421.88,68.664 353.216,0 114.456,238.76" />
      <polyline style={{
      fill: "#6B6B6B"
    }} points="103.464,280.76 90.12,331.76 141.12,318.416" />
      <rect x="344.2" y="23.948" transform="matrix(0.7071 -0.7071 0.7071 0.7071 51.0675 268.286)" width="10.368" height="97.103" />
      <rect x="104.524" y="117.627" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -42.6179 229.4677)" width="302.317" height="97.103" />
      <rect x="334.698" y="7.671" transform="matrix(0.7071 -0.7071 0.7071 0.7071 67.3419 275.0236)" style={{
      fill: "#E21B1B"
    }} width="61.911" height="97.103" />
      <g style={{
      opacity: 0.25
    }}>
        <polygon style={{
        fill: "#FFFFFF"
      }} points="90.12,331.76 388.832,35.616 353.216,0.008 114.496,238.72" />
      </g>
      <g>
        <polygon style={{
        fill: "#666666"
      }} points="172.744,296.968 170.912,295.128 200.512,265.528 200.512,252.576 261.952,191.144 278.352,191.144 323.6,145.896 344.504,145.896 342.04,148.488 324.672,148.488 279.424,193.736 263.024,193.736 203.104,253.648 203.104,266.6" />
        <polygon style={{
        fill: "#666666"
      }} points="126.256,250.536 124.424,248.704 234.408,138.76 234.408,130.384 292.856,71.944 292.856,60.368 295.448,57.848 295.448,73.016 237,131.456 237,139.832" />
      </g>
    </svg>;
};
const ProfessionalPresentationSettingsDropdown: React.FC<ProfessionalPresentationSettingsDropdownProps> = ({
  editMode,
  setEditMode,
  sections,
  setSections,
  socials,
  setSocials,
  hireButton,
  setHireButton,
  hireButtonLoaded = true,
  isSavingHireButton = false
}) => {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sectionsExpanded, setSectionsExpanded] = useState(false);
  const [socialsExpanded, setSocialsExpanded] = useState(false);
  const [hireButtonExpanded, setHireButtonExpanded] = useState(false);
  const [cvEditorExpanded, setCvEditorExpanded] = useState(false);
  const updateSocial = (i: number, key: "label" | "url" | "icon", value: string) => {
    const copy = socials.slice();
    (copy[i] as any)[key] = value;
    setSocials(copy);
  };
  const addSocial = () => {
    setSocials([...socials, {
      label: "New link",
      url: "https://",
      icon: "website"
    }]);
  };
  const removeSocial = (i: number) => {
    setSocials(socials.filter((_, idx) => idx !== i));
  };
  return <div className="relative my-0 py-0 mx-0 mt-1 mr-2">
      <TooltipProvider delayDuration={0}>
        <Tooltip open={showTooltip}>
          <Popover open={open} onOpenChange={setOpen}>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-100 flex items-center justify-center" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                  <ProfessionalPresentationSettingsIcon size={20} />
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            
            <PopoverContent className="w-96 p-0 rounded-xl shadow-lg border-none z-[1000] max-h-[600px] overflow-y-auto" align="end" sideOffset={12}>
              <div className="bg-white rounded-xl overflow-hidden text-gray-800">
                <div className="p-4 space-y-2">
                  {/* Edit Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">Edit Mode</span>
                    <Switch checked={editMode} onCheckedChange={setEditMode} />
                  </div>

                  {/* Sections Button with Arrow */}
                  <div className="border-t pt-2">
                    <button onClick={() => setSectionsExpanded(!sectionsExpanded)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-neutral-700">Sections</span>
                      {sectionsExpanded ? <ChevronDown className="h-4 w-4 text-neutral-500" /> : <ChevronRight className="h-4 w-4 text-neutral-500" />}
                    </button>

                    {/* Section Toggles - Expanded View */}
                    {sectionsExpanded && <div className="mt-2 space-y-2 pl-2">
                        {[["Home", "home"], ["Skills", "skills"], ["Portfolio", "portfolio"], ["Blogs", "blogs"], ["Contact", "contact"], ["CV", "cv"]].map(([label, key]) => <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                            <span className="text-sm text-neutral-700">{label}</span>
                            <Switch checked={(sections as any)[key]} onCheckedChange={v => setSections({
                        ...sections,
                        [key]: v
                      })} />
                          </div>)}
                      </div>}
                  </div>

                  {/* Social Links Button with Arrow */}
                  <div className="border-t pt-2">
                    <button onClick={() => setSocialsExpanded(!socialsExpanded)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-neutral-700">Social Links</span>
                      {socialsExpanded ? <ChevronDown className="h-4 w-4 text-neutral-500" /> : <ChevronRight className="h-4 w-4 text-neutral-500" />}
                    </button>

                    {/* Social Links - Expanded View */}
                    {socialsExpanded && <div className="mt-2 space-y-3 pl-2">
                        {socials.map((s, i) => <div key={i} className="space-y-2 p-2 rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-neutral-600">Link {i + 1}</span>
                              <Button variant="ghost" size="sm" onClick={() => removeSocial(i)} className="h-6 w-6 p-0">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <Input value={s.label} onChange={e => updateSocial(i, "label", e.target.value)} placeholder="Label (e.g. LinkedIn)" className="text-xs h-8" />
                            <Input value={s.url} onChange={e => updateSocial(i, "url", e.target.value)} placeholder="https://..." className="text-xs h-8" />
                            <Input value={s.icon || "website"} onChange={e => updateSocial(i, "icon", e.target.value)} placeholder="icon (linkedin/github/...)" className="text-xs h-8" />
                          </div>)}
                        <Button variant="outline" size="sm" onClick={addSocial} className="w-full text-xs h-8">
                          + Add new link
                        </Button>
                      </div>}
                  </div>

                  {/* Hire Button Section */}
                  <div className="border-t pt-2">
                    <button onClick={() => setHireButtonExpanded(!hireButtonExpanded)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-neutral-700">Hire Button</span>
                      {hireButtonExpanded ? <ChevronDown className="h-4 w-4 text-neutral-500" /> : <ChevronRight className="h-4 w-4 text-neutral-500" />}
                    </button>

                    {/* Hire Button Settings - Expanded View */}
                    {hireButtonExpanded && <div className="mt-2 space-y-3 pl-2">
                        <div className="space-y-2 p-2 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-neutral-700">Enable Button</span>
                              <p className="text-xs text-neutral-500 mt-0.5">
                                {hireButton.enabled 
                                  ? `Enabled — Button text: "${hireButton.text || 'Hire Me'}"` 
                                  : "Disabled — Button hidden"}
                              </p>
                            </div>
                            <Switch 
                              checked={hireButton.enabled} 
                              disabled={!hireButtonLoaded || isSavingHireButton}
                              onCheckedChange={v => {
                                console.log('🔄 Hire button switch toggled to:', v);
                                setHireButton(prev => ({
                                  ...prev,
                                  enabled: v,
                                  // Set default text when enabling if empty
                                  text: v && !prev.text ? "Hire Me" : prev.text
                                }));
                              }} 
                            />
                          </div>
                          {isSavingHireButton && (
                            <p className="text-xs text-blue-600 font-medium">Saving...</p>
                          )}
                        </div>

                        

                        <div className="space-y-2 p-2 rounded-lg bg-gray-50">
                          <Label className="text-xs">Button Text</Label>
                          <Input value={hireButton.text} onChange={e => setHireButton({
                        ...hireButton,
                        text: e.target.value
                      })} placeholder="Hire Me" className="text-xs h-8" />
                        </div>

                        <div className="space-y-2 p-2 rounded-lg bg-gray-50">
                          <Label className="text-xs">Button URL (optional)</Label>
                          <Input value={hireButton.url} onChange={e => setHireButton({
                        ...hireButton,
                        url: e.target.value
                      })} placeholder="https://your-booking-page.com" className="text-xs h-8" />
                          <p className="text-xs text-neutral-500">Opens this URL when clicked</p>
                        </div>

                        <div className="space-y-2 p-2 rounded-lg bg-gray-50">
                          <Label className="text-xs">Email (optional)</Label>
                          <Input value={hireButton.email} onChange={e => setHireButton({
                        ...hireButton,
                        email: e.target.value
                      })} placeholder="your.email@example.com" className="text-xs h-8" />
                          <p className="text-xs text-neutral-500">If no URL, opens email client</p>
                        </div>

                        <div className="rounded-lg bg-blue-50 p-2 text-xs">
                          <strong>Note:</strong> Button appears at bottom right. Hidden in edit mode.
                        </div>
                      </div>}
                  </div>

                  {/* Edit my CV Section */}
                  <div className="border-t pt-2">
                    <button onClick={() => setCvEditorExpanded(!cvEditorExpanded)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-neutral-700">Edit my CV</span>
                      {cvEditorExpanded ? <ChevronDown className="h-4 w-4 text-neutral-500" /> : <ChevronRight className="h-4 w-4 text-neutral-500" />}
                    </button>

                    {/* CV Editor Settings - Expanded View */}
                    {cvEditorExpanded && <div className="mt-2 space-y-3 pl-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            // TODO: Implement CV creation/editing functionality
                            console.log('Create CV clicked');
                          }}
                          className="w-full text-xs h-8 gap-2"
                        >
                          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" enableBackground="new 0 0 52 52" xmlSpace="preserve" className="h-4 w-4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M31.4,15.3h8.2c0.6,0,1.1-0.5,1.1-1.1l0,0c0-0.3-0.1-0.5-0.3-0.8L30.2,3.3C29.9,3.1,29.7,3,29.4,3l0,0 c-0.6,0-1.1,0.5-1.1,1.1v8.1C28.3,13.9,29.7,15.3,31.4,15.3z"></path> <path d="M49.5,25.7l-0.9-0.9c-0.6-0.6-1.5-0.6-2.2,0L34.5,36.7c-0.1,0.1,0,0.2,0,0.3v2.5c0,0.2,0,0.4,0.2,0.4h2.6 c0.1,0,0.2-0.1,0.3-0.1L49.5,28C50.2,27.2,50.2,26.3,49.5,25.7z"></path> <path d="M39.9,44.4h-1.8h-3.6h-1.7c-1.6,0-2.9-1.3-2.9-2.9v-5.4c0-0.8,0.2-1.6,0.9-2.1l9.5-9.5 c0.3-0.3,0.5-0.7,0.5-1.1v-2c0-0.8-0.7-1.5-1.5-1.5H28.3c-2.6,0-4.6-2.1-4.6-4.6V4.5C23.7,3.7,23,3,22.1,3H6.6C4.1,3,2,5.1,2,7.6 v36.8C2,46.9,4.1,49,6.6,49h29.4c2.2,0,4.2-1.6,4.6-3.7C40.7,44.9,40.3,44.4,39.9,44.4z M8.2,16.8c0-0.8,0.7-1.5,1.5-1.5h6.2 c0.9,0,1.5,0.7,1.5,1.5v1.5c0,0.8-0.7,1.5-1.5,1.5H9.7c-0.9,0-1.5-0.7-1.5-1.5V16.8z M23.7,36.7c0,0.8-0.7,1.5-1.5,1.5H9.7 c-0.9,0-1.5-0.7-1.5-1.5v-1.5c0-0.8,0.7-1.5,1.5-1.5h12.4c0.9,0,1.5,0.7,1.5,1.5V36.7z M26.8,27.5c0,0.8-0.7,1.5-1.5,1.5H9.7 c-0.9,0-1.5-0.7-1.5-1.5V26c0-0.8,0.7-1.5,1.5-1.5h15.5c0.9,0,1.5,0.7,1.5,1.5V27.5z"></path> </g> </g></svg>
                          Create CV
                        </Button>

                        <div className="rounded-lg bg-blue-50 p-2 text-xs">
                          <strong>Note:</strong> Click to create or edit your CV content.
                        </div>
                      </div>}
                  </div>
                </div>
              </div>
            </PopoverContent>

            <TooltipContent side="bottom" className="bg-gray-800 text-white px-2 py-1 text-xs rounded">
              Professional Presentation Settings
            </TooltipContent>
          </Popover>
        </Tooltip>
      </TooltipProvider>
    </div>;
};
export default ProfessionalPresentationSettingsDropdown;