import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUser, isFullyVerified } from "@/store/useUser";
import { toast } from "sonner";
import { Star, ShieldCheck, History } from "lucide-react";

function StarPick({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)} aria-label={`${i} stars`}>
          <Star className={`w-7 h-7 ${i <= value ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
        </button>
      ))}
    </div>
  );
}

const Profile = () => {
  const state = useUser();
  const { name, role, history } = state;
  const verified = isFullyVerified(state);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const avg = history.length
    ? (
        history.reduce((a, h) => a + (h.speed + h.patience + h.neatness + h.politeness) / 4, 0) / history.length
      ).toFixed(1)
    : "—";

  return (
    <Layout>
      <section className="py-16 md:py-20 container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
            <img
              src={`https://i.pravatar.cc/160?u=${encodeURIComponent(name || "user")}`}
              alt="Your profile portrait"
              className="w-24 h-24 rounded-full border object-cover"
              loading="lazy"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">{name || "Your profile"}</h1>
              <p className="text-muted-foreground capitalize mt-1">{role ?? "guest"}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant={verified ? "default" : "secondary"}>
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> {verified ? "Fully verified" : "Verification pending"}
                </Badge>
                <Badge variant="secondary">Avg rating {avg}</Badge>
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" /> Session history</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>{role === "volunteer" ? "Candidate" : "Scribe"}</TableHead>
                    <TableHead>Ratings (S/P/N/Po)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>{h.date}</TableCell>
                      <TableCell className="font-medium">{h.exam}</TableCell>
                      <TableCell>{h.counterpart}</TableCell>
                      <TableCell className="tabular-nums">
                        {h.speed}/{h.patience}/{h.neatness}/{h.politeness}
                      </TableCell>
                      <TableCell>
                        <Badge variant={h.status === "completed" ? "default" : "secondary"}>
                          {h.status === "completed" ? "Successful exam" : "Cancelled"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Review the platform</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StarPick value={rating} onChange={setRating} />
              <div>
                <Label htmlFor="pr">Your experience with Write For Me</Label>
                <Textarea id="pr" maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Tell us what worked and what we should improve" />
              </div>
              <Button
                disabled={!rating || text.trim().length < 5}
                onClick={() => { toast.success("Thank you for reviewing the platform"); setText(""); setRating(0); }}
              >
                Submit review
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Profile;
