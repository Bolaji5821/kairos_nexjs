import Skills from "@/features/ProfileSetup/components/Skills";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";

export default function JobSkills({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="">
      <h2 className="text-lg font-semibold">Skills Tags</h2>
      <p className="text-gray-600 text-sm mt-2 mb-4">
        Select skills (for filtering + match %)
      </p>

      <FormField
        control={form.control}
        name="skills"
        render={() => (
          <FormItem>
            <FormControl>
              <Skills hideTitle form={form} fieldName="skills" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
