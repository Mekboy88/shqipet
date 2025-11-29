import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

type AnonymousSwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
};

const AnonymousSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  AnonymousSwitchProps
>(({ className, onIcon, offIcon, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-12 w-20 shrink-0 cursor-pointer items-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-100 data-[state=checked]:!border-green-300 data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-red-500/10 data-[state=unchecked]:to-gray-800/10 data-[state=unchecked]:border-red-200 dark:data-[state=unchecked]:from-red-500/30 dark:data-[state=unchecked]:to-gray-600/30 dark:data-[state=unchecked]:border-red-300",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "group pointer-events-none relative block h-10 w-10 rounded-full bg-background dark:bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0 flex items-center justify-center dark:data-[state=unchecked]:bg-gray-700"
      )}
    >
      {/* On icon (checked) */}
      <span className="absolute transition-opacity duration-150 ease-out group-data-[state=checked]:opacity-100 group-data-[state=unchecked]:opacity-0" aria-hidden="true">
        {onIcon}
      </span>
      {/* Off icon (unchecked) */}
      {offIcon && (
        <span className="absolute transition-opacity duration-150 ease-out group-data-[state=checked]:opacity-0 group-data-[state=unchecked]:opacity-100" aria-hidden="true">
          {offIcon}
        </span>
      )}
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
))
AnonymousSwitch.displayName = "AnonymousSwitch"

export { AnonymousSwitch }
