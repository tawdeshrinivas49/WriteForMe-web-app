import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/store/useUser";
import { toast } from "sonner";
import { getRequestById, getRequests, verifyStartPin, verifyCompletionPin } from "@/lib/api";
import {
  Phone, MapPin, GraduationCap, ShieldCheck,
  KeyRound, LifeBuoy, CheckCircle2, Loader2, Clock
} from "lucide-react";

const Match = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestIdFromUrl = searchParams.get("requestId");
  const { user, token } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<any>(null);
  const [startPinInput, setStartPinInput] = useState("");
  const [endPinInput, setEndPinInput] = useState("");
  const [verifyingStart, setVerifyingStart] = useState(false);
  const [verifyingEnd, setVerifyingEnd] = useState(false);
  const [fetchingId, setFetchingId] = useState(false);

  // Fetch the active request ID if none in URL
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const findActiveRequest = async () => {
      if (requestIdFromUrl) {
        fetchRequest(requestIdFromUrl);
        return;
      }

      try {
        setFetchingId(true);
        const response = await getRequests();
        const requests = response.data || [];

        if (requests.length === 0) {
          toast.info("You haven't created any requests yet.");
          navigate('/request');
          return;
        }

        // Find the first request that is not CANCELLED or COMPLETED
        let active = requests.find(
          (r: any) => !['CANCELLED', 'COMPLETED'].includes(r.status)
        );
        if (!active) {
          active = requests[0];
        }

        setSearchParams({ requestId: active.id });
        setFetchingId(false);
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Could not find your requests.");
        navigate('/dashboard');
      } finally {
        setFetchingId(false);
      }
    };

    findActiveRequest();
  }, [requestIdFromUrl, token, navigate, setSearchParams]);

  const fetchRequest = async (id: string) => {
    try {
      setLoading(true);
      const response = await getRequestById(id);
      setRequest(response.data);
    } catch (error) {
      console.error("Error fetching request:", error);
      toast.error("Failed to load match details.");
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestIdFromUrl) {
      fetchRequest(requestIdFromUrl);
    }
  }, [requestIdFromUrl]);

  const handleStartPinVerify = async () => {
    if (!startPinInput || startPinInput.length < 4) {
      toast.error("Please enter a valid start PIN");
      return;
    }
    setVerifyingStart(true);
    try {
      const result = await verifyStartPin(requestIdFromUrl!, startPinInput);
      if (result.success) {
        toast.success("Session started successfully!");
        const updated = await getRequestById(requestIdFromUrl!);
        setRequest(updated.data);
        setStartPinInput("");
      } else {
        toast.error(result.error || "Invalid start PIN");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify start PIN");
    } finally {
      setVerifyingStart(false);
    }
  };

  const handleEndPinVerify = async () => {
    if (!endPinInput || endPinInput.length < 4) {
      toast.error("Please enter a valid end PIN");
      return;
    }
    setVerifyingEnd(true);
    try {
      const result = await verifyCompletionPin(requestIdFromUrl!, endPinInput);
      if (result.success) {
        toast.success("Exam completed successfully!");
        const updated = await getRequestById(requestIdFromUrl!);
        setRequest(updated.data);
        setEndPinInput("");
      } else {
        toast.error(result.error || "Invalid end PIN");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify end PIN");
    } finally {
      setVerifyingEnd(false);
    }
  };

  if (fetchingId || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-teal" />
        </div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No request found.</p>
          <Button onClick={() => navigate('/request')} className="mt-4">Create a Request</Button>
        </div>
      </Layout>
    );
  }

  const isVolunteer = user?.role === "VOLUNTEER";
  const isCandidate = user?.role === "STUDENT";
  const status = request.status;
  const isMatched = status === 'MATCHED' || status === 'IN_PERSON_VERIFIED' || status === 'IN_PROGRESS' || status === 'COMPLETED';
  
  const counterpart = isMatched ? (isVolunteer ? request.candidate?.user : request.volunteer?.user) : null;
  const counterpartName = counterpart?.name || (isMatched ? "Unknown" : "Not yet matched");
  const counterpartPhone = counterpart?.phone || "—";
  const counterpartGender = counterpart?.gender || "—";

  // Show PIN entry for both volunteer and candidate when status is MATCHED or IN_PROGRESS
  const showPinEntry = (isVolunteer || isCandidate) && (status === 'MATCHED' || status === 'IN_PROGRESS');
  // Show PINs (the actual codes) only to candidate
  const showPins = isCandidate && status !== 'COMPLETED' && status !== 'CANCELLED';

  return (
    <Layout>
      <section className="py-16 md:py-20 container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <span className="section-label mb-4">My Request</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-4">
              {isMatched ? `Matched with ${counterpartName}` : "Waiting for a match"}
            </h1>
            <p className="text-muted-foreground mt-3">
              Status: <Badge variant={status === 'COMPLETED' ? 'default' : 'secondary'}>{status}</Badge>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal" /> 
                  {isMatched ? (isVolunteer ? "Candidate" : "Scribe") : "Request"} details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {isMatched ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://i.pravatar.cc/120?u=${encodeURIComponent(counterpartName)}`}
                      alt={`Portrait of ${counterpartName}`}
                      className="w-20 h-20 rounded-full object-cover border"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-xl font-bold">{counterpartName}</p>
                      <p className="text-sm text-muted-foreground">{isVolunteer ? "Candidate" : "Volunteer"} • {counterpartGender}</p>
                      <Badge className="mt-2">Verified via DigiLocker</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <Clock className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">Matching in progress</p>
                      <p className="text-sm text-muted-foreground">We are finding a suitable volunteer for you.</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/matching')}>
                        View matching status
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <p className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-teal" /> {request.examName}</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal" /> {request.examCenterName || "Exam centre"}</p>
                  {isMatched && (
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal" /> {counterpartPhone}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  {isMatched && counterpartPhone !== "—" && (
                    <Button asChild><a href={`tel:${counterpartPhone.replace(/\s/g, "")}`}><Phone className="w-4 h-4 mr-2" />Call</a></Button>
                  )}
                  <Button variant="outline" asChild><Link to="/emergency"><LifeBuoy className="w-4 h-4 mr-2" />Emergency support</Link></Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5" /> Session PINs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm">
                {showPins && (
                  <div className="rounded-xl bg-secondary p-4">
                    <p className="font-medium mb-2">Your PINs to share</p>
                    <p>Start: <span className="font-mono text-lg tracking-widest">{request.invigilatorPin}</span></p>
                    <p>End: <span className="font-mono text-lg tracking-widest">{request.completionPin}</span></p>
                    <p className="text-xs text-muted-foreground mt-2">Share the start PIN before the exam and the end PIN once you finish.</p>
                  </div>
                )}

                {showPinEntry && (
                  <>
                    {status === 'MATCHED' && (
                      <div className="space-y-2">
                        <Label htmlFor="sotp">Enter start PIN</Label>
                        <Input
                          id="sotp"
                          value={startPinInput}
                          onChange={(e) => setStartPinInput(e.target.value)}
                          placeholder="4‑digit PIN"
                          maxLength={6}
                        />
                        <Button
                          className="w-full"
                          onClick={handleStartPinVerify}
                          disabled={verifyingStart || !startPinInput}
                        >
                          {verifyingStart ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Start Session
                        </Button>
                      </div>
                    )}

                    {status === 'IN_PROGRESS' && (
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-teal font-medium"><CheckCircle2 className="w-4 h-4" /> Session in progress</p>
                        <Label htmlFor="eotp">Enter end PIN</Label>
                        <Input
                          id="eotp"
                          value={endPinInput}
                          onChange={(e) => setEndPinInput(e.target.value)}
                          placeholder="4‑digit PIN"
                          maxLength={6}
                        />
                        <Button
                          className="w-full"
                          onClick={handleEndPinVerify}
                          disabled={verifyingEnd || !endPinInput}
                        >
                          {verifyingEnd ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          End Session
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {status === 'COMPLETED' && (
                  <div className="rounded-xl border border-teal/40 bg-teal/5 p-4">
                    <p className="font-semibold text-teal flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Exam completed</p>
                    <p className="text-muted-foreground mt-1">Thank you for using Write For Me.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Match;