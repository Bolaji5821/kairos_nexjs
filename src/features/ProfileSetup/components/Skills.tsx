import React, { useEffect, useState, useMemo } from "react";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn, removeDuplicates, addRequiredAsterisk } from "@/lib/utils";
import type { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getSkills } from "@/services/jobsService";
import type { Skill } from "@/lib/types";
import { debounce } from "lodash";

export default function Skills({
  form,
  hideTitle,
  fieldName = "skillsets",
  schema,
}: {
  form: UseFormReturn<any>;
  hideTitle?: boolean;
  fieldName?: string;
  schema?: any;
}) {
  const [customSkill, setCustomSkill] = useState("");
  const [errors, setErrors] = useState({ skills: "" });
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search query
  const debouncedSearchQuery = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    [],
  );

  const params = {
    pageNo: 1,
    ...(searchQuery && { query: searchQuery }),
  };

  const {
    data: skills,
    isLoading: skillsLoading,
    error: skillsError,
  } = useQuery({
    queryKey: ["skills", params],
    queryFn: () => getSkills(params),
    enabled: open, // Only fetch when dropdown is open
  });

  // Use form state for selected skills
  const selectedSkills = form.watch(fieldName) || [];

  useEffect(() => {
    // Set default value if not set
    if (!selectedSkills || selectedSkills.length === 0) {
      form.setValue(fieldName, []);
    } else {
      // Remove duplicates from existing skills (case-insensitive)
      const uniqueSkills = removeDuplicates(selectedSkills);
      if (uniqueSkills.length !== selectedSkills.length) {
        form.setValue(fieldName, uniqueSkills);
        // Optionally show a message about duplicate removal
        console.log(
          `Removed ${selectedSkills.length - uniqueSkills.length} duplicate skill(s)`,
        );
      }
    }
  }, [selectedSkills.length]); // Only run when the length changes to avoid infinite loops

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearchQuery.cancel();
    };
  }, [debouncedSearchQuery]);

  const handleSkillSelect = (skill: string) => {
    // Case-insensitive check for duplicates
    const skillExists = selectedSkills.some(
      (s: string) => s.toLowerCase() === skill.toLowerCase(),
    );

    if (skillExists) {
      // Remove skill if already selected (case-insensitive)
      form.setValue(
        fieldName,
        selectedSkills.filter(
          (s: string) => s.toLowerCase() !== skill.toLowerCase(),
        ),
      );
    } else {
      // Add skill if not selected
      form.setValue(fieldName, [...selectedSkills, skill]);
      setErrors({ skills: "" });
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    form.setValue(
      fieldName,
      selectedSkills.filter(
        (skill: string) => skill.toLowerCase() !== skillToRemove.toLowerCase(),
      ),
    );
  };

  const handleCustomSkillAdd = () => {
    const trimmedSkill = customSkill.trim();
    if (!trimmedSkill) return;

    // Case-insensitive check for duplicates in selected skills
    const skillExists = selectedSkills.some(
      (s: string) => s.toLowerCase() === trimmedSkill.toLowerCase(),
    );

    if (!skillExists) {
      form.setValue(fieldName, [...selectedSkills, trimmedSkill]);
      setCustomSkill("");
      setErrors({ skills: "" });
    } else {
      // Show error message for duplicate
      setErrors({ skills: "This skill has already been added" });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomSkillAdd();
    }
  };

  // Clear error when user starts typing
  const handleCustomSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSkill(e.target.value);
    if (errors.skills) {
      setErrors({ skills: "" });
    }
  };

  return (
    <div className="space-y-6">
      {!hideTitle && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills</h2>
          <p className="text-gray-600">
            Tell us what your top skills (Job title/Role chosen)
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Skills Combobox */}
        <div className="space-y-3">
          <Label
            htmlFor="skills-combobox"
            className="text-sm font-medium text-gray-900"
          >
            {(schema &&
              addRequiredAsterisk("Select your skills", schema, fieldName)) ||
              "Select your skills"}
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full h-12 justify-between"
                disabled={skillsLoading}
              >
                {selectedSkills.length > 0
                  ? `${selectedSkills.length} skill${selectedSkills.length > 1 ? "s" : ""} selected`
                  : "Select skills..."}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-[170px] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search skills..."
                  onValueChange={(value) => {
                    debouncedSearchQuery(value);
                  }}
                />
                <CommandList className="max-h-[170px] overflow-y-auto">
                  <CommandEmpty>
                    {skillsLoading
                      ? "Searching..."
                      : skillsError
                        ? "Error loading skills"
                        : "No skill found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {skillsLoading ? (
                      <div className="flex justify-center items-center py-6">
                        <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
                      </div>
                    ) : (
                      skills?.data
                        ?.filter((skill: Skill) => skill.title?.trim())
                        .map((skill: Skill) => (
                          <CommandItem
                            key={skill.id}
                            value={skill.title}
                            onSelect={() => handleSkillSelect(skill.title)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedSkills.some(
                                  (s: string) =>
                                    s.toLowerCase() ===
                                    skill.title.toLowerCase(),
                                )
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {skill.title}
                          </CommandItem>
                        ))
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Custom skill input */}
        <div className="space-y-3">
          <Label
            htmlFor="custom-skill"
            className="text-sm font-medium text-gray-900"
          >
            Tell us, what skill is not listed
          </Label>
          <div className="flex gap-2">
            <Input
              id="custom-skill"
              type="text"
              placeholder="Enter your skill"
              value={customSkill}
              onChange={handleCustomSkillChange}
              onKeyDown={handleKeyPress}
              className="flex-1 h-12"
            />
            <Button
              type="button"
              onClick={handleCustomSkillAdd}
              disabled={!customSkill.trim()}
              className="px-6 h-12"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Selected skills */}
        {selectedSkills.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill: string) => (
                <Badge
                  key={skill}
                  className="bg-[#EAEAF1] text-[#2C3177] text-xs rounded-md px-3"
                >
                  {skill}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0 hover:bg-transparent text-[#2C3177] hover:text-[#2C3177] has-[>svg]:px-0"
                    onClick={() => handleSkillRemove(skill)}
                  >
                    <X className="h-3 w-3 px-0" color="#FC4A1A" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {errors.skills && (
          <p className="text-sm text-red-600">{errors.skills}</p>
        )}
      </div>
    </div>
  );
}
