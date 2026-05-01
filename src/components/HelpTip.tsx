import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HelpTipProps {
  text: string;
  className?: string;
}

/**
 * Pequeno ícone "?" que exibe explicação ao passar o mouse.
 * Use ao lado de títulos, parâmetros e resultados.
 */
const HelpTip = ({ text, className = "" }: HelpTipProps) => (
  <Tooltip delayDuration={150}>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-label="Ajuda"
        className={`inline-flex items-center justify-center text-muted-foreground hover:text-primary transition-colors ${className}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-xs font-body text-sm leading-relaxed">
      {text}
    </TooltipContent>
  </Tooltip>
);

export default HelpTip;
