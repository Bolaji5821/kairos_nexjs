import CountdownTimer from "@/components/CountdownTimer";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { forgotPassword, resetPassword } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const createPasswordSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(2, "Please enter your password"),
    otp: z.string().min(2, "Please enter your OTP"),
    confirmPassword: z.string().min(2, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  type FormData = z.infer<typeof createPasswordSchema>;

  useEffect(() => {
    form.setValue("email", state?.email || "");
  }, [state]);

  const form = useForm<FormData>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const isDisabled =
    !confirmPassword || !password || password !== confirmPassword;

  const { mutate: mutateResetPassword, isPending: resetingPassword } =
    useMutation({
      mutationFn: resetPassword,
      onSuccess: (data) => {
        if (data) {
          toast.success("Password reset successfully, proceed to login.");
          form.reset();
          navigate("/auth/login");
        } else {
          throw new Error("Error trying to reset your password");
        }
      },
      onError: (error) => {
        toast.error(
          error.message || "An error occurred while reset your password",
        );
      },
    });

  const { mutate: mutateResendOTP, isPending: resendingOTP } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      if (data) {
        toast.success(
          "Password recovery OTP sent successfully. Please check your email.",
        );
      } else {
        throw new Error("Error trying to resend OTP");
      }
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred while sending OTP");
    },
  });

  const onSubmit = (data: FormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = data;

    mutateResetPassword(rest);
  };

  return (
    <section className="grid place-content-center gap-5 h-screen">
      <div className=" flex flex-col gap-5 px-5 md:px-20 xl:px-0">
        <img
          src={"/icons/kairos-logo-black.png"}
          alt="kairos-logo"
          className="cursor-pointer w-28 h-11 mx-auto lg:hidden mb-10 "
        />

        <section className="grid place-content-center gap-5">
          <div className="  flex flex-col gap-5 md:w-[500px]">
            <h1 className=" text-xl md:text-2xl lg:text-4xl font-bold text-center">
              Reset Password
            </h1>

            <div className=" w-full pt-10">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className=" space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            {...field}
                            disabled={!!state?.email}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One Time Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your OTP" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
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
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
                            >
                              {showConfirmPassword ? (
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

                  <CountdownTimer
                    isLoading={resendingOTP}
                    handleSend={() =>
                      mutateResendOTP({ email: form.getValues("email") })
                    }
                  />

                  <Button
                    type="submit"
                    disabled={isDisabled}
                    loading={resetingPassword}
                    className=" w-full mt-10"
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
