// frontend/src/pages/Dashboard.tsx
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { useUser } from "@/store/useUser";
import { fetchStudentDashboard, fetchVolunteerDashboard } from "@/lib/api";
import { 
  CalendarDays, Clock, History, Star, Bell, FileCheck, 
  MapPin, Briefcase, Droplets, Award, Users, CheckCircle, 
  TrendingUp, AlertCircle, Loader2, UserCheck, Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardData {
  profile: any;
  upcomingExams?: any[];
  upcomingAssignments?: any[];
  stats: {
    totalSessions?: number;
    completedSessions?: number;
    totalExams?: number;
    completedExams?: number;
    averageRating: number;
    xpPoints?: number;
  };
}

const Dashboard = () => {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const role = user?.role; // "STUDENT" or "VOLUNTEER"

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        let result;
        if (role === 'STUDENT') {
          result = await fetchStudentDashboard();
        } else if (role === 'VOLUNTEER') {
          result = await fetchVolunteerDashboard();
        } else {
          toast.error('Unknown user role');
          return;
        }
        setData(result);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, token, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-teal" />
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No dashboard data available.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 md:py-12 container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="section-label mb-2">Dashboard</span>
              <h1 className="text-3xl md:text-4xl font-display font-bold mt-2">
                Welcome back, {data.profile.name}
              </h1>
              <p className="text-muted-foreground">
                {role === 'STUDENT' ? 'Candidate' : 'Volunteer'} • {data.profile.gender}
              </p>
            </div>
            {role === 'STUDENT' && (
              <Button onClick={() => navigate('/request')}>Request a Scribe</Button>
            )}
            {role === 'VOLUNTEER' && (
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <UserCheck className="w-4 h-4 mr-2" /> Manage Availability
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {role === 'STUDENT' ? (
              <>
                <StatCard
                  icon={Clock}
                  label="Upcoming Exams"
                  value={data.upcomingExams?.length || 0}
                />
                <StatCard
                  icon={Star}
                  label="Trust Score"
                  value={data.stats.averageRating.toFixed(1)}
                />
                <StatCard
                  icon={History}
                  label="Sessions Completed"
                  value={data.stats.completedSessions || 0}
                />
              </>
            ) : (
              <>
                <StatCard
                  icon={TrendingUp}
                  label="Assigned Exams"
                  value={data.upcomingAssignments?.length || 0}
                />
                <StatCard
                  icon={Award}
                  label="XP Points"
                  value={data.stats.xpPoints || 0}
                />
                <StatCard
                  icon={CheckCircle}
                  label="Completed"
                  value={data.stats.completedExams || 0}
                />
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming / Assigned List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    {role === 'STUDENT' ? 'Upcoming Exams' : 'Assigned Exams'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {role === 'STUDENT' ? (
                    data.upcomingExams && data.upcomingExams.length > 0 ? (
                      data.upcomingExams.map((exam: any) => (
                        <EventItem
                          key={exam.id}
                          title={exam.examName}
                          date={new Date(exam.examDate).toLocaleDateString()}
                          status={exam.status}
                        />
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No upcoming exams.</p>
                    )
                  ) : (
                    data.upcomingAssignments && data.upcomingAssignments.length > 0 ? (
                      data.upcomingAssignments.map((exam: any) => (
                        <EventItem
                          key={exam.id}
                          title={exam.examName}
                          date={new Date(exam.examDate).toLocaleDateString()}
                          status={exam.status}
                        />
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No assigned exams.</p>
                    )
                  )}
                </CardContent>
              </Card>

              {/* Role‑specific Reminder / Info Card */}
              {role === 'STUDENT' && (
                <Card className="border-l-4 border-l-coral">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-coral">
                      <Bell className="w-5 h-5" /> Exam Day Reminder
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Make sure you’re prepared for your upcoming exam.
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
              )}

              {role === 'VOLUNTEER' && (
                <Card className="border-l-4 border-l-teal">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal">
                      <Home className="w-5 h-5" /> Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={() => navigate('/profile')}>
                        Update Profile
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/matching')}>
                        View Matches
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right sidebar – Calendar */}
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

// Helper components
const StatCard = ({ icon: Icon, label, value }: any) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon className="w-4 h-4" /> {label}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const EventItem = ({ title, date, status }: any) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{date}</p>
    </div>
    <span className="text-xs px-2 py-1 rounded-full bg-teal/10 text-teal font-medium">
      {status}
    </span>
  </div>
);

export default Dashboard;