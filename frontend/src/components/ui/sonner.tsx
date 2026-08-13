<<<<<<< HEAD
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
=======
import { Toaster as Sonner } from "sonner";
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
<<<<<<< HEAD
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
=======
  return (
    <Sonner
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

<<<<<<< HEAD
export { Toaster, toast };
=======
export { Toaster };
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
