import { useState } from "react";
import { Search, UserMinus, UserPlus, Check, X, ShieldAlert } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface RosterStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  exams: number;
  rating: number;
  verified: boolean;
}

const initialStudents: RosterStudent[] = [
  { id: "ST-01", name: "Karan Mehta", email: "karan.mehta@mit.edu", course: "B.Tech CSE - Yr 3", exams: 9, rating: 4.8, verified: true },
  { id: "ST-02", name: "Priya Patel", email: "priya.patel@mit.edu", course: "B.A. English - Yr 2", exams: 4, rating: 4.9, verified: true },
  { id: "ST-03", name: "Amit Shah", email: "amit.shah@mit.edu", course: "B.Sc Physics - Yr 3", exams: 2, rating: 4.5, verified: false },
  { id: "ST-04", name: "Rohan Deshmukh", email: "rohan.d@mit.edu", course: "B.Tech ECE - Yr 4", exams: 12, rating: 4.7, verified: true },
  { id: "ST-05", name: "Sneha Patil", email: "sneha.patil@mit.edu", course: "B.Com - Yr 1", exams: 0, rating: 5.0, verified: true },
];

export default function PartnerRoster() {
  const [students, setStudents] = useState<RosterStudent[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const handleUnlink = (id: string, name: string) => {
    setStudents(students.filter((s) => s.id !== id));
    toast.error(`Unlinked ${name} from your institution roster`);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) {
      toast.error("Please fill in the required fields");
      return;
    }
    const newStudent: RosterStudent = {
      id: `ST-${Date.now().toString().slice(-2)}`,
      name: newName,
      email: newEmail,
      course: newCourse || "Undergraduate",
      exams: 0,
      rating: 5.0,
      verified: true,
    };
    setStudents([newStudent, ...students]);
    setNewName("");
    setNewEmail("");
    setNewCourse("");
    setAddOpen(false);
    toast.success(`Successfully enrolled ${newName} in your roster`);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminPage
      title="Student Roster"
      description="Manage the student volunteer scribes linked to your institution. Monitor their academic credentials and community ratings."
      actions={
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-medium">
              <UserPlus className="w-4 h-4 mr-2" /> Add Student Scribe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddStudent}>
              <DialogHeader>
                <DialogTitle>Enroll Student Scribe</DialogTitle>
                <DialogDescription>
                  Link a student scribe to your institution's profile. They will receive invitation priorities for nearby exam requests.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Karan Mehta" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="karan.mehta@university.edu" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="course" className="text-right">Course/Year</Label>
                  <Input id="course" value={newCourse} onChange={(e) => setNewCourse(e.target.value)} placeholder="B.Tech CSE - Year 3" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button type="submit">Add Student</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Active Roster List</CardTitle>
              <CardDescription>Verify and audit student associations</CardDescription>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/20">
                <tr>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Student Info</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Course & Stream</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Exams Scribed</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Avg Rating</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No student scribes found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-3">
                        <div>
                          <div className="font-semibold text-foreground">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.email}</div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{s.course}</td>
                      <td className="p-3 text-center font-medium">{s.exams}</td>
                      <td className="p-3 text-center">
                        <span className="font-semibold text-amber-500">★ {s.rating.toFixed(1)}</span>
                      </td>
                      <td className="p-3 text-center">
                        {s.verified ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-none flex items-center gap-1 w-fit mx-auto">
                            <Check className="w-3 h-3" /> Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-500 border-amber-500/40 flex items-center gap-1 w-fit mx-auto">
                            <ShieldAlert className="w-3 h-3" /> Pending verification
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleUnlink(s.id, s.name)}
                          title="Unlink student from institution"
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminPage>
  );
}
