import { Button } from "@/components/ui/Button";
import DateInput from "@/components/ui/DateInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import UniversityCombobox from "@/components/UniversityCombobox";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Link } from "react-router";
import type { StudentFormData } from "./Signup";

type Props = {
  form: UseFormReturn<any>;
  onSubmit: (data: StudentFormData) => void;
  isPending: boolean;
};

function StudentForm({ form, onSubmit, isPending }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-3 ">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DateInput
          control={form.control}
          name="dob"
          label="Date of Birth"
          maxDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 16)) // min age of 16
          }
          placeholder="Choose your birth date"
        />

        <FormField
          control={form.control}
          name="universityAttended"
          render={({ field }) => (
            <UniversityCombobox
              field={field}
              label="University Attended"
              placeholder="Select university"
              isOptional={true}
            />
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer opacity-60"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full mt-5" type="submit" loading={isPending}>
          Next
        </Button>

        <div className="flex items-center justify-center text-sm">
          Already signed up?
          <Link
            to="/auth/login"
            className=" text-sm text-custom-magenta-500 pl-1"
          >
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}

export default StudentForm;
