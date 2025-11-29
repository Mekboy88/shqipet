import { cn } from "@/lib/utils"

function Skeleton({
  className,
  variant = "shimmer",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "shimmer" | "wave"
}) {
  const baseClass = "rounded-md bg-muted relative overflow-hidden";
  
  const variantClasses = {
    default: "animate-pulse",
    shimmer: "bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite_linear]",
    wave: ""
  };

  return (
    <div
      className={cn(baseClass, variantClasses[variant], className)}
      {...props}
    >
      {variant === "wave" && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[wave_2s_infinite_linear]"
        />
      )}
    </div>
  )
}

export { Skeleton }
