import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "@/store/useAdmin";
import { toast } from "sonner";

export default function Announcements() {
  const {
    announcements, saveAnnouncement, deleteAnnouncement,
    leaderboardOn, leaderboardTitle, leaderboardCount, setLeaderboard,
  } = useAdmin();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const publish = (published: boolean) => {
    if (!title.trim() || !body.trim()) return toast.error("Add a title and body");
    saveAnnouncement({
      id: `AN-${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim(), body: body.trim(),
      date: new Date().toISOString().slice(0, 10), published,
    });
    toast.success(published ? "Announcement published" : "Draft saved");
    setTitle(""); setBody("");
  };

  return (
    <AdminPage
      title="News, announcements & leaderboard"
      description="Publish updates to the public site and control what the public leaderboard shows."
      exportName="announcements"
      exportRows={announcements as unknown as Record<string, unknown>[]}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Write an announcement</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="an-title">Title</Label>
              <Input id="an-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Scribe drive for SSC CGL Tier II" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="an-body">Body</Label>
              <Textarea id="an-body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What do you want users to know?" />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => publish(true)}><Plus className="w-4 h-4 mr-2" /> Publish</Button>
              <Button variant="outline" onClick={() => publish(false)}>Save as draft</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Public leaderboard</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="lb-on">Show on public site</Label>
              <Switch id="lb-on" checked={leaderboardOn} onCheckedChange={(v) => setLeaderboard({ leaderboardOn: v })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lb-title">Heading</Label>
              <Input id="lb-title" value={leaderboardTitle} onChange={(e) => setLeaderboard({ leaderboardTitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lb-count">Number of volunteers shown</Label>
              <Input id="lb-count" type="number" min={3} max={50} value={leaderboardCount}
                onChange={(e) => setLeaderboard({ leaderboardCount: Number(e.target.value) })} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Published & drafts</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="p-4 rounded-md border border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{a.title}</p>
                    <Badge variant={a.published ? "default" : "secondary"}>{a.published ? "Published" : "Draft"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{a.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">{a.date}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    aria-label={`Toggle publish for ${a.title}`}
                    checked={a.published}
                    onCheckedChange={(v) => saveAnnouncement({ ...a, published: v })}
                  />
                  <Button size="icon" variant="ghost" aria-label="Delete announcement"
                    onClick={() => { deleteAnnouncement(a.id); toast("Announcement deleted"); }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminPage>
  );
}
