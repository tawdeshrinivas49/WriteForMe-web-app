import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useOrg } from "@/store/useOrg";
import {
  FileSpreadsheet,
  HeartHandshake,
  BarChart3,
  Building2,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "One-Click Registration",
    desc: "Register your NGO, trust or institution in minutes with your licence and contact details.",
    color: "gradient-teal",
  },
  {
    icon: FileSpreadsheet,
    title: "Bulk Enrolment",
    desc: "Upload candidates and volunteers en masse via a simple Excel template.",
    color: "gradient-coral",
  },
  {
    icon: BarChart3,
    title: "Performance Dashboard",
    desc: "Track exam outcomes, match success rates, and member activity for your entire cohort.",
    color: "gradient-lilac",
  },
  {
    icon: HeartHandshake,
    title: "Volunteer Coordination",
    desc: "Register your community volunteers and deploy them to candidates who need scribes.",
    color: "gradient-teal",
  },
  {
    icon: ShieldCheck,
    title: "Admin Verified",
    desc: "Every partner organisation is manually reviewed and approved before getting access.",
    color: "gradient-coral",
  },
  {
    icon: CheckCircle2,
    title: "Compliant & Safe",
    desc: "All member data is handled with consent, full DPDPA compliance, and audit trails.",
    color: "gradient-lilac",
  },
];

const partnerOrgs = [
  { name: "Sneha Foundation", city: "Pune", type: "NGO", candidates: 48, volunteers: 31, since: "2025", logo: "SF" },
  { name: "Drishti Trust", city: "Delhi", type: "Trust", candidates: 29, volunteers: 18, since: "2025", logo: "DT" },
  { name: "Saksham Bengaluru", city: "Bengaluru", type: "NGO", candidates: 22, volunteers: 14, since: "2026", logo: "SB" },
  { name: "Prayas Society", city: "Jaipur", type: "Society", candidates: 16, volunteers: 9, since: "2026", logo: "PS" },
  { name: "Vision Welfare", city: "Hyderabad", type: "Trust", candidates: 35, volunteers: 22, since: "2025", logo: "VW" },
  { name: "Jyoti Foundation", city: "Bhopal", type: "NGO", candidates: 11, volunteers: 7, since: "2026", logo: "JF" },
];

const howItWorks = [
  { step: "1", title: "Register", desc: "Fill in your org details and upload a recognition document." },
  { step: "2", title: "Get Approved", desc: "Our admin team reviews and approves your application within 2–3 days." },
  { step: "3", title: "Bulk Enrol", desc: "Download our Excel template, fill in member data, and upload in one go." },
  { step: "4", title: "Track & Act", desc: "Monitor performance, manage members, and take actions from your dashboard." },
];

const Organisations = () => {
  const { isRegistered, approvalStatus } = useOrg();

  const ctaLink = isRegistered ? "/org/dashboard" : "/org/register";
  const ctaLabel = isRegistered
    ? approvalStatus === "approved"
      ? "Go to Dashboard"
      : "Check Status"
    : "Register Your Organisation";

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 md:py-32 container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <span className="section-label mb-4">Partner Programme</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mt-4 mb-6">
            For Organisations & NGOs
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Empower your entire cohort of candidates and volunteers — register in bulk, track performance, and coordinate at scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to={ctaLink}>
                {ctaLabel} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            {!isRegistered && (
              <Button asChild variant="outline" size="lg">
                <Link to="/org/dashboard">Explore Dashboard</Link>
              </Button>
            )}
          </div>

          {isRegistered && (
            <div className={`inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full text-sm font-medium border ${
              approvalStatus === "approved"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
            }`}>
              {approvalStatus === "approved" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {approvalStatus === "approved" ? "Your organisation is verified and active" : "Registration pending admin approval"}
            </div>
          )}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border rounded-2xl p-6 card-hover text-center"
            >
              <div className={`w-14 h-14 mx-auto rounded-xl ${f.color} flex items-center justify-center text-white mb-4`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="section-label mb-3">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3">Simple, fast onboarding</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((h, i) => (
              <motion.div
                key={h.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-display font-bold mb-4">
                  {h.step}
                </div>
                <h3 className="font-bold mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partner Orgs showcase */}
        <div>
          <div className="text-center mb-10">
            <span className="section-label mb-3">Community Partners</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3">Organisations already on board</h2>
            <p className="text-muted-foreground mt-3">A growing network of verified partner organisations making inclusive education real.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {partnerOrgs.map((org, i) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {org.logo}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold truncate">{org.name}</h3>
                        <p className="text-xs text-muted-foreground">{org.city} · {org.type} · Since {org.since}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <GraduationCap className="w-4 h-4 mx-auto text-teal mb-1" />
                        <p className="text-xl font-bold">{org.candidates}</p>
                        <p className="text-xs text-muted-foreground">Candidates</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <HeartHandshake className="w-4 h-4 mx-auto text-coral mb-1" />
                        <p className="text-xl font-bold">{org.volunteers}</p>
                        <p className="text-xs text-muted-foreground">Volunteers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-2xl gradient-teal p-10 text-center text-white"
        >
          <h2 className="text-3xl font-display font-bold mb-4">Ready to partner with us?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join 6+ organisations already empowering hundreds of candidates and volunteers through the Write For Me platform.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
            <Link to={ctaLink}>
              {ctaLabel} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Organisations;
