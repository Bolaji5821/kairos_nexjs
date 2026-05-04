import { checkifEmailExists, getOTP } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CompanyForm from "./CompanyForm";
import StudentForm from "./StudentForm";
import { toastError } from "@/lib/utils";

// Define separate types for better type safety
export type StudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  universityAttended?: string;
};

export type CompanyFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
};

// Student schema
const studentSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      { message: "Invalid date format" },
    ),
  universityAttended: z.string().optional(),
});

// Company schema
const companySchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z
    .string()
    .min(1, "Company Email is required")
    .email("Please provide a valid email"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  phone: z.string().min(1, "Phone number is required"),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
});

function SignUp({
  accountType,
  handleContinue,
  setSignupDetails,
}: {
  accountType: string;
  handleContinue: () => void;
  setSignupDetails: (data: any) => void;
}) {
  const isCompany = accountType === "company";

  // Create separate forms for each type
  const studentForm = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dob: "",
      universityAttended: "",
    },
  });

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      companyName: "",
    },
  });

  const { mutateAsync: getOTPMutate, isPending } = useMutation({
    mutationFn: getOTP,
  });

  async function onSubmit(data: StudentFormData | CompanyFormData) {
    const exists = await checkifEmailExists(data.email);
    if (exists) {
      toastError("Email already exists. Please use a different email.");
      return;
    }
    await getOTPMutate({
      destination: "email",
      identity: data.email,
    }).then(() => {
      setSignupDetails(data);
      handleContinue();
    });
  }

  return (
    <>
      <section className="grid place-content-center gap-5 h-screen">
        <div className=" flex flex-col gap-5 md:px-20 xl:px-0">
          <img
            src={"/icons/kairos-logo-black.png"}
            alt="kairos-logo"
            className="cursor-pointer w-28 h-11 mx-auto lg:hidden mb-10 "
          />

          <section className="grid place-content-center gap-5 md:mt-8">
            <div className="  flex flex-col gap-5 px-5 md:px-20 xl:px-0">
              <div className="space-y-2 pb-5">
                <h1 className=" text-xl md:text-2xl lg:text-4xl font-bold text-center">
                  You&apos;re in the right place!
                </h1>
                <p className="text-sm text-gray-500 text-center">
                  Let&apos;s get your account set up and ready for what&apos;s
                  next.
                </p>
              </div>

              <div>
                {isCompany ? (
                  <CompanyForm
                    form={companyForm}
                    onSubmit={onSubmit}
                    isPending={isPending}
                  />
                ) : (
                  <StudentForm
                    form={studentForm}
                    onSubmit={onSubmit}
                    isPending={isPending}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

export default SignUp;
