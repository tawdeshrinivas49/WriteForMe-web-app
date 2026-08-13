import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
<<<<<<< HEAD
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
=======
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
<<<<<<< HEAD
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
=======
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
<<<<<<< HEAD
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
=======
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
  ),
);
AlertTitle.displayName = "AlertTitle";

<<<<<<< HEAD
const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
=======
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
));
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
