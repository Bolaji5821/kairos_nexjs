import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

export default function CountdownTimer({
  isLoading = false,
  handleSend,
}: {
  isLoading?: boolean;
  handleSend?: () => void;
}) {
  const TIME = 60; // 1 minute in seconds
  const [timeLeft, setTimeLeft] = useState(TIME);

  useEffect(() => {
    if (timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleResend = () => {
    if (handleSend) handleSend();
    setTimeLeft(TIME);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <p className=" text-center text-xs">
      Resend code&nbsp;
      <span>
        {timeLeft > 0 ? (
          `in ${formatTime(timeLeft)}`
        ) : (
          <Button
            onClick={() => {
              handleResend();
              setTimeLeft(TIME);
            }}
            variant="link"
            className=" h-8 px-2 underline text-custom-magenta-500 underline-offset-5"
            size={"sm"}
          >
            {isLoading ? "Resending..." : "Resend"}
          </Button>
        )}
      </span>
    </p>
  );
}
