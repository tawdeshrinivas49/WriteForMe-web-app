import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUser } from "@/store/useUser";
import { toast } from "sonner";
import { Star, ShieldCheck, History, Loader2 } from "lucide-react";
import apiClient from "@/lib/api";

// Helper component for star rating
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

// Type for a session/request history item
interface SessionHistory {
  id: string;
  examName: string;
  examDate: string;
  status: string;
  counterpartName?: string;
}

const Profile = () => {
  const { user, isFullyVerified } = useUser();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [history, setHistory] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch session history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const endpoint = user?.role === 'STUDENT' 
          ? '/users/dashboard/student' 
          : '/users/dashboard/volunteer';
        const response = await apiClient.get(endpoint);
        const data = response.data;
        const exams = user?.role === 'STUDENT' ? data.upcomingExams : data.upcomingAssignments;
        if (exams && Array.isArray(exams)) {
          setHistory(exams.map((e: any) => ({
            id: e.id,
            examName: e.examName || e.examTitle,
            examDate: e.examDate || e.date,
            status: e.status,
            counterpartName: e.volunteer?.user?.name || e.student?.name || '—'
          })));
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
        toast.error('Could not load your session history.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleReviewSubmit = async () => {
    if (!rating || reviewText.trim().length < 5) {
      toast.error('Please provide a rating and at least 5 characters of feedback.');
      return;
    }
    try {
      // TODO: Call actual platform review API endpoint
      toast.success('Thank you for your review!');
      setRating(0);
      setReviewText('');
    } catch (error) {
      toast.error('Failed to submit review.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-teal" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 md:py-20 container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
            <img
              src={`https://i.pravatar.cc/160?u=${encodeURIComponent(user?.name || "user")}`}
              alt="Your profile portrait"
              className="w-24 h-24 rounded-full border object-cover"
              loading="lazy"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">{user?.name || "Your profile"}</h1>
              <p className="text-muted-foreground capitalize mt-1">{user?.role?.toLowerCase() ?? "guest"}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {/* ✅ Updated badge label */}
                <Badge variant={isFullyVerified ? "default" : "secondary"}>
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 
                  {isFullyVerified ? "DigiLocker verified" : "Verification pending"}
                </Badge>
                <Badge variant="secondary">Phone: {user?.phone || '—'}</Badge>
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" /> Session history</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground text-sm">No sessions yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Counterpart</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell>{new Date(h.examDate).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{h.examName}</TableCell>
                        <TableCell>{h.counterpartName}</TableCell>
                        <TableCell>
                          <Badge variant={h.status === 'COMPLETED' ? 'default' : 'secondary'}>
                            {h.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
                <Textarea
                  id="pr"
                  maxLength={1000}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us what worked and what we should improve"
                />
              </div>
              <Button
                disabled={!rating || reviewText.trim().length < 5}
                onClick={handleReviewSubmit}
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