import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { cn } from "@/lib/utils";
import TermsLink from "@/components/ui/TermsLink";
import { Link } from "react-router";
import individualImg from "/illustrations/individual-accounttype.png";
import recruiterImg from "/illustrations/recruiter-accounttype.png";

export default function AccountType({
  accountType,
  setAccountType,
  handleContinue,
}: {
  accountType: string;
  setAccountType: (accountType: string) => void;
  handleContinue: () => void;
}) {
  const accountData = [
    {
      imgUrl: individualImg,
      value: "student",
      label: "Individual",
      text: "Perfect for students and job seekers looking to showcase their skills and find opportunities.",
    },
    {
      imgUrl: recruiterImg,
      value: "company",
      label: "Recruiter / Company",
      text: "Ideal for companies and recruiters seeking to post jobs and find talented candidates.",
    },
  ];

  return (
    <section className="grid place-content-center gap-5 h-screen">
      <div className=" flex flex-col gap-5 px-5 md:px-20 xl:px-0">
        <img
          src={"/icons/kairos-logo-black.png"}
          alt="kairos-logo"
          className="cursor-pointer w-28 h-11 mx-auto lg:hidden mb-10 "
        />

        <div>
          <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-center">
            Choose account type
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Select the account type that best describes your role and goals.
          </p>
        </div>

        <RadioGroup defaultValue={accountData[0]?.value} className="gap-5">
          {accountData.map((account) => (
            <div
              onClick={() => setAccountType(account.value)}
              className={cn(
                "flex cursor-pointer space-x-2 h-36 border rounded-lg p-4 relative overflow-hidden",
                accountType === account.value &&
                  "bg-custom-magenta-50 border-custom-magenta-500",
              )}
            >
              <RadioGroupItem
                value={account.value}
                checked={accountType === account.value}
                id={account.value}
                className="mt-1.5 cursor-pointer"
              />

              <div className="w-3/5 space-y-2">
                <Label htmlFor={account.value} className="text-base md:text-lg">
                  {account.label}
                </Label>

                <p className="text-xs md:text-sm text-gray-500">
                  {account.text}
                </p>
              </div>

              <div className="absolute -right-0.5 bottom-0">
                <img src={account.imgUrl} alt="" />
              </div>
            </div>
          ))}
        </RadioGroup>

        <div className="text-sm text-center mt-3">
          By continuing, you acknowledge and accept our
          <TermsLink className="pl-1" />
        </div>

        <div>
          <Button className="w-full mt-4" onClick={handleContinue}>
            Continue
          </Button>

          <p className="text-sm text-gray-500 text-center pt-1.5">
            Already signed up?&nbsp;
            <Link to="/auth/login" className="text-custom-magenta-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
