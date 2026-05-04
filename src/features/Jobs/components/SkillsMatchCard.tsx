import { Card, CardContent } from "@/components/ui/Card";

type SkillMatchCardProps = {
  percentage: number;
  role: string;
};

export default function SkillMatchCard({
  percentage,
  role,
}: SkillMatchCardProps) {
  const strokeDasharray = 283; // circumference of the circle
  const strokeDashoffset = ((100 - percentage) / 100) * strokeDasharray;

  return (
    <Card className="bg-pink-50 rounded-xl shadow-none border-none p-4 w-full max-w-md">
      <CardContent className="flex items-center h-32 gap-6 p-0">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg
            className="absolute inset-0 transform -rotate-90 w-full h-full"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#fce7f3"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#db0075"
              strokeWidth="10"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-black text-sm font-medium z-10">
            <span>Skill Match</span>
            <span className="text-xl font-semibold">{percentage}%</span>
          </div>
        </div>
        <div>
          <p className="text-xl font-semibold text-black">
            {percentage}% Skill Match
          </p>
          <p className="text-lg font-medium text-gray-900">{role}</p>
          <p className="text-xs text-gray-700">
            Based on your recent posted role: {role}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
