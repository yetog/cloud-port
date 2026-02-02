import { cn } from "@/lib/utils";

interface AttributeBarProps {
  abbr: string;
  label: string;
  value: number;
  displayValue?: string;
  color?: 'primary' | 'gold' | 'blue' | 'red';
}

const AttributeBar = ({ 
  abbr, 
  label, 
  value, 
  displayValue,
  color = 'primary' 
}: AttributeBarProps) => {
  const colorStyles = {
    primary: {
      fill: 'hsl(var(--primary))',
      glow: 'hsl(var(--primary) / 0.3)'
    },
    gold: {
      fill: 'hsl(var(--gold))',
      glow: 'hsl(var(--gold) / 0.3)'
    },
    blue: {
      fill: 'hsl(217, 91%, 60%)',
      glow: 'hsl(217, 91%, 60%, 0.3)'
    },
    red: {
      fill: 'hsl(var(--destructive))',
      glow: 'hsl(var(--destructive) / 0.3)'
    }
  };

  const style = colorStyles[color];

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Abbreviation */}
      <span className="stat-abbr w-8 text-muted-foreground">
        {abbr}
      </span>
      
      {/* Label */}
      <span className="flex-shrink-0 w-24 text-sm text-foreground truncate">
        {label}
      </span>
      
      {/* Progress Bar */}
      <div className="flex-1 progress-segmented relative">
        <div 
          className="progress-segmented-fill transition-all duration-700"
          style={{ 
            width: `${Math.min(100, Math.max(0, value))}%`,
            background: `repeating-linear-gradient(90deg, ${style.fill} 0px, ${style.fill} 6px, transparent 6px, transparent 8px)`,
          }}
        />
      </div>
      
      {/* Value */}
      <span className="stat-value w-12 text-right text-sm text-muted-foreground">
        {displayValue ?? `${value}%`}
      </span>
    </div>
  );
};

export default AttributeBar;
