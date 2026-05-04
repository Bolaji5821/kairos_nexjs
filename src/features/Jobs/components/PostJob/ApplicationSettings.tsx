import DateInput from "@/components/ui/DateInput";
import type { UseFormReturn } from "react-hook-form";

export default function ApplicationSettings({
  form,
}: {
  form: UseFormReturn<any>;
}) {
  return (
    <div className="">
      <div>
        <h2 className="text-lg font-semibold">Application Settings</h2>
        <p className="text-gray-600 text-sm mt-2 mb-4">
          Configure when applications will be accepted for this position.
        </p>
      </div>

      <div className=" mt-10 flex flex-col gap-8">
        <DateInput
          control={form.control}
          name="applicationOpenDate"
          label="Application Start Date"
          placeholder="Choose an application date"
          allowFutureDateSelection
        />

        <DateInput
          control={form.control}
          name="applicationCloseDate"
          label="Application End Date"
          placeholder="Choose a deadline date"
          allowFutureDateSelection
          // minimum date is today by 12:00:00
          minDate={new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </div>
    </div>
  );
}
