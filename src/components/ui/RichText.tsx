import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "./Toolbar";
import { useEffect, useRef } from "react";

type Props = {
  onChange: (richText: string) => void;
  placeholder?: string;
  content?: string;
  value?: string;
};

export default function RichText({
  onChange,
  placeholder = "Start typing...",
  content,
  value,
}: Props) {
  const isUpdatingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: value || content || "",
    editorProps: {
      attributes: {
        class: "min-h-[250px] focus:outline-none max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (!isUpdatingRef.current) {
        const html = editor.getHTML();
        onChange(html);
      }
    },
    immediatelyRender: false,
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && (value !== undefined || content !== undefined)) {
      const newContent = value || content || "";
      const currentContent = editor.getHTML();

      // Only update if content is different to avoid unnecessary re-renders
      if (currentContent !== newContent) {
        isUpdatingRef.current = true;
        editor.commands.setContent(newContent);
        // Reset the flag after a short delay to allow the update to complete
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 0);
      }
    }
  }, [editor, value, content]);

  return (
    <div className="flex flex-col border rounded-md">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="flex-1 w-full max-w-[600px]"
        placeholder={placeholder}
      />
    </div>
  );
}
