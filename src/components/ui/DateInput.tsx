import { format } from "date-fns";
import { Calendar as CalendarIcon } from "iconsax-react";
import { useState } from "react";
import { type Control } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { cn } from "@/lib/utils";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

type Props = {
  control: Control<any>;
  name: string;
  disable?: boolean;
  placeholder?: string;
  label?: string;
  description?: string;
  allowFutureDateSelection?: boolean;
  hideLabel?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

const DateInput = ({
  control,
  name,
  disable,
  placeholder = "Pick a date",
  label = "Date",
  description,
  allowFutureDateSelection = false,
  hideLabel = false,
  minDate,
  maxDate,
}: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    const defaultMinDate = new Date("1900-01-01");
    const effectiveMinDate = minDate || defaultMinDate;
    const effectiveMaxDate = maxDate;
    // Always disable dates before the minimum date (either provided minDate or 1900)
    if (effectiveMinDate && date < effectiveMinDate) return true;

    // If future date selection is not allowed, disable future dates
    if (!allowFutureDateSelection && date > today) return true;

    // If max date is provided, disable dates after the max date
    if (effectiveMaxDate && date > effectiveMaxDate) return true;

    return false;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {!hideLabel && <FormLabel>{label}</FormLabel>}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full text-left font-normal border-b h-9 rounded-none p-0 px-0 has-[>svg]:px-0",
                    !field.value && "text-muted-foreground",
                  )}
                  disabled={disable}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon
                    color="black"
                    className="ml-auto h-4 w-4 opacity-50"
                  />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    field.onChange(date.toISOString());
                    setIsPopoverOpen(false);
                  }
                }}
                disabled={isDateDisabled}
                captionLayout="dropdown"
                startMonth={minDate || new Date(1900, 0)}
                endMonth={maxDate || new Date(2030, 0)}
                defaultMonth={
                  field.value
                    ? new Date(field.value)
                    : maxDate && maxDate < new Date()
                      ? maxDate
                      : undefined
                }
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateInput;
