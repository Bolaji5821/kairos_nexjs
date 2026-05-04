import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import useUser from "@/hooks/useUser";
import { USER_ROLES } from "@/lib/constants";
import { updateProfilePicture } from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import Profile from "./components/Profile";
import Security from "./components/Security";
import Settings from "./components/Settings";

export default function SettingsPage() {
  const { user, isLoading } = useUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const profilePictureMutation = useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile picture updated successfully");
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile picture");
      setIsUploading(false);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("profile-pic", file);

      setIsUploading(true);
      profilePictureMutation.mutate(formData);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
      </div>
    );
  }

  if (!user?.data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Unable to load user data</p>
      </div>
    );
  }

  const userData = user.data;
  const isCompany = userData.role === USER_ROLES.Company;

  // Get display name and company information
  const displayName = isCompany
    ? userData.profile.companyName
    : `${userData.profile.firstName} ${userData.profile.lastName}`;

  const fallbackInitials = isCompany
    ? userData.profile.companyName?.substring(0, 2).toUpperCase() || "CO"
    : `${userData.profile.firstName?.[0] || ""}${userData.profile.lastName?.[0] || ""}`;

  return (
    <div className="min-h-screen">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      <div className="w-full">
        <div className="">
          <div className="h-44 bg-gradient-to-r from-custom-blue-500 via-purple-900 to-custom-magenta-500"></div>
        </div>

        <div className="flex justify-between items-center p-2 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative">
              <div className="absolute -top-20 left-0">
                <div className="relative group">
                  <Avatar
                    className="w-40 h-40 cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <AvatarImage
                      src={
                        userData.profile.profilePicture ??
                        "https://kairos-nexus.s3.us-east-2.amazonaws.com/public-default/generic-avatar.png"
                      }
                      style={{ objectFit: "cover" }}
                      alt={displayName || "Profile picture"}
                    />
                    <AvatarFallback className="text-2xl">
                      {fallbackInitials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Upload overlay */}
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-50 transition-opacity cursor-pointer flex items-center justify-center"
                    onClick={handleImageClick}
                  >
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 ml-0 lg:mt-0 lg:ml-44 space-y-1.5">
              <h2 className="text-2xl font-bold">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
              {isCompany && userData.profile.companyName && (
                <p className="text-sm capitalize text-muted-foreground">
                  {userData.profile.industry &&
                    `${userData.profile.industry} • `}
                  {userData.profile.companySize &&
                    `${userData.profile.companySize} employees`}
                </p>
              )}

              {!userData.isKycDone && (
                <Link
                  to={"/verify"}
                  className="bg-custom-magenta-50 hover:bg-custom-magenta-50 text-custom-magenta-500 h-8 flex px-2 items-center rounded-md text-sm font-medium transition-colors w-fit"
                >
                  Verify Profile <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="mt-8 items-start">
          <TabsList>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:text-custom-magenta-500"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:text-custom-magenta-500"
            >
              Security
            </TabsTrigger>
            {!isCompany && (
              <TabsTrigger
                value="settings"
                className="data-[state=active]:text-custom-magenta-500"
              >
                Settings
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent className="w-full" value="profile">
            <Profile />
          </TabsContent>
          <TabsContent value="security">
            <Security />
          </TabsContent>
          <TabsContent value="job-alerts">
            <Settings />
          </TabsContent>
          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
