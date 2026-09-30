import { Eye, EyeOff, Star } from "lucide-react";
import { AdminPage } from "@admin/components/AdminPage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@admin/store/useAdmin";
import { toast } from "sonner";

export default function Reviews() {
  const { reviews, toggleReview } = useAdmin();

  return (
    <AdminPage
      title="Reviews & comments"
      description="Hidden reviews stay on record — nothing is permanently deleted, so any moderation decision can be checked later."
      exportName="reviews"
      exportRows={reviews as unknown as Record<string, unknown>[]}
    >
      <div className="space-y-3">
        {reviews.map((r) => (
          <Card key={r.id} className={r.hidden ? "opacity-70 border-dashed" : ""}>
            <CardContent className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{r.author}</span>
                  <span className="text-xs text-muted-foreground">on {r.target} · {r.date}</span>
                  <span className="flex items-center gap-1 text-yellow-500 text-xs"><Star className="w-3 h-3 fill-current" />{r.rating}</span>
                  {r.hidden && <Badge variant="destructive">Hidden from public</Badge>}
                </div>
                <p className="text-sm mt-2">{r.text}</p>
              </div>
              <Button size="sm" variant="outline" className="shrink-0" onClick={() => { toggleReview(r.id); toast.success(r.hidden ? "Review restored" : "Review hidden"); }}>
                {r.hidden ? <><Eye className="w-4 h-4 mr-2" /> Unhide</> : <><EyeOff className="w-4 h-4 mr-2" /> Hide</>}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminPage>
  );
}
