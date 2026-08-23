import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CalendarDays, Clock, History, Star, Bell, FileCheck, MapPin, Briefcase, Droplets } from "lucide-react";

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Layout>
      <section className="py-8 md:py-12 container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="section-label mb-2">Dashboard</span>
              <h1 className="text-3xl md:text-4xl font-display font-bold mt-2">
                Welcome back, Aarav
              </h1>
            </div>
            <Button>Request a Scribe</Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Upcoming
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">2 Exams</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Star className="w-4 h-4" /> Trust Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">4.8 / 5</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <History className="w-4 h-4" /> History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">12 Sessions</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" /> Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "UPSC Prelims", date: "Aug 12, 2026", status: "Scribe assigned" },
                    { title: "SSC CGL Tier 1", date: "Aug 25, 2026", status: "Transport requested" },
                  ].map((event, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-teal/10 text-teal font-medium">
                        {event.status}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-coral">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-coral">
                    <Bell className="w-5 h-5" /> Exam Day Reminder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Your UPSC Prelims is tomorrow. Please carry the following:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { icon: FileCheck, text: "Admit card & valid ID" },
                      { icon: Briefcase, text: "Stationery (pen, pencil, eraser)" },
                      { icon: Droplets, text: "Water bottle & snacks" },
                      { icon: MapPin, text: "Reach center 1 hour early" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <item.icon className="w-4 h-4 text-teal" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Agenda</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Dashboard;
