import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Languages, GraduationCap, Shield, Smartphone } from "lucide-react";

const volunteers = [
  { id: 1, initial: "R", name: "Riya Sharma", rating: 4.9, exams: 24, languages: ["Hindi", "English"], education: "M.A. English", distance: "2.5 km" },
  { id: 2, initial: "K", name: "Karan Mehta", rating: 4.7, exams: 18, languages: ["English"], education: "B.Sc. Graduate", distance: "4.1 km" },
  { id: 3, initial: "P", name: "Priya Nair", rating: 4.8, exams: 31, languages: ["Hindi", "English", "Malayalam"], education: "M.Com", distance: "1.8 km" },
];

const Matching = () => {
  return (
    <Layout>
      <section className="py-24 md:py-32 container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="section-label mb-4">Matching</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Find Your Match
          </h1>
          <p className="text-lg text-muted-foreground">
            Anonymous profiles are shown until both sides accept the match. Safety first.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {volunteers.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="card-hover overflow-hidden border-2 border-transparent hover:border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full gradient-teal flex items-center justify-center text-white text-2xl font-bold">
                          {v.initial}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl">{v.name}</h3>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">{v.rating}</span>
                            <span className="text-muted-foreground text-xs ml-1">({v.exams} exams)</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" /> {v.education}
                        </div>
                        <div className="flex items-center gap-2">
                          <Languages className="w-4 h-4" /> {v.languages.join(", ")}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> {v.distance} away
                        </div>
                      </div>
                      <Button className="w-full">Request Match</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-teal" />
                  <h3 className="font-bold text-lg">Privacy First</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Full names and contact numbers are only revealed after both sides accept the match.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="w-6 h-6 text-coral" />
                  <h3 className="font-bold text-lg">Two-Step OTP</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  On exam day, both users verify the session with OTPs—one to start, one to end.
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">Start Session</Badge>
                  <Badge variant="outline">End Session</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Matching;
