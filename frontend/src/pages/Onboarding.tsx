import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const steps = [
  "Verify your Aadhaar via DigiLocker",
  "Upload your PwD certificate",
  "Complete the code-of-conduct tutorial",
  "Take the eligibility assessment (if applicable)",
  "Set your preferred language",
];

const Onboarding = () => {
  return (
    <Layout>
      <section className="py-24 md:py-32 container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <span className="section-label mb-4">Verification</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-4">
              Complete Your Verification
            </h1>
          </div>
          <div className="space-y-4 mb-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border"
              >
                <CheckCircle className="w-6 h-6 text-teal flex-shrink-0" />
                <span className="font-medium">{step}</span>
              </motion.div>
            ))}
          </div>
          <Button className="w-full" size="lg">
            Start Verification
          </Button>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Onboarding;
