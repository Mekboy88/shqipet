
import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"
import "@/components/auth/verification/otp-animations.css"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  InputOTPSlotProps
>(({ className, index, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  
  // Ensure slots exists and has elements before accessing
  if (!inputOTPContext.slots || !inputOTPContext.slots[index]) {
    return (
      <div 
        ref={ref} 
        className={cn(
          "h-12 w-12 border-2 border-border bg-background rounded-md flex items-center justify-center text-lg font-medium", 
          className
        )} 
        {...props} 
      />
    );
  }
  
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-12 w-12 items-center justify-center border-2 rounded-md text-lg font-medium transition-all duration-200",
        "bg-background border-primary animate-security-pulse",
        isActive && "z-10 ring-2 ring-primary ring-offset-2 shadow-lg",
        char && "bg-primary/5",
        className
      )}
      {...props}
    >
      <span className="text-foreground">{char}</span>
      {(isActive || hasFakeCaret) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-0.5 bg-primary animate-otp-caret" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
