import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import { XIcon } from "lucide-react";
import HalfCircleSkillMatch from "./HalfCircleSkillMatch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Add, ArrowUp } from "iconsax-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/authService";
import useUser from "@/hooks/useUser";
import { useState } from "react";
import { removeDuplicates } from "@/lib/utils";

type Props = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  jobSkills?: string[];
  userSkills?: string[];
  matchedSkillsCount?: number;
  totalRequiredSkills?: number;
};

function BoostSkillMatch({
  open,
  setOpen,
  jobSkills = [],
  userSkills = [],
  matchedSkillsCount = 0,
  totalRequiredSkills = 0,
}: Props) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [addingSkills, setAddingSkills] = useState<Set<string>>(new Set());

  // Remove duplicates from both job skills and user skills
  const uniqueJobSkills = removeDuplicates(jobSkills);
  const uniqueUserSkills = removeDuplicates(userSkills);

  const { mutate: updateUserSkills, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onSettled: (_, __, variables) => {
      // Remove the skill from the adding state regardless of success/failure
      const formData = variables as FormData;
      const skillsData = formData.get("skillsets") as string;
      if (skillsData) {
        const addedSkills = skillsData.split(",");
        setAddingSkills((prev) => {
          const newSet = new Set(prev);
          addedSkills.forEach((skill) => newSet.delete(skill.trim()));
          return newSet;
        });
      }
    },
  });

  const handleAddSkill = (skillToAdd: string) => {
    if (!user?.data) return;

    // Add skill to the adding state to show loading
    setAddingSkills((prev) => new Set(prev).add(skillToAdd));

    // Get current user skills
    const currentSkills =
      user.data.skillSet?.map((skill) => skill.title || skill.id) || [];

    // Add the new skill to the existing skills and remove duplicates
    const updatedSkills = removeDuplicates([...currentSkills, skillToAdd]);

    // Create FormData for the update
    const formData = new FormData();
    formData.append("skillsets", updatedSkills.join(","));

    updateUserSkills(formData);
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="rounded-tl-lg rounded-bl-lg sm:max-w-md h-screen overflow-y-auto pb-5">
        <SheetHeader>
          <div className="flex flex-col gap-3 bg-gradient-to-r from-custom-blue-500 via-purple-900 to-custom-magenta-500 rounded-xl p-6">
            <SheetTitle className="text-white text-xl">
              Boost Your Skill Match
            </SheetTitle>
            <SheetDescription className="text-white">
              Add more skills to your profile to improve your match with this
              job.
            </SheetDescription>

            <SheetClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-8 right-8 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
              <XIcon className="size-5 text-white" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>

        <HalfCircleSkillMatch
          current={matchedSkillsCount}
          total={totalRequiredSkills}
          hideButton
        />

        <div className="px-4">
          <p>Skills Required</p>

          <div className="flex flex-col gap-2 mt-2 text-custom-magenta-500 ">
            {uniqueJobSkills.length > 0 ? (
              uniqueJobSkills.map((skill, index) => {
                const isUserHasSkill = uniqueUserSkills.some(
                  (userSkill) =>
                    userSkill.toLowerCase() === skill.toLowerCase(),
                );

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-2"
                  >
                    <div className="flex items-start gap-2 w-1/3">
                      <Badge
                        variant="outline"
                        className="bg-custom-blue-50 text-custom-blue-900 h-9 rounded-lg whitespace-break-spaces"
                      >
                        {skill}
                      </Badge>
                    </div>

                    <div className="flex items-start gap-2 w-2/3">
                      {isUserHasSkill ? (
                        <Button className="px-2 h-9 items-center hover:bg-accent bg-accent text-black">
                          <div className="size-5">
                            <img
                              src="/icons/check.svg"
                              alt="check"
                              className="object-contain h-full w-full"
                            />
                          </div>
                          Added
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            className="px-2 h-9"
                            onClick={() => handleAddSkill(skill)}
                            disabled={addingSkills.has(skill) || isPending}
                            loading={addingSkills.has(skill)}
                          >
                            <Add color="white" className="size-5" />
                            {addingSkills.has(skill) ? "Adding..." : "Add"}
                          </Button>

                          <Button
                            className="px-2 h-9"
                            onClick={() =>
                              window.open(
                                `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}`,
                                "_blank",
                              )
                            }
                          >
                            Learn
                            <ArrowUp color="white" className="size-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-4">
                No specific skills required for this job
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default BoostSkillMatch;
