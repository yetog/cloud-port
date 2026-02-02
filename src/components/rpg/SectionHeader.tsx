import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SectionHeader = ({ children, className }: SectionHeaderProps) => {
  return (
    <h3 className={cn("ff7-header", className)}>
      {children}
    </h3>
  );
};

export default SectionHeader;
