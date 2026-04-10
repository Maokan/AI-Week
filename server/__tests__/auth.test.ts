import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app, prisma } from '../index';
import bcrypt from 'bcryptjs';

vi.mock('@prisma/client', () => {
  const mPrisma = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  };
  return { PrismaClient: vi.fn(() => mPrisma) };
});

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/login', () => {
    it('should return 401 for invalid credentials', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const res = await request(app)
        .post('/api/login')
        .send({ login: 'wrong', password: 'password' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should return user for valid credentials', async () => {
      const hashed = await bcrypt.hash('password', 10);
      (prisma.user.findUnique as any).mockResolvedValue({
        id: '1',
        login: 'test',
        password: hashed,
        name: 'Test User',
      });

      const res = await request(app)
        .post('/api/login')
        .send({ login: 'test', password: 'password' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test User');
      expect(res.body.password).toBeUndefined();
    });
  });

  describe('POST /api/register', () => {
    it('should create a new user', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);
      (prisma.user.create as any).mockResolvedValue({
        id: '2',
        login: 'new',
        name: 'New User',
        role: 'ELEVE',
      });

      const res = await request(app)
        .post('/api/register')
        .send({ name: 'New User', login: 'new', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.login).toBe('new');
    });
  });
});
