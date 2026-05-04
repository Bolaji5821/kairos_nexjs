"use client";

import {
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
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
import { genderOptions } from "@/lib/constants";
import { addRequiredAsterisk } from "@/lib/utils";
import { type UseFormReturn } from "react-hook-form";

export default function AdditionalInformation({
  form,
  schema,
}: {
  form: UseFormReturn<any>;
  schema?: any;
}) {
  return (
    <>
      <AlertDialogHeader className="text-left pb-6">
        <AlertDialogTitle className="text-2xl font-bold">
          Additional Information
        </AlertDialogTitle>
        <p className="">
          Tell us more about yourself to help us personalize your experience.
        </p>
      </AlertDialogHeader>

      <div className=" flex flex-col gap-8">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input
                  placeholder="Tell us something about yourself"
                  className=""
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {(schema && addRequiredAsterisk("Gender", schema, "gender")) ||
                  "Gender"}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger variant="outline">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {genderOptions.map((option) => (
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {(schema &&
                  addRequiredAsterisk("Address", schema, "address")) ||
                  "Address"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Type your address"
                  type="text"
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
