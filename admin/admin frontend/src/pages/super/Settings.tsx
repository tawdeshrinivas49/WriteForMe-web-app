import { useState } from "react";
import { Save, RefreshCw, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { AdminPage } from "@admin/components/AdminPage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SuperSettings() {
  const [platformFeeActive, setPlatformFeeActive] = useState(true);
  const [platformFee, setPlatformFee] = useState("250");
  const [searchRadius, setSearchRadius] = useState("15");
  const [whatsappActive, setWhatsappActive] = useState(true);
  const [autoReleasePayout, setAutoReleasePayout] = useState(false);
  const [minTrustScore, setMinTrustScore] = useState("70");
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Platform settings updated successfully");
    }, 800);
  };

  return (
    <AdminPage
      title="Platform Settings"
      description="Manage application operational constants, auto-matching distances, payment gateway parameters, and dispatch thresholds."
    >
      <form onSubmit={handleSave}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Fee & Escrow Configuration */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Financial & Escrow Settings</CardTitle>
              <CardDescription>Configure platform charges and honorariums</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="platform-fee-toggle" className="font-semibold text-sm cursor-pointer">Charge Platform Fee</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Charge candidates a nominal platform fee for matching services.</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-muted-foreground">Toggles whether candidates pay transport/fee charges.</p>
                </div>
                <Switch
                  id="platform-fee-toggle"
                  checked={platformFeeActive}
                  onCheckedChange={setPlatformFeeActive}
                />
              </div>

              {platformFeeActive && (
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <Label htmlFor="fee-amount" className="text-sm font-semibold">Standard Platform Fee (INR)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-semibold">₹</span>
                    <Input
                      id="fee-amount"
                      type="number"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(e.target.value)}
                      className="max-w-[120px]"
                      min="0"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-release" className="font-semibold text-sm cursor-pointer">Auto-release Escrow Payouts</Label>
                  <p className="text-xs text-muted-foreground">Automatically release UPI payouts immediately when completion PIN is verified.</p>
                </div>
                <Switch
                  id="auto-release"
                  checked={autoReleasePayout}
                  onCheckedChange={setAutoReleasePayout}
                />
              </div>
            </CardContent>
          </Card>

          {/* Operational & Dispatch Settings */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Matchmaking & Alert Thresholds</CardTitle>
              <CardDescription>Control dispatch ranges and criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="search-radius" className="text-sm font-semibold">Initial Scribe Match Radius (Km)</Label>
                  <span className="text-xs text-muted-foreground font-semibold">{searchRadius} km</span>
                </div>
                <Input
                  id="search-radius"
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Maximum initial search distance around candidate's exam center location.</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-border/40">
                <Label htmlFor="min-trust" className="text-sm font-semibold">Min Scribe Trust Score Threshold</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="min-trust"
                    type="number"
                    min="50"
                    max="100"
                    value={minTrustScore}
                    onChange={(e) => setMinTrustScore(e.target.value)}
                    className="max-w-[100px]"
                  />
                  <span className="text-xs text-muted-foreground">Volunteers with scores below this will not receive matching priority notifications.</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsapp" className="font-semibold text-sm cursor-pointer">Dispatch WhatsApp Notifications</Label>
                  <p className="text-xs text-muted-foreground">Send real-time alerts to scribes for matched sessions via WhatsApp API.</p>
                </div>
                <Switch
                  id="whatsapp"
                  checked={whatsappActive}
                  onCheckedChange={setWhatsappActive}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Actions Footer */}
        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white font-medium shadow-sm"
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Constants
              </>
            )}
          </Button>
        </div>
      </form>
    </AdminPage>
  );
}
