import bcrypt from 'bcryptjs';
import { db } from './connection.js';
import { users } from './schema.js';
import { eq } from 'drizzle-orm';

export const seedAdminUser = async () => {
  try {
    // Periksa apakah admin sudah ada
    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.role, 'admin'));

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10); // password default sementara

    // Buat user admin
    await db.insert(users).values({
      name: 'Admin Diara Cookies',
      email: 'admin@diaracookies.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};