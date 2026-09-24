// Pip slots on a 3x3 grid, numbered 0-8 left to right, top to bottom.
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

interface DiceProps {
  value: number;
  color: string;
  rolling: boolean;
  disabled: boolean;
  onRoll: () => void;
}

export default function Dice({ value, color, rolling, disabled, onRoll }: DiceProps) {
  return (
    <button
      type="button"
      className={`dice ${rolling ? "dice-rolling" : ""}`}
      style={{ boxShadow: `0 0 0 3px ${color}, 0 0 24px ${color}66` }}
      disabled={disabled}
      onClick={onRoll}
      aria-label={`Roll the dice, showing ${value}`}
    >
      {Array.from({ length: 9 }, (_, slot) => (
        <span key={slot} className={PIPS[value].includes(slot) ? "pip" : ""} />
      ))}
    </button>
  );
}
