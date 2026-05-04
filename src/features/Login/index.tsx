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
import TermsLink from "@/components/ui/TermsLink";
import { loginUser } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

function Login() {
  const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(2, "Please enter your password"),
  });

  const navigate = useNavigate();

  type FormData = z.infer<typeof formSchema>;

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const email = form.watch("email");
  const password = form.watch("password");

  const isDisabled = !email || !password;

  const { mutate: mutateLogin, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data?.data) {
        localStorage.setItem("kairos_acccess_token", data?.data);
        navigate("/");
      } else {
        throw new Error("Invalid login response");
      }
    },
  });

  const onSubmit = (data: FormData) => mutateLogin(data);

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
            <div className="space-y-2 pb-5">
              <h1 className=" text-xl md:text-2xl lg:text-4xl font-bold text-center">
                Welcome back!
              </h1>
              <p className="text-sm text-gray-500 text-center">
                Let’s get you back to where you left off
              </p>
            </div>

            <div className=" w-full">
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
                          <Input placeholder="Enter your email" {...field} />
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
                              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
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

                  <div className="flex items-center justify-between">
                    <p className="text-xs">
                      Forgot Password?&nbsp;
                      <Link
                        to="/auth/forgot-password"
                        className=" text-xs text-custom-magenta-500"
                      >
                        Reset Password
                      </Link>
                    </p>
                  </div>

                  <div className="text-xs mt-3">
                    By continuing, you acknowledge and accept our
                    <TermsLink className="pl-1" />
                  </div>

                  <Button
                    type="submit"
                    disabled={isDisabled}
                    loading={isPending}
                    className=" w-full mt-4"
                  >
                    Login
                  </Button>

                  <div className="flex items-center justify-center text-sm">
                    Not yet created an account?
                    <Link
                      to="/auth/onboarding"
                      className=" text-sm text-custom-magenta-500 pl-2"
                    >
                      Signup
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Login;
