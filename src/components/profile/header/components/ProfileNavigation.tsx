import React from "react";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileNavigationProps {
  name: string;
  isNavigationSticky: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  avatarUrl?: string; // ✅ added
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({
  name,
  isNavigationSticky,
  activeTab,
  onTabChange,
  avatarUrl,
}) => {
  const tabs = [
    { id: "posts", label: "Postimet" },
    { id: "about", label: "Rreth" },
    { id: "friends", label: "Miqtë" },
    { id: "photos", label: "Fotot" },
    { id: "videos", label: "Videot" },
    { id: "reels", label: "Reels" },
  ];

  const profileMenuItems = [
    "Shiko si",
    "Kërko",
    "Statusi i profilit",
    "Arkiva",
    "Arkiva e rrëfimeve",
    "Regjistri i aktivitetit",
    "Cilësimet e profilit dhe etiketimit",
    "Aktivizo modalitetin profesional",
    "Krijo një profil tjetër",
    "MetaAlbos i verifikuar",
  ];

  const moreMenuItems = [
    "Check-ins",
    "Sportet",
    "Muzika",
    "Filmat",
    "Shfaqjet televizive",
    "Librat",
    "Aplikacionet dhe lojërat",
    "Pëlqimet",
    "Ngjarjet",
    "Vlerësimet e dhëna",
    "Grupet",
    "Menaxho seksionet",
  ];

  return (
    <>
      {/* Top line */}
      <div
        className="border-b bg-gray-350 mt-2 px-0 py-[2px] mx-[28px] transition-opacity duration-50"
        style={{ opacity: isNavigationSticky ? 0 : 1 }}
      />

      {/* Navigation */}
      <div
        style={{
          marginTop: isNavigationSticky ? "10px" : "20px",
          transition: "margin-top 0.05s ease-in-out",
        }}
        className="px-6 pt-2 pb-2 flex items-center justify-between"
      >
        {/* ✅ Avatar shown in sticky mode */}
        {isNavigationSticky ? (
          <div className="flex items-center animate-fade-in">
            {/* ✅ FIXED: Avatar now receives the real src AND img-locked */}
            <Avatar size="sm" src={avatarUrl} className="mr-3 img-locked" />
            <h2 className="text-lg font-semibold">{name}</h2>
          </div>
        ) : (
          <div className="flex items-center space-x-1 animate-fade-in">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out
                  hover:bg-gray-100 cursor-pointer flex items-center gap-1
                  ${activeTab === tab.id ? "" : "text-gray-600 hover:text-gray-800"}
                `}
                style={
                  activeTab === tab.id
                    ? {
                        background: "linear-gradient(90deg, #ff3a3a, #8b0000)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }
                    : {}
                }
              >
                {tab.label}

                {activeTab === tab.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-md my-[-11px] transition-all"
                    style={{ background: "linear-gradient(90deg, #ff3a3a, #8b0000)" }}
                  />
                )}
              </button>
            ))}

            {/* More menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 rounded-md text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 flex items-center gap-1">
                  Më shumë
                  <ChevronDown className="h-3 w-3 ml-1" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-56 bg-white shadow-lg border border-gray-200 rounded-lg z-50 my-[6px]"
                style={{ backdropFilter: "blur(8px)" }}
              >
                {moreMenuItems.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Right menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 px-[11px] border-0 focus:outline-none">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 bg-white rounded-lg shadow-2xl border-0 p-2 z-[100]"
            style={{ backdropFilter: "blur(16px)" }}
          >
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200" />

            {profileMenuItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                className="px-3 py-2.5 text-sm text-gray-900 hover:bg-gray-100 rounded-md flex items-center gap-3"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                </div>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default ProfileNavigation;
