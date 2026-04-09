import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgresql:postgresql@localhost:5432/ai_week_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const app = express();
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 3001;

// Auto-bootstrap Admin Account
const bootstrapAdmin = async () => {
  try {
    const admin = await prisma.user.findUnique({ where: { login: 'admin' } });
    if (!admin) {
      const adminHash = await bcrypt.hash('marge123', 10);
      await prisma.user.create({
        data: { login: 'admin', password: adminHash, name: 'Admin Principal', role: 'DIRECTION' }
      });
      console.log('✅ Admin initialized automatically: admin / marge123');
    }
  } catch (err) {
    console.error('Failed to bootstrap admin:', err);
  }
};
bootstrapAdmin();

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, login, password } = req.body;
    if (!name || !login || !password) return res.status(400).json({ error: 'Missing fields' });

    const existingUser = await prisma.user.findUnique({ where: { login } });
    if (existingUser) return res.status(400).json({ error: 'Login already used' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, login, password: hashedPassword, role: 'ELEVE' }
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await prisma.user.findUnique({ where: { login } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Users Route
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Courses Route
app.get('/api/courses', async (req, res) => {
  const courses = await prisma.course.findMany();
  res.json(courses);
});

// Grades Routes
app.get('/api/grades', async (req, res) => {
  const grades = await prisma.grade.findMany();
  res.json(grades);
});

app.post('/api/grades', async (req, res) => {
  try {
    const { studentId, courseId, value, comment } = req.body;
    const grade = await prisma.grade.create({
      data: { studentId, courseId, value, comment }
    });
    res.json(grade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create grade' });
  }
});

// Schedule & Attendance Routes
app.get('/api/schedule', async (req, res) => {
  const schedule = await prisma.scheduleSession.findMany();
  res.json(schedule);
});

app.get('/api/attendance', async (req, res) => {
  const attendance = await prisma.attendance.findMany();
  res.json(attendance);
});

app.post('/api/attendance/toggle', async (req, res) => {
  try {
    const { sessionId, studentId } = req.body;
    
    // Check if attendance exists
    const existing = await prisma.attendance.findUnique({
      where: {
        sessionId_studentId: { sessionId, studentId }
      }
    });

    if (existing) {
       await prisma.attendance.delete({
         where: { id: existing.id }
       });
       res.json({ action: 'deleted' });
    } else {
       const newAtt = await prisma.attendance.create({
         data: { sessionId, studentId, present: true }
       });
       res.json({ action: 'created', data: newAtt });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle attendance' });
  }
});

// Tasks Routes
app.get('/api/tasks', async (req, res) => {
  const tasks = await prisma.projectTask.findMany();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, status } = req.body;
    const task = await prisma.projectTask.create({
      data: { title, status }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await prisma.projectTask.update({
      where: { id },
      data: { status }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.projectTask.delete({ where: { id } });
    res.json({ success: true, deletedId: id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Messages Routes
app.get('/api/messages', async (req, res) => {
  const messages = await prisma.message.findMany();
  res.json(messages);
});

app.post('/api/messages', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const message = await prisma.message.create({
      data: { senderId, receiverId, content }
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Assignments (PO to Class)
app.put('/api/users/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { classId } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { classId }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign class' });
  }
});

app.put('/api/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign role' });
  }
});

// Removed generic /api/seed intentionally to match UI removal

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
