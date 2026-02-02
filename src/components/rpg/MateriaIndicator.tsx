import { cn } from "@/lib/utils";

interface MateriaIndicatorProps {
  filled: number;
  total?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'gold' | 'blue';
}

const MateriaIndicator = ({ 
  filled, 
  total = 5, 
  size = 'md',
  color = 'primary' 
}: MateriaIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const colorClasses = {
    primary: 'materia-slot-filled',
    gold: 'materia-slot-gold',
    blue: 'bg-blue-500 border-blue-500 shadow-[0_0_8px_hsl(217,91%,60%)]',
  };

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${filled} of ${total} mastery`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "materia-slot",
            sizeClasses[size],
            i < filled && colorClasses[color]
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default MateriaIndicator;
