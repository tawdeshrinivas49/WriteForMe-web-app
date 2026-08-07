import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/store/useUser";
import { toast } from "sonner";
import { CheckCircle2, PlayCircle, ShieldCheck, PhoneCall, ScrollText } from "lucide-react";

const conductPoints = [
  { icon: ScrollText, title: "Rules & regulations", desc: "Arrive 45 minutes early, carry valid ID, and follow the exam board's scribe guidelines." },
  { icon: ShieldCheck, title: "Code of conduct", desc: "No coaching, prompting or interpreting. Write exactly what is dictated, nothing more." },
  { icon: PhoneCall, title: "Emergencies", desc: "Use the in-app Emergency Support to reach our 24x7 helpline within 60 seconds." },
];

const quiz = [
  {
    q: "Your candidate asks you to explain what a question means. What do you do?",
    options: [
      "Explain it briefly so they understand",
      "Read the question aloud again, exactly as printed, without interpreting",
      "Skip the question",
    ],
    answer: 1,
  },
  {
    q: "You reach the centre and the candidate has not arrived 20 minutes before the exam.",
    options: [
      "Leave the centre",
      "Call the candidate, then raise an Emergency Support ticket in the app",
      "Start the exam alone",
    ],
    answer: 1,
  },
  {
    q: "The candidate dictates an answer you believe is wrong.",
    options: ["Write the correct answer instead", "Write exactly what was dictated", "Leave it blank"],
    answer: 1,
  },
  {
    q: "How does an exam session officially begin on Write For Me?",
    options: [
      "The scribe taps 'Start'",
      "The candidate shares a start OTP that the scribe enters",
      "The invigilator signs a form",
    ],
    answer: 1,
  },
  {
    q: "Someone offers you money to write extra content for a candidate.",
    options: ["Accept it quietly", "Refuse and report it through the app immediately", "Ignore it"],
    answer: 1,
  },
  {
    q: "The candidate needs a short break due to fatigue.",
    options: [
      "Refuse, the clock is running",
      "Inform the invigilator and follow the centre's break policy",
      "Pause the exam yourself",
    ],
    answer: 1,
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const { role, name, videoCompleted, quizPassed, completeVideo, passQuiz } = useUser();
  const [watched, setWatched] = useState(videoCompleted);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const isVolunteer = role === "volunteer";
  const score = quiz.filter((q, i) => answers[i] === q.answer).length;
  const passed = score >= 5;

  const handleWatch = () => {
    setWatched(true);
    completeVideo();
    toast.success("Orientation video completed");
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (score >= 5) {
      passQuiz();
      toast.success(`Passed with ${score}/6 — you are now fully verified`);
    } else {
      toast.error(`Scored ${score}/6. You need 5 to pass. Please retry.`);
    }
  };

  const done = isVolunteer ? watched && (quizPassed || passed) : watched;

  return (
    <Layout>
      <section className="py-16 md:py-24 container-narrow">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-10">
            <span className="section-label mb-4">Orientation</span>
            <h1 className="text-3xl md:text-5xl font-display font-bold mt-4">
              Welcome{name ? `, ${name}` : ""} to Write For Me
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              {isVolunteer
                ? "Before you can accept requests, watch the orientation and clear a short case-based questionnaire."
                : "Before you can request a scribe, watch this short orientation on rules, conduct and emergency support."}
            </p>
          </div>

          <Progress value={done ? 100 : watched ? 60 : 20} className="mb-10" />

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5" /> Step 1 — Orientation video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-xl overflow-hidden border bg-black mb-6">
                <video
                  className="w-full h-full"
                  controls
                  poster="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80"
                  onEnded={handleWatch}
                >
                  <source src="https://cdn.coverr.co/videos/coverr-typing-on-a-laptop-1584/1080p.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {conductPoints.map((p) => (
                  <div key={p.title} className="rounded-xl border bg-muted/40 p-4">
                    <p.icon className="w-5 h-5 text-teal mb-2" />
                    <p className="font-semibold text-sm mb-1">{p.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
              {watched ? (
                <p className="flex items-center gap-2 text-teal font-medium">
                  <CheckCircle2 className="w-5 h-5" /> Video completed
                </p>
              ) : (
                <Button onClick={handleWatch} variant="outline">
                  I have watched the full video
                </Button>
              )}
            </CardContent>
          </Card>

          {isVolunteer && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Step 2 — Case-based questionnaire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {quizPassed ? (
                  <p className="flex items-center gap-2 text-teal font-medium">
                    <CheckCircle2 className="w-5 h-5" /> Questionnaire cleared
                  </p>
                ) : (
                  <>
                    {quiz.map((q, i) => (
                      <div key={i} className="rounded-xl border p-4">
                        <p className="font-medium mb-3">
                          {i + 1}. {q.q}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => {
                            const selected = answers[i] === oi;
                            const showState = submitted && selected;
                            return (
                              <button
                                key={oi}
                                type="button"
                                disabled={!watched}
                                onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                                className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors disabled:opacity-50 ${
                                  selected ? "border-primary bg-secondary" : "hover:bg-muted"
                                } ${showState ? (oi === q.answer ? "border-teal" : "border-destructive") : ""}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={handleSubmit}
                      disabled={!watched || Object.keys(answers).length < quiz.length}
                    >
                      Submit answers
                    </Button>
                    <AnimatePresence>
                      {submitted && !passed && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-destructive text-sm"
                        >
                          You scored {score}/6. Review the conduct points above and try again.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" disabled={!done} onClick={() => navigate("/request")}>
              {isVolunteer ? "Continue to volunteering" : "Continue to request a scribe"}
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
          {!done && (
            <p className="text-sm text-muted-foreground mt-4">
              You must complete every step above to become fully verified.
            </p>
          )}
        </motion.div>
      </section>
    </Layout>
  );
};

export default Welcome;
