import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
// import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
// import { Switch } from "@/components/ui/Switch";
import { submissionFormatOptions } from "@/lib/constants";
import type { UseFormReturn } from "react-hook-form";

export default function SubmissionDeadlinesForm({
  form,
}: {
  form: UseFormReturn<any>;
}) {
  return (
    <div className="">
      <div>
        <h2 className="text-lg font-semibold">Submission Details</h2>
        <p className="text-gray-600 text-sm mt-2 mb-4">
          Following steps to post new competition
        </p>
      </div>

      <div className=" mt-10 flex flex-col gap-8">
        <FormField
          control={form.control}
          name="whatToSubmit"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-xs font-medium">
                What should participants submit?
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className=" h-32">
                  <SelectTrigger variant="outline">
                    <SelectValue
                      placeholder="Select a submission medium"
                      className="text-base sm:text-xs"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {submissionFormatOptions.map((option) => (
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

        {/* <div className="flex items-center space-x-2">
          <Switch id="allow-file-upload" />
          <Label htmlFor="airplane-mode">Allow file upload?</Label>
        </div> */}

        <FormField
          control={form.control}
          name="externalApplyLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Link</FormLabel>
              <FormControl>
                <Input placeholder="https://" className="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
