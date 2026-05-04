import { useState } from "react";
import AccountType from "./components/AccountType";
import SignUp from "./components/Signup";
import VerifyOTP from "./components/VerifyOTP";

const Steps = {
  AccountType: 0,
  Signup: 1,
  VerifyOTP: 2,
} as const;

export default function Onboarding() {
  const [step, setStep] = useState<number>(Steps.AccountType);
  const [signupDetails, setSignupDetails] = useState<
    | {
        email: string;
        firstName: string;
        lastName: string;
        dob: string;
        universityAttended?: string;
        password: string;
      }
    | undefined
  >(undefined);
  const [accountType, setAccountType] = useState("student");

  const handleContinue = () => {
    if (accountType) {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div>
      {step === Steps.AccountType && (
        <AccountType
          accountType={accountType}
          setAccountType={setAccountType}
          handleContinue={handleContinue}
        />
      )}

      {step === Steps.Signup && (
        <SignUp
          accountType={accountType}
          handleContinue={handleContinue}
          setSignupDetails={setSignupDetails}
        />
      )}

      {step === Steps.VerifyOTP && (
        <VerifyOTP accountType={accountType} signupDetails={signupDetails} />
      )}
    </div>
  );
}
