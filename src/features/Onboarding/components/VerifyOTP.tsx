"use client";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/InputOTP";
import { register } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import CountdownTimer from "../../../components/CountdownTimer";

// Define types for better type safety
type StudentSignupData = {
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  universityAttended?: string;
  password: string;
};

type CompanySignupData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  companyName: string;
};

function Verify({
  signupDetails,
  accountType,
}: {
  accountType: string;
  signupDetails: StudentSignupData | CompanySignupData | undefined;
}) {
  const navigate = useNavigate();
  const FormSchema = z.object({
    otp: z.string().min(6, {
      message: "Your verification token must be 6 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { mutate: registerMutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast.success("Registration successful! 🎉");
      if (data?.data?.token) {
        localStorage.setItem("kairos_acccess_token", data?.data?.token);
        navigate("/");
      } else {
        throw new Error("Invalid login response");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Invalid job response");
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!signupDetails) {
      return;
    }

    const isCompany = accountType === "company";

    // Type guard functions
    const isStudentData = (data: any): data is StudentSignupData => {
      return "dob" in data;
    };

    const isCompanyData = (data: any): data is CompanySignupData => {
      return "phone" in data && "companyName" in data;
    };

    let finalData: any;

    if (isCompany && isCompanyData(signupDetails)) {
      finalData = {
        email: signupDetails.email,
        firstName: signupDetails.firstName,
        lastName: signupDetails.lastName,
        password: signupDetails.password,
        phone: signupDetails.phone,
        companyName: signupDetails.companyName,
        role: accountType,
        otp: data.otp.toString(),
      };
    } else if (!isCompany && isStudentData(signupDetails)) {
      finalData = {
        email: signupDetails.email,
        firstName: signupDetails.firstName,
        lastName: signupDetails.lastName,
        dob: signupDetails.dob,
        password: signupDetails.password,
        universityAttended: signupDetails.universityAttended,
        role: accountType,
        otp: data.otp.toString(),
      };
    } else {
      console.error(
        "Invalid signup data structure for account type:",
        accountType,
      );
      toast.error("Invalid signup data. Please try again.");
      return;
    }

    console.log("Final data to be sent:", finalData);

    registerMutate(finalData);
  }

  return (
    <>
      <section className="p-5 h-screen">
        <img
          src={"/icons/kairos-logo-black.png"}
          alt="kairos-logo"
          className="cursor-pointer w-28 h-11 mx-auto lg:mx-0 my-14 lg:hidden"
        />

        <section className="grid place-content-center gap-5 md:mt-32">
          <div className="flex flex-col gap-5 px-5 md:px-20 xl:px-0">
            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-center">
                Let&apos;s make it official 🎉
              </h1>
              <p className="text-sm text-gray-500 text-center">
                We&apos;ve sent a 6-digit code to {signupDetails?.email}. Pop it
                in below so we know it&apos;s really you.
              </p>
            </div>

            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup className="flex gap-3 mx-auto">
                              <InputOTPSlot
                                className="h-16 w-[60px] text-[32px]"
                                index={0}
                              />
                              <InputOTPSlot
                                className="h-16 w-[60px]  text-[32px]"
                                index={1}
                              />
                              <InputOTPSlot
                                className="h-16 w-[60px]  text-[32px]"
                                index={2}
                              />

                              <InputOTPSlot
                                className="h-16 w-[60px]  text-[32px]"
                                index={3}
                              />
                              <InputOTPSlot
                                className="h-16 w-[60px]  text-[32px]"
                                index={4}
                              />
                              <InputOTPSlot
                                className="h-16 w-[60px] text-[32px]"
                                index={5}
                              />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CountdownTimer />

                  <Button
                    type="submit"
                    className="w-full mt-10"
                    loading={isPending}
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default Verify;
