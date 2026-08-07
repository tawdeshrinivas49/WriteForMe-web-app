import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Medal, Quote } from "lucide-react";
import { useState } from "react";

const hallOfFame = [
  { name: "Riya Sharma", achievement: "Cleared UPSC Prelims", year: "2026", region: "Delhi" },
  { name: "Amit Patel", achievement: "100+ Scribe Sessions", year: "2026", region: "Mumbai" },
  { name: "Sneha Foundation", achievement: "500 Candidates Supported", year: "2025", region: "Bangalore" },
  { name: "Karan Mehta", achievement: "Top Rated Volunteer", year: "2026", region: "Pune" },
];

function StarInput({ rating, setRating }: { rating: number; setRating: (r: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          className="focus:outline-none"
          aria-label={`Rate ${i} stars`}
        >
          <Star className={`w-7 h-7 transition-colors ${i <= rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
        </button>
      ))}
    </div>
  );
}

const HallOfFame = () => {
  const [rating, setRating] = useState(0);

  return (
    <Layout>
      <section className="py-24 md:py-32 container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="section-label mb-4">Hall of Fame</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mt-4 mb-6">
              Our Success Stories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Celebrating the candidates, volunteers, and partners who inspire us every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {hallOfFame.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-2xl p-6 flex items-start gap-4 card-hover"
              >
                <div className="w-12 h-12 rounded-full gradient-coral flex items-center justify-center text-white flex-shrink-0">
                  <Medal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{person.name}</h3>
                  <p className="text-primary font-medium">{person.achievement}</p>
                  <p className="text-sm text-muted-foreground mt-1">{person.region} • {person.year}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-secondary/30 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-12 h-12 rounded-full gradient-teal flex items-center justify-center text-white mb-6">
                  <Quote className="w-6 h-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                  Share your experience
                </h2>
                <p className="text-muted-foreground">
                  Your review helps others trust the platform and improves our community.
                </p>
              </div>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="reviewer">Name</Label>
                  <Input id="reviewer" placeholder="Your name" />
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="mt-2">
                    <StarInput rating={rating} setRating={setRating} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="review-text">Your Experience</Label>
                  <Textarea id="review-text" placeholder="Share your story..." />
                </div>
                <Button className="w-full">Submit Review</Button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default HallOfFame;
