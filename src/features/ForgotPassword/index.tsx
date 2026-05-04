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
import { forgotPassword } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

export default function ForgotPassword() {
  const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
  });

  const navigate = useNavigate();

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const email = form.watch("email");

  const isDisabled = !email;

  const { mutate: mutateForgotPassword, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      if (data) {
        toast.success(
          "Password recovery OTP sent successfully. Please check your email.",
        );
        navigate("/auth/reset-password", {
          state: { email: form.getValues("email") },
        });
      } else {
        throw new Error("Invalid login response");
      }
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred while sending OTP");
    },
  });

  const onSubmit = (data: FormData) => mutateForgotPassword(data);

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
              Forgot Password
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
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isDisabled}
                    loading={isPending}
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
