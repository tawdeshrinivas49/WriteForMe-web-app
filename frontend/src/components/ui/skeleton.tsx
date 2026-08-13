import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
<<<<<<< HEAD
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
=======
  return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />;
>>>>>>> aed0f32cb472f7ec3be5eb17fa8a874a01fb61db
}

export { Skeleton };
