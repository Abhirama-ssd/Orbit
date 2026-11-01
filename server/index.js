import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(cors());
app.use(express.json());

const accounts = {
  "STU-2026-014": { role: "student", name: "Aarav Sharma", className: "8", section: "A", roll: "14", classCode: "001" },
  "PAR-2026-014": { role: "parent", name: "Meera Sharma", child: "Aarav Sharma" },
  "TCH-2048": { role: "teacher", name: "Ananya Iyer", subject: "Mathematics" }
};

const dashboard = {
  student: {
    streak: 6, points: 1240, level: 3, mastery: 78,
    dictionary: [
      { word: "balance", meaning: "A state in which different parts remain equal or steady.", example: "The equation stayed in balance after we added four to both sides." },
      { word: "curious", meaning: "Eager to learn or know something.", example: "A curious question helped our group discover a new idea." },
      { word: "friction", meaning: "A force that resists movement when two surfaces touch.", example: "Friction between the bicycle brakes and wheel helped it stop." }
    ],
    subjects: [
      { name: "Mathematics", score: 82, color: "violet", icon: "∑", detail: "Algebra · 3 lessons" },
      { name: "Science", score: 74, color: "mint", icon: "⚛", detail: "Force & motion · 2 lessons" },
      { name: "English", score: 91, color: "gold", icon: "Aa", detail: "Grammar · 1 lesson" },
      { name: "Social Studies", score: 68, color: "blue", icon: "◎", detail: "The Constitution · 4 lessons" }
    ],
    tasks: [
      { title: "Linear equations · Practice set", subject: "Mathematics", due: "Today, 6:00 PM", kind: "DPP", done: false },
      { title: "Friction around us", subject: "Science", due: "Tomorrow", kind: "Activity", done: false },
      { title: "A visit to Cambridge · Reading", subject: "English", due: "Fri, 31 Oct", kind: "Reading", done: true }
    ],
    credits: 120,
    badges: ["Math Wizard", "6-day Streak", "Curious Mind"]
  },
  parent: {
    attendance: 94, appStreak: 6, learningHours: 8.5, tier: "Silver", testAverage: 82, dppCompletion: 84,
    subjects: [{ name: "Mathematics", score: 82 }, { name: "Science", score: 74 }, { name: "English", score: 91 }, { name: "Social Studies", score: 68 }],
    attendanceLog: [{ date: "Today", status: "Present" }, { date: "Yesterday", status: "Present" }, { date: "Mon, 26 Oct", status: "Present" }, { date: "Fri, 23 Oct", status: "Absent" }],
    appAttendanceLog: [{ date: "Today", status: "Active · 42 min" }, { date: "Yesterday", status: "Active · 36 min" }, { date: "Mon, 26 Oct", status: "Active · 51 min" }, { date: "Fri, 23 Oct", status: "No activity" }],
    messages: ["Aarav showed great improvement in algebra this week.", "Please bring the science activity journal on Friday."]
  },
  teacher: {
    students: 32, submissions: 18, attention: 7, classMastery: 76,
    groups: [{ name: "Advanced", count: 8, color: "violet" }, { name: "On-Track", count: 17, color: "mint" }, { name: "Remedial", count: 7, color: "gold" }],
    concepts: [{ name: "Fractions", score: 88 }, { name: "Linear equations", score: 72 }, { name: "Ratio & proportion", score: 64 }, { name: "Geometry", score: 81 }],
    roster: [
      { name: "Aarav Sharma", section: "A", score: 82, badge: "Silver", credits: 1240 },
      { name: "Diya Patel", section: "A", score: 94, badge: "Gold", credits: 1860 },
      { name: "Kabir Rao", section: "A", score: 76, badge: "Silver", credits: 980 },
      { name: "Sana Khan", section: "A", score: 62, badge: "Bronze", credits: 540 },
      { name: "Ishaan Mehta", section: "A", score: 88, badge: "Gold", credits: 1510 },
      { name: "Anika Das", section: "A", score: 69, badge: "Bronze", credits: 710 }
    ],
    inbox: [{ from: "Aarav Sharma", role: "Student", text: "Could you explain question 4 from today's DPP?", time: "2 min ago" }, { from: "Meera Sharma", role: "Parent", text: "Thank you for sharing the weekly progress update.", time: "1 hr ago" }],
    submissionsList: [{ student: "Diya Patel", task: "Linear equations · DPP", status: "Needs review" }, { student: "Kabir Rao", task: "Friction activity", status: "Submitted" }, { student: "Sana Khan", task: "Fractions · DPP", status: "Needs review" }]
  }
};

const additionalStudentNames = [
  "Riya Kapoor", "Dev Malhotra", "Nisha Rao", "Arjun Bose", "Tara Nair", "Rehan Ali",
  "Mira Sen", "Kunal Das", "Pooja Iyer", "Aditya Shah", "Leela Menon", "Rohan Jain",
  "Aisha Khan", "Vikram Sethi", "Neha Pillai", "Siddharth Roy", "Ira Bhat", "Manav Gill",
  "Anaya Reddy", "Yusuf Ahmed", "Kavya Joshi", "Parth Verma", "Sana Thomas", "Om Prakash",
  "Zoya Mirza", "Rahul Dutta"
];
const additionalScores = [89, 87, 91, 86, 94, 88, 75, 82, 73, 79, 84, 71, 77, 80, 74, 83, 72, 78, 81, 76, 70, 65, 68, 61, 66, 69];
dashboard.teacher.roster.push(...additionalStudentNames.map((name, index) => {
  const score = additionalScores[index];
  return {
    name, section: "A", score,
    badge: score >= 85 ? "Gold" : score >= 70 ? "Silver" : "Bronze",
    credits: score * 15
  };
}));

const activity = [];
const wordSubmissions = [];
const attendanceRecords = [];
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.post("/api/login", (req, res) => {
  const username = String(req.body?.username || "").trim().toUpperCase();
  const pin = String(req.body?.password || "");
  const detectedRole = /^STU-?\d/i.test(username) ? "student" : /^PAR-?\d/i.test(username) ? "parent" : /^TCH-?\d/i.test(username) ? "teacher" : null;
  const account = accounts[username] || (detectedRole === "student"
    ? { role: "student", name: "Student", className: "8", section: "A", roll: username.slice(-2), classCode: "001" }
    : detectedRole === "parent"
      ? { role: "parent", name: "Parent", child: "Aarav Sharma" }
      : detectedRole === "teacher"
        ? { role: "teacher", name: "Teacher", subject: "Mathematics" }
        : null);
  if (!account || !detectedRole || detectedRole !== account.role || pin !== "1234") {
    return res.status(401).json({ error: "That ID or PIN doesn't match. Check it and try again." });
  }
  res.json({ token: `${account.role}:${username}`, user: { ...account, id: username } });
});

app.get("/api/dashboard/:role", (req, res) => {
  const data = dashboard[req.params.role];
  if (!data) return res.status(404).json({ error: "Dashboard not found." });
  if (req.params.role === "parent") {
    const childAttendance = attendanceRecords
      .filter((entry) => entry.student === data.child)
      .slice()
      .reverse()
      .map((entry) => ({
        date: entry.date === new Date().toISOString().slice(0, 10)
          ? "Today"
          : new Date(`${entry.date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
        status: entry.status
      }));
    const attendanceLog = childAttendance.length
      ? childAttendance.concat(data.attendanceLog.filter((entry) => !childAttendance.some((saved) => saved.date === entry.date))).slice(0, 7)
      : data.attendanceLog;
    return res.json({ ...data, attendanceLog });
  }
  res.json(data);
});

app.post("/api/feedback", (req, res) => {
  const { message, user } = req.body || {};
  if (typeof message !== "string" || !message.trim()) return res.status(400).json({ error: "Please add a message." });
  activity.push({ type: "feedback", message: message.trim(), user: user || "Student", createdAt: new Date().toISOString() });
  res.status(201).json({ ok: true });
});
app.post("/api/assignments", (req, res) => {
  const { title, subject } = req.body || {};
  if (!title?.trim() || !subject?.trim()) return res.status(400).json({ error: "A title and subject are required." });
  const assignment = { title: title.trim(), subject: subject.trim(), createdAt: new Date().toISOString() };
  activity.push({ type: "assignment", ...assignment });
  res.status(201).json({ assignment });
});
app.post("/api/classroom-posts", (req, res) => {
  const { type, title, subject, content } = req.body || {};
  const allowedTypes = ["Assignment", "Class note", "Handbook"];
  if (!allowedTypes.includes(type) || typeof title !== "string" || !title.trim() || typeof subject !== "string" || !subject.trim()) {
    return res.status(400).json({ error: "Choose a post type, subject, and title." });
  }
  const post = {
    type, title: title.trim(), subject: subject.trim(),
    content: typeof content === "string" ? content.trim() : "",
    createdAt: new Date().toISOString()
  };
  activity.push({ type: "classroom-post", ...post });
  res.status(201).json({ post });
});
app.post("/api/grades", (req, res) => {
  const { student, task, score, feedback } = req.body || {};
  const numericScore = Number(score);
  if (typeof student !== "string" || !student.trim() || typeof task !== "string" || !task.trim()
    || !Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100
    || typeof feedback !== "string" || !feedback.trim()) {
    return res.status(400).json({ error: "Add the student's work, a score from 0 to 100, and feedback." });
  }
  const grade = {
    type: "grade", student: student.trim(), task: task.trim(), score: numericScore,
    feedback: feedback.trim(), createdAt: new Date().toISOString()
  };
  activity.push(grade);
  res.status(201).json({ grade });
});
app.post("/api/attendance", (req, res) => {
  const { student, date, status } = req.body || {};
  const parsedDate = typeof date === "string" ? new Date(date) : null;
  const validDate = parsedDate && !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date;
  if (typeof student !== "string" || !student.trim() || !validDate
    || !["Present", "Absent"].includes(status)) {
    return res.status(400).json({ error: "Choose a student, valid date, and Present or Absent status." });
  }
  const record = { student: student.trim(), date, status };
  const existingIndex = attendanceRecords.findIndex((entry) => entry.student === record.student && entry.date === record.date);
  if (existingIndex >= 0) attendanceRecords[existingIndex] = record;
  else attendanceRecords.push(record);
  res.status(201).json({ attendance: record });
});
app.post("/api/messages", (req, res) => {
  const { message, user } = req.body || {};
  if (!message?.trim()) return res.status(400).json({ error: "Message cannot be empty." });
  const entry = { type: "message", message: message.trim(), user: user || "Student", createdAt: new Date().toISOString() };
  activity.push(entry);
  res.status(201).json({ message: entry });
});
app.post("/api/submissions", (req, res) => {
  const { subject, answer } = req.body || {};
  if (typeof subject !== "string" || !subject.trim() || typeof answer !== "string" || !answer.trim()) {
    return res.status(400).json({ error: "Add your subject and work before submitting." });
  }
  const submission = { type: "submission", subject: subject.trim(), answer: answer.trim(), createdAt: new Date().toISOString() };
  activity.push(submission);
  res.status(201).json({ submission });
});

app.post("/api/word-discovery", (req, res) => {
  const { word, meaning, sentence, className, section, studentId, studentName } = req.body || {};
  const grade = Number(className);
  if (!Number.isInteger(grade) || grade < 6 || grade > 8) {
    return res.status(400).json({ error: "Daily Word Discovery is available for Classes 6–8." });
  }
  if (![word, meaning, sentence, studentId, studentName].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ error: "Add a word, its meaning, an original sentence, and your student profile." });
  }
  const normalize = (value) => value.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
  const today = new Date().toISOString().slice(0, 10);
  const classEntries = wordSubmissions.filter((entry) => entry.className === grade && entry.date === today);
  if (classEntries.some((entry) => entry.studentId === studentId)) {
    return res.status(409).json({ error: "You have already submitted today's word. Come back tomorrow for a new one." });
  }
  const normalized = { word: normalize(word), meaning: normalize(meaning), sentence: normalize(sentence) };
  const duplicate = classEntries.some((entry) => entry.studentId !== studentId
    && entry.word === normalized.word
    && entry.meaning === normalized.meaning
    && entry.sentence === normalized.sentence);
  const uniqueWord = !classEntries.some((entry) => entry.word === normalized.word);
  const credits = duplicate ? 0 : uniqueWord ? 25 : 10;
  const submission = {
    studentId, studentName: studentName.trim(), className: grade, section: String(section || "A"),
    word: word.trim(), meaning: meaning.trim(), sentence: sentence.trim(), date: today,
    credits, result: duplicate ? "duplicate" : uniqueWord ? "unique" : "original"
  };
  wordSubmissions.push({ ...submission, ...normalized });
  res.status(201).json({ submission });
});

app.use(express.static(resolve(__dirname, "../dist")));
app.listen(PORT, () => console.log(`Orbit API running on http://localhost:${PORT}`));
