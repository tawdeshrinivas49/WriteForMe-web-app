import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useUser } from "@/store/useUser";
import { Search, MapPin, ShieldCheck, Sparkles } from "lucide-react";

const stages = [
  { icon: Search, label: "Scanning verified profiles nearby" },
  { icon: MapPin, label: "Comparing distance, language and exam board" },
  { icon: ShieldCheck, label: "Running trust-score and safety checks" },
  { icon: Sparkles, label: "Confirming the best match" },
];

const Waiting = () => {
  const navigate = useNavigate();
  const { role, request, setMatchFound } = useUser();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStage((s) => Math.min(s + 1, stages.length - 1)), 1800);
    const done = setTimeout(() => {
      setMatchFound(true);
      navigate("/match");
    }, 8200);
    return () => {
      clearInterval(t);
      clearTimeout(done);
    };
  }, [navigate, setMatchFound]);

  return (
    <Layout>
      <section className="py-20 md:py-28 container-narrow min-h-[70vh] flex items-center">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="relative mx-auto mb-12 h-56 w-56">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute inset-0 rounded-full border-2 border-primary/40"
                animate={{ scale: [0.6, 1.4], opacity: [0.7, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.85, ease: "easeOut" }}
              />
            ))}
            <motion.div
              className="absolute inset-8 rounded-full gradient-teal flex items-center justify-center text-white shadow-xl"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Search className="w-14 h-14" />
            </motion.div>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={`orb-${i}`}
                className="absolute left-1/2 top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-accent"
                animate={{
                  x: [0, Math.cos((i / 5) * Math.PI * 2) * 105, 0],
                  y: [0, Math.sin((i / 5) * Math.PI * 2) * 105, 0],
                  opacity: [0.2, 1, 0.2],
                }}
                transition={{ duration: 3.4, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              />
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {role === "volunteer" ? "Waiting for a candidate to accept" : "Finding your match"}
          </h1>
          <p className="text-muted-foreground mb-10">
            {request?.examName ? `${request.examName} · ${request.city}` : "Hang tight — this usually takes under a minute."}
          </p>

          <div className="space-y-3 text-left max-w-md mx-auto mb-10">
            {stages.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0.35 }}
                animate={{ opacity: i <= stage ? 1 : 0.35 }}
                className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3"
              >
                <s.icon className={`w-5 h-5 ${i <= stage ? "text-teal" : "text-muted-foreground"}`} />
                <span className="text-sm font-medium">{s.label}</span>
                {i < stage && <span className="ml-auto text-xs text-teal">done</span>}
                {i === stage && (
                  <motion.span
                    className="ml-auto h-2 w-2 rounded-full bg-accent"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          <Button variant="outline" asChild>
            <Link to="/dashboard">Wait in the background</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Waiting;
