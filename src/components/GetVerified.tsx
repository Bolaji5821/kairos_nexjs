import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import VerificationButton from "@/features/Onboarding/components/QoreIDButton";
import useUser from "@/hooks/useUser";
import { USER_ROLES } from "@/lib/constants";
import { Check, CheckCircle2, Home, UserCheck } from "lucide-react";
import { Link } from "react-router";

export default function GetVerified() {
  const { user } = useUser();
  const isCompany = user?.data.role === USER_ROLES.Company;
  const isVerified = user?.data.isKycDone;

  // Show verified success state
  if (isVerified) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4 min-h-[80vh]">
        <div className="max-w-2xl w-full">
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full blur-xl opacity-20"></div>
              <Avatar className="relative rounded-full size-28 border-4 border-white shadow-lg">
                <AvatarImage
                  src={
                    user?.data?.profile?.profilePicture ??
                    "https://kairos-nexus.s3.us-east-2.amazonaws.com/public-default/generic-avatar.png"
                  }
                  alt={`${user?.data?.profile?.firstName} ${user?.data?.profile?.lastName}`}
                />
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-green-400 to-emerald-600 text-white">
                  {user?.data?.profile?.firstName?.[0] ?? ""}
                </AvatarFallback>
              </Avatar>
              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-full p-1.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-semibold md:font-bold text-gray-900 mb-2">
              You're Verified! 🎉
            </h1>
            <p className="text-md md:text-lg text-gray-600">
              Congratulations, {user?.data?.profile?.firstName}! Your profile
              has been successfully verified.
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 rounded-full p-4">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">
                Verification Complete
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Your identity has been verified. You now have full access to all
                features and can enjoy the benefits of being a verified user.
              </p>
            </div>

            {/* Benefits Unlocked */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Faster matching with opportunities
                </p>
              </div>

              <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Increased trust from {isCompany ? "candidates" : "recruiters"}
                </p>
              </div>

              <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Priority access to Kairos' features
                </p>
              </div>
            </div>

            {/* Go to Dashboard Button */}
            <div className="text-center">
              <Link to="/">
                <Button className="w-full max-w-md px-6">
                  <Home className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show verification form for unverified users
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-custom-magenta-400 to-custom-magenta-600 rounded-full blur-xl opacity-20"></div>
            <Avatar className="relative rounded-full size-28 border-4 border-white shadow-lg">
              <AvatarImage
                src={
                  user?.data?.profile?.profilePicture ??
                  "https://kairos-nexus.s3.us-east-2.amazonaws.com/public-default/generic-avatar.png"
                }
                alt={`${user?.data?.profile?.firstName} ${user?.data?.profile?.lastName}`}
              />
              <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-custom-magenta-400 to-custom-magenta-600 text-white">
                {user?.data?.profile?.firstName?.[0] ?? ""}
              </AvatarFallback>
            </Avatar>
          </div>

          <h1 className="text-3xl font-semibold md:font-bold text-gray-900 mb-2">
            Welcome aboard, {user?.data?.profile?.firstName}! 🎉
          </h1>
          <p className="text-md md:text-lg text-gray-600">
            Your profile has been created successfully!
          </p>
        </div>

        {/* Verification Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">
              Let's verify your profile
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Verifying your profile helps us connect you faster to the right
              opportunities. You'll need to provide the following information:
            </p>
          </div>

          {/* Action Button - Moved higher up */}
          <div className="text-center mb-8">
            <div className="max-w-md mx-auto">
              <VerificationButton />
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {isCompany
                ? "Verify your company using your CAC registration"
                : "Verify instantly using your NIN"}
            </p>
          </div>

          {/* Requirements List */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {isCompany
                    ? "CAC Registration Number"
                    : "NIN (National Identification Number)"}
                </p>
                <p className="text-sm text-gray-600">
                  {isCompany
                    ? "Your company's CAC registration number (e.g. RC100001)"
                    : "Your 11-digit NIN to verify your identity"}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {isCompany ? "Company Name" : "Name Verification"}
                </p>
                <p className="text-sm text-gray-600">
                  {isCompany
                    ? "Company name as it appears on your CAC registration"
                    : "Your first and last name as it appears on your NIN"}
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-custom-magenta-50 to-purple-50 rounded-xl p-6 border border-custom-magenta-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Check className="w-5 h-5 text-custom-magenta-600 mr-2" />
              Verification Benefits
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-custom-magenta-500 rounded-full mr-3"></div>
                Faster matching with opportunities
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-custom-magenta-500 rounded-full mr-3"></div>
                Increased trust from recruiters
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-custom-magenta-500 rounded-full mr-3"></div>
                Priority access to premium features
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
