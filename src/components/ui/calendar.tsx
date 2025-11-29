
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto w-full", className)}
      classNames={{
        months: "w-full",
        month: "w-full space-y-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "grid grid-cols-7 w-full",
        head_cell:
          "text-muted-foreground rounded-md text-center font-normal text-[0.8rem]",
        row: "grid grid-cols-7 w-full mt-2",
        cell: "h-9 w-full min-w-0 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-full p-0 font-semibold aria-selected:opacity-100 text-foreground hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gradient-to-br text-foreground hover:shadow-md focus:shadow-md font-bold border-2 aria-selected:from-red-100 aria-selected:to-pink-100 aria-selected:border-red-300 [&[aria-label*='2,']]:aria-selected:from-orange-100 [&[aria-label*='2,']]:aria-selected:to-amber-100 [&[aria-label*='2,']]:aria-selected:border-orange-300 [&[aria-label*='3,']]:aria-selected:from-yellow-100 [&[aria-label*='3,']]:aria-selected:to-lime-100 [&[aria-label*='3,']]:aria-selected:border-yellow-300 [&[aria-label*='4,']]:aria-selected:from-green-100 [&[aria-label*='4,']]:aria-selected:to-emerald-100 [&[aria-label*='4,']]:aria-selected:border-green-300 [&[aria-label*='5,']]:aria-selected:from-teal-100 [&[aria-label*='5,']]:aria-selected:to-cyan-100 [&[aria-label*='5,']]:aria-selected:border-teal-300 [&[aria-label*='6,']]:aria-selected:from-blue-100 [&[aria-label*='6,']]:aria-selected:to-indigo-100 [&[aria-label*='6,']]:aria-selected:border-blue-300 [&[aria-label*='7,']]:aria-selected:from-purple-100 [&[aria-label*='7,']]:aria-selected:to-violet-100 [&[aria-label*='7,']]:aria-selected:border-purple-300 [&[aria-label*='8,']]:aria-selected:from-pink-100 [&[aria-label*='8,']]:aria-selected:to-rose-100 [&[aria-label*='8,']]:aria-selected:border-pink-300 [&[aria-label*='9,']]:aria-selected:from-amber-100 [&[aria-label*='9,']]:aria-selected:to-orange-100 [&[aria-label*='9,']]:aria-selected:border-amber-300 [&[aria-label*='10,']]:aria-selected:from-lime-100 [&[aria-label*='10,']]:aria-selected:to-green-100 [&[aria-label*='10,']]:aria-selected:border-lime-300 [&[aria-label*='11,']]:aria-selected:from-emerald-100 [&[aria-label*='11,']]:aria-selected:to-teal-100 [&[aria-label*='11,']]:aria-selected:border-emerald-300 [&[aria-label*='12,']]:aria-selected:from-cyan-100 [&[aria-label*='12,']]:aria-selected:to-sky-100 [&[aria-label*='12,']]:aria-selected:border-cyan-300 [&[aria-label*='13,']]:aria-selected:from-sky-100 [&[aria-label*='13,']]:aria-selected:to-blue-100 [&[aria-label*='13,']]:aria-selected:border-sky-300 [&[aria-label*='14,']]:aria-selected:from-indigo-100 [&[aria-label*='14,']]:aria-selected:to-purple-100 [&[aria-label*='14,']]:aria-selected:border-indigo-300 [&[aria-label*='15,']]:aria-selected:from-violet-100 [&[aria-label*='15,']]:aria-selected:to-fuchsia-100 [&[aria-label*='15,']]:aria-selected:border-violet-300 [&[aria-label*='16,']]:aria-selected:from-fuchsia-100 [&[aria-label*='16,']]:aria-selected:to-pink-100 [&[aria-label*='16,']]:aria-selected:border-fuchsia-300 [&[aria-label*='17,']]:aria-selected:from-rose-100 [&[aria-label*='17,']]:aria-selected:to-red-100 [&[aria-label*='17,']]:aria-selected:border-rose-300 [&[aria-label*='18,']]:aria-selected:from-red-100 [&[aria-label*='18,']]:aria-selected:to-orange-100 [&[aria-label*='18,']]:aria-selected:border-red-300 [&[aria-label*='19,']]:aria-selected:from-orange-100 [&[aria-label*='19,']]:aria-selected:to-yellow-100 [&[aria-label*='19,']]:aria-selected:border-orange-300 [&[aria-label*='20,']]:aria-selected:from-yellow-100 [&[aria-label*='20,']]:aria-selected:to-lime-100 [&[aria-label*='20,']]:aria-selected:border-yellow-300 [&[aria-label*='21,']]:aria-selected:from-lime-100 [&[aria-label*='21,']]:aria-selected:to-emerald-100 [&[aria-label*='21,']]:aria-selected:border-lime-300 [&[aria-label*='22,']]:aria-selected:from-emerald-100 [&[aria-label*='22,']]:aria-selected:to-cyan-100 [&[aria-label*='22,']]:aria-selected:border-emerald-300 [&[aria-label*='23,']]:aria-selected:from-cyan-100 [&[aria-label*='23,']]:aria-selected:to-blue-100 [&[aria-label*='23,']]:aria-selected:border-cyan-300 [&[aria-label*='24,']]:aria-selected:from-blue-100 [&[aria-label*='24,']]:aria-selected:to-indigo-100 [&[aria-label*='24,']]:aria-selected:border-blue-300 [&[aria-label*='25,']]:aria-selected:from-indigo-100 [&[aria-label*='25,']]:aria-selected:to-violet-100 [&[aria-label*='25,']]:aria-selected:border-indigo-300 [&[aria-label*='26,']]:aria-selected:from-violet-100 [&[aria-label*='26,']]:aria-selected:to-purple-100 [&[aria-label*='26,']]:aria-selected:border-violet-300 [&[aria-label*='27,']]:aria-selected:from-purple-100 [&[aria-label*='27,']]:aria-selected:to-fuchsia-100 [&[aria-label*='27,']]:aria-selected:border-purple-300 [&[aria-label*='28,']]:aria-selected:from-fuchsia-100 [&[aria-label*='28,']]:aria-selected:to-pink-100 [&[aria-label*='28,']]:aria-selected:border-fuchsia-300 [&[aria-label*='29,']]:aria-selected:from-pink-100 [&[aria-label*='29,']]:aria-selected:to-rose-100 [&[aria-label*='29,']]:aria-selected:border-pink-300 [&[aria-label*='30,']]:aria-selected:from-rose-100 [&[aria-label*='30,']]:aria-selected:to-red-100 [&[aria-label*='30,']]:aria-selected:border-rose-300 [&[aria-label*='31,']]:aria-selected:from-red-100 [&[aria-label*='31,']]:aria-selected:to-amber-100 [&[aria-label*='31,']]:aria-selected:border-red-300",
        day_today: "bg-gradient-to-br from-yellow-100 to-orange-100 text-foreground font-bold border-2 border-orange-300",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
