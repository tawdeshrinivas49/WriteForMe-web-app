import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Building2,
  GraduationCap,
  HeartHandshake,
  MapPin,
  ArrowRight,
  Globe,
  Users,
  Star,
  Heart,
} from "lucide-react";

const communityStats = [
  { value: "12,500+", label: "Candidates Assisted", icon: GraduationCap, color: "text-teal" },
  { value: "8,700+", label: "Verified Volunteers", icon: HeartHandshake, color: "text-coral" },
  { value: "6+", label: "Partner Organisations", icon: Building2, color: "text-lilac" },
  { value: "32", label: "States Covered", icon: Globe, color: "text-primary" },
];

const partnerOrgs = [
  {
    name: "Sneha Foundation",
    city: "Pune, Maharashtra",
    type: "NGO",
    logo: "SF",
    candidates: 48,
    volunteers: 31,
    impact: "425 exam sessions supported",
    verified: true,
    color: "gradient-teal",
  },
  {
    name: "Drishti Trust",
    city: "New Delhi",
    type: "Trust",
    logo: "DT",
    candidates: 29,
    volunteers: 18,
    impact: "210 exam sessions supported",
    verified: true,
    color: "gradient-coral",
  },
  {
    name: "Saksham Bengaluru",
    city: "Bengaluru, Karnataka",
    type: "NGO",
    logo: "SB",
    candidates: 22,
    volunteers: 14,
    impact: "96 exam sessions supported",
    verified: true,
    color: "gradient-lilac",
  },
  {
    name: "Prayas Society",
    city: "Jaipur, Rajasthan",
    type: "Society",
    logo: "PS",
    candidates: 16,
    volunteers: 9,
    impact: "88 exam sessions supported",
    verified: true,
    color: "gradient-teal",
  },
  {
    name: "Vision Welfare",
    city: "Hyderabad, Telangana",
    type: "Trust",
    logo: "VW",
    candidates: 35,
    volunteers: 22,
    impact: "180 exam sessions supported",
    verified: true,
    color: "gradient-coral",
  },
  {
    name: "Jyoti Foundation",
    city: "Bhopal, Madhya Pradesh",
    type: "NGO",
    logo: "JF",
    candidates: 11,
    volunteers: 7,
    impact: "52 exam sessions supported",
    verified: true,
    color: "gradient-lilac",
  },
];

const stories = [
  {
    name: "Anita Deshpande",
    org: "Sneha Foundation",
    quote: "We enrolled 48 candidates in a single afternoon. The platform saved us weeks of paperwork every exam season.",
    avatar: "AD",
  },
  {
    name: "Rakesh Gupta",
    org: "Drishti Trust",
    quote: "Tracking volunteer performance and candidate outcomes from one dashboard is a game changer for our team.",
    avatar: "RG",
  },
  {
    name: "Latha Menon",
    org: "Saksham Bengaluru",
    quote: "The bulk upload feature means our coordinators can focus on ground-level support instead of data entry.",
    avatar: "LM",
  },
];

const Community = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 md:py-32 container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="section-label mb-4">Community</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Join the Movement
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with volunteers, NGOs, and contributors making inclusive education a reality — one exam at a time.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-20">
          {communityStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border rounded-2xl p-6 text-center shadow-sm"
            >
              <div className={`w-10 h-10 mx-auto rounded-full bg-muted grid place-items-center ${s.color} mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ─── ORGANISATIONS REACHED ─── */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="section-label mb-3">Organisations Reached</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-3">
              Partner NGOs & Institutions
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              These verified organisations are using Write For Me to empower their candidates and volunteers at scale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {partnerOrgs.map((org, i) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Card className="card-hover h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-5">
                      <div className={`w-12 h-12 rounded-xl ${org.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {org.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold truncate">{org.name}</h3>
                          {org.verified && (
                            <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {org.city}
                        </div>
                        <Badge variant="secondary" className="mt-1 text-[10px]">{org.type}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <GraduationCap className="w-4 h-4 mx-auto text-teal mb-1" />
                        <p className="text-xl font-bold">{org.candidates}</p>
                        <p className="text-[11px] text-muted-foreground">Candidates</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <HeartHandshake className="w-4 h-4 mx-auto text-coral mb-1" />
                        <p className="text-xl font-bold">{org.volunteers}</p>
                        <p className="text-[11px] text-muted-foreground">Volunteers</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-auto flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      {org.impact}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/organisations">
                Partner with Us <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Partner Testimonials */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="section-label mb-3">Partner Voices</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-3">What partners say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {stories.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-2xl p-6"
              >
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">"{s.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center text-white font-bold text-sm">
                    {s.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.org}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl gradient-teal p-10 text-center text-white"
        >
          <Heart className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-display font-bold mb-4">Be part of the community</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Whether you're an individual, volunteer, or organisation — there's a place for you in the Write For Me family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
              <Link to="/signup">Join as Individual</Link>
            </Button>
            <Button asChild size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold px-8" variant="outline">
              <Link to="/organisations">Partner as Organisation <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Community;
