import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import useUser from "@/hooks/useUser";
import { USER_ROLES } from "@/lib/constants";
import queryClient from "@/lib/query";
import { verifyCac, verifyNin } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Building2, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ninFormSchema = z.object({
  nin: z
    .string()
    .min(11, "NIN must be 11 digits")
    .max(11, "NIN must be 11 digits")
    .regex(/^\d+$/, "NIN must contain only numbers"),
  firstname: z.string().min(2, "First name is required"),
  lastname: z.string().min(2, "Last name is required"),
});

type NinFormData = z.infer<typeof ninFormSchema>;

// NIN Verification Modal for Students
function NINVerificationModal() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<NinFormData>({
    resolver: zodResolver(ninFormSchema),
    defaultValues: {
      nin: "",
      firstname: user?.data?.profile?.firstName || "",
      lastname: user?.data?.profile?.lastName || "",
    },
  });

  const { mutate: verifyNinMutation, isPending } = useMutation({
    mutationFn: verifyNin,
    onSuccess: (data) => {
      if (data?.data?.verified) {
        toast.success(
          "NIN verification successful! Your profile is now verified.",
        );
        // Refresh user data to update verification status
        queryClient.invalidateQueries({ queryKey: ["user"] });
        setIsOpen(false);
        form.reset();
      } else {
        toast.error(
          "Verification failed. Please check your details and try again.",
        );
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Verification failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: NinFormData) => {
    verifyNinMutation(data);
  };

  const nin = form.watch("nin");
  const firstname = form.watch("firstname");
  const lastname = form.watch("lastname");
  const isDisabled = !nin || !firstname || !lastname;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full px-4">
          <Shield className="text-xl mr-2" />
          Verify Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-custom-magenta-500" />
            Verify Your Identity
          </DialogTitle>
          <DialogDescription>
            Enter your NIN (National Identification Number) and your name as it
            appears on your NIN to verify your profile.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="nin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIN (National Identification Number)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your 11-digit NIN"
                      maxLength={11}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name (as it appears on NIN)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name (as it appears on NIN)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isDisabled}
                loading={isPending}
              >
                Verify NIN
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const cacFormSchema = z.object({
  regNumber: z
    .string()
    .min(1, "CAC registration number is required")
    .regex(/^(RC|BN|IT)?\d+$/i, "Please enter a valid CAC registration number"),
  companyName: z.string().min(2, "Company name is required"),
});

type CacFormData = z.infer<typeof cacFormSchema>;

// CAC Verification Modal for Companies
function CACVerificationModal() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CacFormData>({
    resolver: zodResolver(cacFormSchema),
    defaultValues: {
      regNumber: "",
      companyName: user?.data?.profile?.companyName || "",
    },
  });

  const { mutate: verifyCacMutation, isPending } = useMutation({
    mutationFn: verifyCac,
    onSuccess: (data) => {
      if (data?.data?.verified) {
        toast.success(
          "CAC verification successful! Your company is now verified.",
        );
        // Refresh user data to update verification status
        queryClient.invalidateQueries({ queryKey: ["user"] });
        setIsOpen(false);
        form.reset();
      } else {
        toast.error(
          "Verification failed. Please check your details and try again.",
        );
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Verification failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: CacFormData) => {
    verifyCacMutation({
      regNumber: data.regNumber,
      companyName: data.companyName,
      companyEmail: "",
    });
  };

  const regNumber = form.watch("regNumber");
  const companyName = form.watch("companyName");
  const isDisabled = !regNumber || !companyName;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full px-4">
          <Shield className="text-xl mr-2" />
          Verify Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-custom-magenta-500" />
            Verify Your Company
          </DialogTitle>
          <DialogDescription>
            Enter your CAC registration number and company name as it appears on
            your CAC registration document to verify your company.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="regNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CAC Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. RC100001 or BN100001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name (as it appears on CAC)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isDisabled}
                loading={isPending}
              >
                Verify Company
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Main component that renders the appropriate verification flow
export default function VerificationButton() {
  const { user } = useUser();
  const isCompany = user?.data.role === USER_ROLES.Company;

  if (isCompany) {
    return <CACVerificationModal />;
  }

  return <NINVerificationModal />;
}
