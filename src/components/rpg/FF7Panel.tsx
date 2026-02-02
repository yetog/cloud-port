import { cn } from "@/lib/utils";
import SectionHeader from "./SectionHeader";

interface FF7PanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'highlight' | 'muted';
  withCorners?: boolean;
}

const FF7Panel = ({ 
  children, 
  title, 
  className, 
  variant = 'default',
  withCorners = false 
}: FF7PanelProps) => {
  const variantClasses = {
    default: 'ff7-panel',
    highlight: 'ff7-panel-highlight',
    muted: 'ff7-panel-muted'
  };

  return (
    <div className={cn(variantClasses[variant], "relative", className)}>
      {withCorners && (
        <>
          {/* Top-left corner bracket */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary/60" />
          {/* Top-right corner bracket */}
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary/60" />
          {/* Bottom-left corner bracket */}
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary/60" />
          {/* Bottom-right corner bracket */}
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary/60" />
        </>
      )}
      {title && <SectionHeader>{title}</SectionHeader>}
      {children}
    </div>
  );
};

export default FF7Panel;
