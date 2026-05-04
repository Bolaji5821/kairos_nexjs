import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import type { School } from "@/lib/types";
import { getSchools } from "@/services/authService";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";

interface UniversityComboboxProps {
  field: ControllerRenderProps<any, string>;
  label?: string;
  placeholder?: string;
  isOptional?: boolean;
}

export default function UniversityCombobox({
  field,
  label = "University",
  placeholder = "Select university",
  isOptional = false,
}: UniversityComboboxProps) {
  const [universityOpen, setUniversityOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const params = {
    pageNo: 1,
    pageSize: 10,
    query: debouncedSearchTerm || undefined,
  };

  const { data: schools, isLoading: schoolsLoading } = useQuery({
    queryKey: ["universities", params],
    queryFn: () => getSchools(params),
    retry: false,
  });

  return (
    <FormItem>
      <FormLabel>
        {label}
        {isOptional && (
          <>
            &nbsp;
            <span className="text-[10px]">(Optional)</span>
          </>
        )}
      </FormLabel>
      <Popover
        open={universityOpen}
        onOpenChange={(open) => {
          setUniversityOpen(open);
          if (!open) {
            setSearchTerm(""); // Clear search when closing
            setDebouncedSearchTerm(""); // Clear debounced search too
          }
        }}
        modal
      >
        <PopoverTrigger className="w-full" asChild>
          <FormControl>
            <Button
              variant="ghost"
              role="combobox"
              className="w-full justify-between h-12 px-4 border-b border-b-input bg-background hover:bg-accent hover:text-accent-foreground rounded-none has-[>svg]:px-0 font-normal"
            >
              <span
                className={
                  field.value ? "text-foreground" : "text-muted-foreground"
                }
              >
                {field.value || placeholder}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
          <Command className="w-full" shouldFilter={false}>
            <CommandInput
              placeholder="Search universities..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList className="w-full">
              {schoolsLoading ? (
                <CommandEmpty className="w-full flex justify-center text-center gap-3 py-3 text-muted-foreground">
                  Loading universities...&nbsp;
                  <Loader2 className="animate-spin w-5 h-5 text-custom-magenta-500" />
                </CommandEmpty>
              ) : schools?.data && schools.data.length > 0 ? (
                <CommandGroup className="w-full">
                  {schools.data.map(
                    (school: School | string, index: number) => {
                      const schoolName =
                        typeof school === "string" ? school : school.name;
                      const schoolId =
                        typeof school === "string"
                          ? `${school}-${index}`
                          : school.id || `${school.name}-${index}`;

                      return (
                        <CommandItem
                          key={schoolId}
                          className="w-full"
                          onSelect={() => {
                            field.onChange(schoolName);
                            setUniversityOpen(false);
                            setSearchTerm(""); // Clear search when selecting
                            setDebouncedSearchTerm(""); // Clear debounced search too
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              field.value === schoolName
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {schoolName}
                        </CommandItem>
                      );
                    },
                  )}
                  {/* Add Other option */}
                  <CommandItem
                    key="other"
                    className="w-full border-t mt-2 pt-2"
                    onSelect={() => {
                      field.onChange("Other");
                      setUniversityOpen(false);
                      setSearchTerm(""); // Clear search when selecting
                      setDebouncedSearchTerm(""); // Clear debounced search too
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        field.value === "Other" ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    Other
                  </CommandItem>
                </CommandGroup>
              ) : (
                <CommandGroup className="w-full">
                  <CommandEmpty className="w-full text-center py-3 text-muted-foreground">
                    No universities found
                  </CommandEmpty>
                  {/* Add Other option when no results */}
                  <CommandItem
                    key="other-no-results"
                    className="w-full border-t mt-2 pt-2"
                    onSelect={() => {
                      field.onChange("Other");
                      setUniversityOpen(false);
                      setSearchTerm(""); // Clear search when selecting
                      setDebouncedSearchTerm(""); // Clear debounced search too
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        field.value === "Other" ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    Other
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
