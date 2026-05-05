"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./Sheet";
import { ScrollArea } from "./ScrollArea";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

export function PolicyModal({ isOpen, onClose, title, content }: PolicyModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] sm:h-[80vh] rounded-t-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Important information regarding our policies.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full pr-4 pb-4">
          <div className="py-4 text-sm text-zinc-600 dark:text-zinc-400">
            {content}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
