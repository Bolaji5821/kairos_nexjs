import { Button } from "@/components/ui/Button";

type HalfCircleSkillMatchProps = {
  current: number;
  total: number;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  hideButton?: boolean;
};

export default function HalfCircleSkillMatch({
  current,
  total,
  setOpen,
  hideButton = false,
}: HalfCircleSkillMatchProps) {
  const percentage = (current / total) * 100;
  const radius = 45;
  const circumference = Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = ((100 - percentage) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-56 h-[134px] flex flex-col items-center justify-center">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#fde7f3"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#db0075"
            strokeWidth="10"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 top-4 flex flex-col items-center justify-center pt-10">
          <span className="text-sm text-black font-medium">Skill Match</span>
          <span className="text-2xl font-semibold text-black">
            {current}/{total}
          </span>
        </div>
      </div>

      {!hideButton && (
        <Button
          variant="link"
          className="text-custom-magenta-500 font-medium text-sm underline cursor-pointer -mt-2"
          onClick={() => setOpen && setOpen(true)}
        >
          Boost Skill Match
        </Button>
      )}
    </div>
  );
}
