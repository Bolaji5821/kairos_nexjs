import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Input } from "@/components/ui/Input";
import { addRequiredAsterisk } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { companySizeOptions, industryOptions } from "@/lib/constants";

export default function CompanyDetails({
  form,
  schema,
}: {
  form: UseFormReturn<any>;
  schema?: any;
}) {
  const { user } = useUser();

  return (
    <>
      <AlertDialogHeader className="text-left pb-6">
        <AlertDialogTitle className="text-2xl font-bold">
          Company Details
        </AlertDialogTitle>

        <p>
          It’s nice to meet you {user?.data?.profile?.firstName}, Let’s get to
          know your company, {user?.data?.profile?.companyName}.
        </p>
      </AlertDialogHeader>

      <div className=" flex flex-col gap-8">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {(schema &&
                  addRequiredAsterisk("Company Name", schema, "companyName")) ||
                  "Company Name"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Type the name of your company"
                  className=""
                  {...field}
                  disabled={!!user?.data?.profile?.companyName}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {(schema &&
                  addRequiredAsterisk("Industry", schema, "industry")) ||
                  "Industry"}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger variant="outline">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[220px]">
                  {industryOptions.map((option) => (
                    <SelectItem key={option.label} value={option.label}>
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
          name="companySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger variant="outline">
                    <SelectValue placeholder="Select your company size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companySizeOptions.map((option) => (
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
          name="companyWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Website</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type your company website"
                  className=""
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
