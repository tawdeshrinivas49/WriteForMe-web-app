import { Layout } from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useOrg } from "@/store/useOrg";
import { toast } from "sonner";
import {
  Building2,
  Upload,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Globe,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const orgTypes = ["NGO", "Trust", "Society", "Company (CSR)", "University / College", "Government Body", "Other"];

const STEPS = ["Organisation Details", "Upload Documents", "Terms & Agreement", "Review & Submit"];

export default function OrgRegister() {
  const navigate = useNavigate();
  const { register } = useOrg();
  const [step, setStep] = useState(0);

  // Form state
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [website, setWebsite] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [city, setCity] = useState("");
  const [licenseFileName, setLicenseFileName] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseFileName(file.name);
      toast.success(`Document "${file.name}" selected`);
    }
  };

  const canGoNext = () => {
    if (step === 0) return orgName.trim() && orgType && contactName.trim() && contactPhone.trim() && contactEmail.trim() && city.trim();
    if (step === 1) return licenseFileName !== "";
    if (step === 2) return agreedTerms;
    return true;
  };

  const handleSubmit = () => {
    register({ orgName, orgType, website, contactName, contactPhone, contactEmail, city, licenseFileName });
    toast.success("Registration submitted! Awaiting admin approval.");
    navigate("/org/dashboard");
  };

  return (
    <Layout>
      <section className="py-24 md:py-32 container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-teal flex items-center justify-center text-white mb-5">
              <Building2 className="w-8 h-8" />
            </div>
            <span className="section-label mb-3">Partner Portal</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-3">
              Register Your Organisation
            </h1>
            <p className="text-muted-foreground">
              Join as a partner NGO / institution to bulk-register candidates and volunteers, and track their progress.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center mb-10">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                      i < step
                        ? "bg-primary text-primary-foreground"
                        : i === step
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="text-[10px] mt-1 text-muted-foreground hidden md:block text-center w-20">
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 transition-colors duration-300 ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="bg-card border rounded-2xl p-8 md:p-10 shadow-sm">
            <AnimatePresence mode="wait">
              {/* STEP 0: Org Details */}
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <h2 className="text-xl font-semibold mb-1">Organisation Details</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="org-name">Organisation Name *</Label>
                      <Input id="org-name" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g. Sneha Foundation" maxLength={100} />
                    </div>
                    <div>
                      <Label htmlFor="org-type">Type of Organisation *</Label>
                      <Select value={orgType} onValueChange={setOrgType}>
                        <SelectTrigger id="org-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          {orgTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="website">Website (optional)</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="website" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourorg.org" className="pl-9" maxLength={200} />
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contact Information</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name">Contact Person Name *</Label>
                        <Input id="contact-name" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Full name" maxLength={100} />
                      </div>
                      <div>
                        <Label htmlFor="city">City / Region *</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Pune" className="pl-9" maxLength={100} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="contact-phone">Contact Phone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="contact-phone" type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+91 98765 43210" className="pl-9" maxLength={15} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Contact Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="contact-email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="contact@yourorg.org" className="pl-9" maxLength={255} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 1: Upload Documents */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Upload Documents</h2>
                    <p className="text-sm text-muted-foreground">
                      Please upload a valid licence of operation, registration certificate, or an official letter of recognition that proves your organisation is a legitimate entity.
                    </p>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-200 ${licenseFileName ? "border-primary/60 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"}`}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                    {licenseFileName ? (
                      <div className="flex flex-col items-center gap-3">
                        <FileCheck2 className="w-12 h-12 text-primary" />
                        <p className="font-semibold text-primary">{licenseFileName}</p>
                        <p className="text-xs text-muted-foreground">Click to change file</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="w-12 h-12 text-muted-foreground" />
                        <p className="font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG or PNG — max 10 MB</p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground mb-1">Accepted documents</p>
                    <ul className="space-y-1 list-disc ml-4">
                      <li>NITI Aayog registration / Darpan ID certificate</li>
                      <li>Section 12A / 80G registration certificate (Income Tax)</li>
                      <li>State Charity Commissioner certificate</li>
                      <li>Government letter of recognition / MoU</li>
                      <li>University / College affiliation proof (for academic partners)</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Terms */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Terms & Agreement</h2>
                    <p className="text-sm text-muted-foreground">Please read and accept the following terms before submitting your registration.</p>
                  </div>
                  <div className="border rounded-xl p-5 h-64 overflow-y-auto space-y-4 text-sm text-muted-foreground bg-muted/20">
                    <p><strong className="text-foreground">1. Organisation Eligibility</strong><br />
                      Only registered organisations — including NGOs, trusts, societies, CSR arms, academic institutions, and government bodies — may apply. You represent that all submitted information is accurate and complete.
                    </p>
                    <p><strong className="text-foreground">2. Data Responsibility</strong><br />
                      By bulk-uploading candidate or volunteer data, you confirm that you have collected the explicit consent of each individual to be registered on the Write For Me platform. You remain responsible for the accuracy of all uploaded records.
                    </p>
                    <p><strong className="text-foreground">3. Approval & Verification</strong><br />
                      Your registration is subject to review and approval by the Write For Me admin team. Platform access will be granted only after successful verification of your uploaded documentation.
                    </p>
                    <p><strong className="text-foreground">4. Acceptable Use</strong><br />
                      You agree to use the platform solely for the purpose of registering eligible candidates and volunteers for examination assistance. Commercial use, reselling of services, or misrepresentation is strictly prohibited.
                    </p>
                    <p><strong className="text-foreground">5. Data Privacy</strong><br />
                      All personal data handled through this platform is subject to the Write For Me Privacy Policy and applicable Indian data protection laws. You will implement appropriate safeguards for any data you access.
                    </p>
                    <p><strong className="text-foreground">6. Account Suspension</strong><br />
                      Write For Me reserves the right to suspend or terminate your organisation account if any violation of these terms is detected, without prior notice.
                    </p>
                    <p><strong className="text-foreground">7. Governing Law</strong><br />
                      These terms shall be governed by the laws of India. Any disputes shall be resolved under the jurisdiction of courts in Pune, Maharashtra.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl border bg-card">
                    <Checkbox
                      id="terms"
                      checked={agreedTerms}
                      onCheckedChange={(v) => setAgreedTerms(v as boolean)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="cursor-pointer font-medium leading-relaxed">
                      I confirm that I have read, understood and agree to the Write For Me Partner Terms of Service and Privacy Policy. I am authorised to accept these terms on behalf of my organisation.
                    </Label>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Review */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Review & Submit</h2>
                    <p className="text-sm text-muted-foreground">Please verify the details before submitting. After submission, the admin team will review your application within 2–3 business days.</p>
                  </div>

                  <div className="rounded-xl border divide-y divide-border overflow-hidden">
                    {[
                      { label: "Organisation Name", value: orgName },
                      { label: "Type", value: orgType },
                      { label: "Website", value: website || "—" },
                      { label: "Contact Person", value: contactName },
                      { label: "Phone", value: contactPhone },
                      { label: "Email", value: contactEmail },
                      { label: "City", value: city },
                      { label: "Document", value: licenseFileName },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center px-5 py-3 gap-4">
                        <span className="text-sm text-muted-foreground w-36 flex-shrink-0">{label}</span>
                        <span className="text-sm font-medium truncate">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 p-4 rounded-xl border bg-primary/5 border-primary/30 text-sm text-primary">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    <span>Your registration will be reviewed by the Write For Me admin team. You'll be notified once approved.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-6 border-t">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(s => s - 1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              )}
              <div className="flex-1" />
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(s => s + 1)} disabled={!canGoNext()}>
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit Registration
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
