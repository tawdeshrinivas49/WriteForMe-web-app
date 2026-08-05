import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bus, FileScan, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { InkUnderline, SectionTitle } from "@/components/ink";
import { toast } from "sonner";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "Request a scribe — SCRIBE Connect" },
      {
        name: "description",
        content:
          "Ask for a verified scribe and add transport help in the same form. Upload your admit card and we read the details for you.",
      },
      { property: "og:title", content: "Request a scribe — SCRIBE Connect" },
      {
        property: "og:description",
        content: "One form: scribe, admit-card scan and optional transport support.",
      },
    ],
  }),
  component: RequestPage,
});

function RequestPage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState<null | { roll: string; centre: string; time: string }>(
    null,
  );
  const [transport, setTransport] = useState(false);
  const [exam, setExam] = useState("");

  const runOcr = (fileName: string) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned({ roll: "24-AB-889201", centre: "Govt. College, Sector 14", time: "09:30 AM" });
      toast.success(`Read details from ${fileName}`);
    }, 1600);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <SectionTitle eyebrow="New request">Ask for a scribe</SectionTitle>
      <p className="-mt-4 mb-8 text-sm text-muted-foreground">
        One form. Add transport in the same step if you need it — no separate application.
      </p>

      <form
        className="grid gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/matching" });
        }}
      >
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Your exam</h2>
          <InkUnderline className="mt-1 h-3 w-24" />
          <div className="mt-5 grid gap-4">
            <div>
              <Label htmlFor="exam">Exam name</Label>
              <Input
                id="exam"
                required
                placeholder="e.g. SSC CGL Tier 1"
                value={exam}
                onChange={(e) => setExam(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="date">Exam date</Label>
                <Input id="date" type="date" className="font-mono" required />
              </div>
              <div>
                <Label htmlFor="subject">Subject / medium</Label>
                <Input id="subject" placeholder="English, Quantitative" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Admit card</h2>
          <InkUnderline className="mt-1 h-3 w-24" />
          <p className="mt-3 text-sm text-muted-foreground">
            Upload a photo or PDF. We read the roll number, centre and reporting time for you, so
            you don't have to type them.
          </p>

          <div className="mt-4">
            <Label
              htmlFor="admit"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-accent"
            >
              <Upload className="size-6 text-accent" aria-hidden="true" />
              <span className="text-sm font-medium">Choose admit card file</span>
              <span className="text-xs text-muted-foreground">JPG, PNG or PDF up to 10 MB</span>
            </Label>
            <Input
              id="admit"
              type="file"
              accept="image/*,application/pdf"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) runOcr(f.name);
              }}
            />
          </div>

          <div aria-live="polite" className="mt-4">
            {scanning && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-accent" aria-hidden="true" />
                Reading your admit card…
              </p>
            )}
            {scanned && (
              <dl className="grid gap-2 rounded-lg bg-secondary/60 p-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Roll number</dt>
                  <dd className="font-mono">{scanned.roll}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Centre</dt>
                  <dd>{scanned.centre}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Reporting</dt>
                  <dd className="font-mono">{scanned.time}</dd>
                </div>
                <p className="sm:col-span-3 inline-flex items-center gap-2 text-xs text-verified">
                  <FileScan className="size-3.5" aria-hidden="true" /> Read automatically — please
                  check these are right.
                </p>
              </dl>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Bus className="size-5 text-accent" aria-hidden="true" /> Add transport help
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                An accessible ride or a companion volunteer to reach the centre.
              </p>
            </div>
            <Switch
              checked={transport}
              onCheckedChange={setTransport}
              aria-label="Add transport help to this request"
            />
          </div>

          {transport && (
            <div className="animate-soft-rise mt-5 grid gap-4">
              <div>
                <Label htmlFor="pickup">Pick-up address</Label>
                <Input id="pickup" placeholder="House, street, landmark" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ptime">Pick-up time</Label>
                  <Input id="ptime" type="time" className="font-mono" />
                </div>
                <div>
                  <Label htmlFor="vehicle">Access needs</Label>
                  <Input id="vehicle" placeholder="Wheelchair space, ground-floor pickup" />
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <Label htmlFor="notes" className="font-display text-xl font-semibold">
            Anything your scribe should know?
          </Label>
          <Textarea
            id="notes"
            className="mt-4"
            rows={4}
            placeholder="Pace, diagrams, preferred language…"
          />
        </section>

        <Button type="submit" size="lg" className="rounded-lg">
          Find me a scribe
        </Button>
      </form>
    </div>
  );
}