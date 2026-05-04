import { useCallback, useEffect, useState } from "react";

type TimerProps = {
  targetDate: string; // ISO date string of the deadline
};

export default function Timer({ targetDate }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeRemaining = useCallback(() => {
    const now = new Date();
    const deadline = new Date(targetDate);

    // Check if the deadline is a valid date
    if (isNaN(deadline.getTime())) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const timeDiff = deadline.getTime() - now.getTime();

    if (timeDiff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = totalHours >= 24 ? Math.floor(totalHours / 24) : 0;
    const hours = totalHours >= 24 ? totalHours % 24 : totalHours;
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }, [targetDate]);

  useEffect(() => {
    // Calculate initial time
    setTimeRemaining(calculateTimeRemaining());

    // Set up interval to update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  const format = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex gap-1 items-center font-medium text-gray-800">
      {timeRemaining.days > 0 && (
        <>
          <div className="flex items-center gap-1">
            <span className="text-custom-magenta-500 font-bold text-base">
              {format(timeRemaining.days)}
            </span>
            <span className="text-xs">
              {timeRemaining.days === 1 ? "day" : "days"}
            </span>
          </div>

          <span className="text-gray-800 font-bold text-base">:</span>
        </>
      )}

      <div className="flex items-center gap-1">
        <span className="text-custom-magenta-500 font-bold text-base">
          {format(timeRemaining.hours)}
        </span>
        <span className="text-xs">
          {timeRemaining.hours === 1 ? "hour" : "hours"}
        </span>
      </div>

      <span className="text-gray-800 font-bold text-base">:</span>

      <div className="flex items-center gap-1">
        <span className="text-custom-magenta-500 font-bold text-base">
          {format(timeRemaining.minutes)}
        </span>
        <span className="text-xs">mins</span>
      </div>

      <span className="text-gray-800 font-bold text-base">:</span>

      <div className="flex items-center gap-1">
        <span className="text-custom-magenta-500 font-bold text-base">
          {format(timeRemaining.seconds)}
        </span>
        <span className="text-xs">secs</span>
      </div>
    </div>
  );
}
