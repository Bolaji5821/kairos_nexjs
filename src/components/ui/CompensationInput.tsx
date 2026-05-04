import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { currencyOptions, durationOptions } from "@/lib/constants";

interface CompensationInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CompensationInput({
  value = "",
  onChange,
  placeholder = "Enter amount",
  className = "",
}: CompensationInputProps) {
  // Parse the compensation string into its components
  const parseCompensation = (value: string) => {
    if (!value) return { currency: "₦", amount: "", duration: "per month" };

    // Find which currency symbol the string starts with
    const foundCurrency = currencyOptions.find((option) =>
      value.startsWith(option.value),
    );

    if (foundCurrency) {
      // Remove currency symbol and get the rest
      const withoutCurrency = value.slice(foundCurrency.value.length).trim();

      // Split at the first whitespace
      const firstSpaceIndex = withoutCurrency.indexOf(" ");

      if (firstSpaceIndex === -1) {
        // No space found, it's just the amount
        return {
          currency: foundCurrency.value,
          amount: withoutCurrency,
          duration: "per month",
        };
      }

      const amount = withoutCurrency.slice(0, firstSpaceIndex);
      const durationText = withoutCurrency.slice(firstSpaceIndex + 1);

      // Find matching duration option or default to "per month"
      const foundDuration = durationOptions.find(
        (option) => option.value === durationText,
      );

      return {
        currency: foundCurrency.value,
        amount,
        duration: foundDuration ? foundDuration.value : "per month",
      };
    }

    // Fallback for cases where currency is not at the start
    const firstSpaceIndex = value.indexOf(" ");
    if (firstSpaceIndex === -1) {
      return { currency: "₦", amount: value, duration: "per month" };
    }

    const firstPart = value.slice(0, firstSpaceIndex);
    const durationText = value.slice(firstSpaceIndex + 1);

    // Check if first part contains currency symbol
    const currencyMatch = currencyOptions.find((option) =>
      firstPart.includes(option.value),
    );

    if (currencyMatch) {
      const amount = firstPart.replace(currencyMatch.value, "");
      const foundDuration = durationOptions.find(
        (option) => option.value === durationText,
      );

      return {
        currency: currencyMatch.value,
        amount,
        duration: foundDuration ? foundDuration.value : "per month",
      };
    }

    return { currency: "₦", amount: "", duration: "per month" };
  };

  const { currency, amount, duration } = parseCompensation(value);

  const updateCompensation = (
    newCurrency?: string,
    newAmount?: string,
    newDuration?: string,
  ) => {
    const finalCurrency = newCurrency ?? currency;
    const finalAmount = newAmount ?? amount;
    const finalDuration = newDuration ?? duration;

    // Only include duration if it's not empty
    const compensationString = finalDuration
      ? `${finalCurrency}${finalAmount} ${finalDuration}`.trim()
      : `${finalCurrency}${finalAmount}`.trim();

    onChange(compensationString);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Currency Selector */}
      <Select
        key={`currency-${currency}`}
        onValueChange={(newCurrency) => updateCompensation(newCurrency)}
        value={currency}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="₦" />
        </SelectTrigger>
        <SelectContent>
          {currencyOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Amount Input */}
      <Input
        placeholder={placeholder}
        className="flex-1"
        type="number"
        value={amount}
        onChange={(e) => updateCompensation(undefined, e.target.value)}
      />

      {/* Duration Selector */}
      <Select
        key={`duration-${duration}`}
        onValueChange={(newDuration) =>
          updateCompensation(undefined, undefined, newDuration)
        }
        value={duration}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="per month" />
        </SelectTrigger>
        <SelectContent>
          {durationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
