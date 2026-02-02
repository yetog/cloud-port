import { cn } from "@/lib/utils";
import { Sword } from "lucide-react";
import MateriaIndicator from "./MateriaIndicator";

interface EquipmentSlotProps {
  name: string;
  description: string;
  materiaFilled: number;
  materiaTotal?: number;
  isActive?: boolean;
  icon?: React.ReactNode;
}

const EquipmentSlot = ({ 
  name, 
  description, 
  materiaFilled,
  materiaTotal = 5,
  isActive = false,
  icon
}: EquipmentSlotProps) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg transition-all duration-200",
        "border border-primary/20",
        isActive 
          ? "bg-primary/10 border-primary/40" 
          : "bg-card/50 hover:bg-card/80 hover:border-primary/30"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
        isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
      )}>
        {icon ?? <Sword className="h-5 w-5" />}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "font-semibold text-sm truncate",
          isActive ? "text-primary" : "text-foreground"
        )}>
          {name}
        </h4>
        <p className="text-xs text-muted-foreground truncate">
          {description}
        </p>
      </div>
      
      {/* Materia */}
      <MateriaIndicator 
        filled={materiaFilled} 
        total={materiaTotal}
        size="sm"
        color={isActive ? "primary" : "primary"}
      />
    </div>
  );
};

export default EquipmentSlot;
