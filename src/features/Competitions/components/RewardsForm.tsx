import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { rewardTypeOptions } from "@/lib/constants";
import type { UseFormReturn } from "react-hook-form";

export default function RewardsForm({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="">
      <div>
        <h2 className="text-lg font-semibold">Rewards</h2>
        <p className="text-gray-600 text-sm mt-2 mb-4">
          Following steps to post new competition
        </p>
      </div>

      <div className=" mt-10 flex flex-col gap-8">
        <FormField
          control={form.control}
          name="prize"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-xs font-medium">Reward Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className=" h-32">
                  <SelectTrigger variant="outline">
                    <SelectValue
                      placeholder="Select reward type"
                      className="text-base sm:text-xs"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rewardTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prizeAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prize Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter short description"
                  className=""
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
