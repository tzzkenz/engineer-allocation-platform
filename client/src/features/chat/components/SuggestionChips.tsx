import { SUGGESTION_CHIPS } from "../lib/data";

interface SuggestionChipsProps {
  onSelect: (chip: string) => void;
}

/**
 * Quick-action pill buttons shown when the conversation has only the greeting.
 * Matches the Figma "Suggestion Chips" component: primary/10 bg, primary/20 border,
 * primary text, rounded-full.
 */
export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-col gap-2 pt-1 w-full">
      {SUGGESTION_CHIPS.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          className="relative text-left px-3.5 py-[7px] rounded-full bg-primary/10 border border-primary/20 text-primary text-[13px] leading-[18px] hover:bg-primary/15 transition-colors"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
