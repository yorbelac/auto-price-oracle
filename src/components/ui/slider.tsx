import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  colorRanges?: {
    value: number;
    color: string;
  }[];
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, colorRanges, value, ...props }, ref) => {
  // Calculate background gradient based on color ranges if provided
  const getBackgroundStyle = () => {
    if (!colorRanges) return {};

    const sortedRanges = [...colorRanges].sort((a, b) => a.value - b.value);
    const max = props.max || 100;
    const gradientStops = sortedRanges.map((range) => {
      const percentage = (range.value / max) * 100;
      return `${range.color} ${percentage}%`;
    });

    // Add final color to the end
    if (sortedRanges.length > 0) {
      gradientStops.push(`${sortedRanges[sortedRanges.length - 1].color} 100%`);
    }

    return {
      background: `linear-gradient(to right, ${gradientStops.join(', ')})`,
    };
  };

  // Get the color for the current range
  const getCurrentRangeColor = () => {
    if (!colorRanges || !Array.isArray(value)) return '';
    
    const currentValue = Math.max(...value);
    const sortedRanges = [...colorRanges].sort((a, b) => b.value - a.value);
    const currentRange = sortedRanges.find(range => currentValue >= range.value);
    
    return currentRange?.color || '';
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      value={value}
      {...props}
    >
      <SliderPrimitive.Track 
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
        style={getBackgroundStyle()}
      >
        <SliderPrimitive.Range className="absolute h-full bg-white/50" />
      </SliderPrimitive.Track>
      {Array.isArray(value) && value.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={cn(
            "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            getCurrentRangeColor() && `border-[${getCurrentRangeColor()}]`
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
