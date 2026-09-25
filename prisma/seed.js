// prisma/seed.js
// Seeds the Neon PostgreSQL database with initial data

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Neon...');

  // ============================================================================
  // CREATE ADMIN USER
  // ============================================================================
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@edutrackhub.com';
  const adminPlainPassword = process.env.ADMIN_PASSWORD || 'admin123456';
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('⚠️  No ADMIN_PASSWORD set — using the insecure default. Set ADMIN_EMAIL and ADMIN_PASSWORD in your environment before seeding a production database.');
  }
  const adminPassword = await bcrypt.hash(adminPlainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: process.env.ADMIN_NAME || 'Gabriel (Admin)',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // ============================================================================
  // CREATE SAMPLE STUDENTS
  // ============================================================================
  
  const studentPassword = await bcrypt.hash('student123456', 10);
  
  const student1 = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'Test Student',
      password: studentPassword,
      role: 'STUDENT',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✅ Test student created:', student1.email);

  const student2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Doe',
      password: studentPassword,
      role: 'STUDENT',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✅ Second student created:', student2.email);

  // ============================================================================
  // CREATE SAMPLE CLASSES
  // ============================================================================
  
  // Helper to create dates relative to now
  const futureDate = (days, hours = 10) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hours, 0, 0, 0);
    return date;
  };

  const pastDate = (daysAgo, hours = 10) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hours, 0, 0, 0);
    return date;
  };

  // Upcoming classes
  const class1 = await prisma.class.create({
    data: {
      title: 'IGCSE Math: Algebra Fundamentals',
      description: 'Master the basics of algebra including equations, inequalities, and functions. Perfect for students starting their IGCSE journey.',
      subject: 'IGCSE Math',
      level: 'BEGINNER',
      scheduledTime: futureDate(3, 10),
      duration: 60,
      maxStudents: 10,
      price: 0, // Free
      currency: 'NGN',
      topics: JSON.stringify(['Linear equations', 'Quadratic basics', 'Functions intro']),
      status: 'SCHEDULED',
    },
  });
  console.log('✅ Class created:', class1.title);

  const class2 = await prisma.class.create({
    data: {
      title: 'SAT Reading: Passage Analysis',
      description: 'Learn strategies for tackling SAT reading passages effectively. Focus on main idea, inference, and vocabulary in context.',
      subject: 'SAT Reading',
      level: 'INTERMEDIATE',
      scheduledTime: futureDate(5, 14),
      duration: 90,
      maxStudents: 8,
      price: 500000, // ₦5,000
      currency: 'NGN',
      topics: JSON.stringify(['Main idea', 'Evidence-based questions', 'Vocabulary in context']),
      status: 'SCHEDULED',
    },
  });
  console.log('✅ Class created:', class2.title);

  const class3 = await prisma.class.create({
    data: {
      title: 'IGCSE Physics: Motion & Forces',
      description: 'Understand the fundamental concepts of motion, velocity, acceleration, and Newton\'s laws of motion.',
      subject: 'IGCSE Physics',
      level: 'BEGINNER',
      scheduledTime: futureDate(7, 16),
      duration: 75,
      maxStudents: 12,
      price: 300000, // ₦3,000
      currency: 'NGN',
      topics: JSON.stringify(['Speed vs velocity', 'Acceleration', 'Newton\'s laws']),
      status: 'SCHEDULED',
    },
  });
  console.log('✅ Class created:', class3.title);

  // Past completed class (for progress tracking demo)
  const pastClass = await prisma.class.create({
    data: {
      title: 'IGCSE Math: Number Theory Basics',
      description: 'Introduction to number theory concepts including prime numbers, factors, and multiples.',
      subject: 'IGCSE Math',
      level: 'BEGINNER',
      scheduledTime: pastDate(7, 10),
      duration: 60,
      maxStudents: 10,
      price: 0,
      currency: 'NGN',
      topics: JSON.stringify(['Prime numbers', 'Factors', 'Multiples', 'LCM & GCF']),
      status: 'COMPLETED',
      recordingUrl: 'https://drive.google.com/file/d/example/view',
      notesUrl: 'https://docs.google.com/document/d/example/view',
    },
  });
  console.log('✅ Past class created:', pastClass.title);

  // ============================================================================
  // CREATE ENROLLMENTS
  // ============================================================================

  // Student 1 enrolled in free class (confirmed) and past class (completed)
  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      classId: class1.id,
      status: 'CONFIRMED',
      confirmedAt: new Date(),
    },
  });
  console.log('✅ Enrollment: Test Student → Algebra Fundamentals');

  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      classId: pastClass.id,
      status: 'COMPLETED',
      confirmedAt: pastDate(8),
      completedAt: pastDate(7),
      rating: 5,
      feedback: 'Great class! Very clear explanations.',
    },
  });
  console.log('✅ Enrollment: Test Student → Number Theory (Completed)');

  // Student 2 enrolled in physics class
  await prisma.enrollment.create({
    data: {
      userId: student2.id,
      classId: class3.id,
      status: 'CONFIRMED',
      confirmedAt: new Date(),
    },
  });
  console.log('✅ Enrollment: Jane Doe → Physics');

  // ============================================================================
  // CREATE ATTENDANCE RECORD (for completed class)
  // ============================================================================

  await prisma.attendance.create({
    data: {
      classId: pastClass.id,
      userId: student1.id,
      joinedAt: pastDate(7, 10),
      leftAt: pastDate(7, 11),
      duration: 58,
      wasPresent: true,
    },
  });
  console.log('✅ Attendance record created for completed class');

  // ============================================================================
  // CREATE PROGRESS RECORDS
  // ============================================================================

  await prisma.progress.create({
    data: {
      userId: student1.id,
      subject: 'IGCSE Math',
      classesEnrolled: 2,
      classesAttended: 1,
      classesCompleted: 1,
      totalMinutes: 58,
      currentLevel: 'BEGINNER',
      lastClassDate: pastDate(7),
      streak: 1,
    },
  });
  console.log('✅ Progress record created for Test Student');

  // ============================================================================
  // CREATE SAMPLE RESOURCES
  // ============================================================================

  await prisma.resource.create({
    data: {
      title: 'IGCSE Math Formula Sheet',
      description: 'Comprehensive formula sheet covering all IGCSE Math topics.',
      type: 'PDF',
      subject: 'IGCSE Math',
      level: 'BEGINNER',
      url: 'https://example.com/igcse-math-formulas.pdf',
      isPublished: true,
      downloads: 45,
    },
  });

  await prisma.resource.create({
    data: {
      title: 'SAT Reading Strategy Guide',
      description: 'Step-by-step strategies for SAT Reading section.',
      type: 'PDF',
      subject: 'SAT Reading',
      level: 'INTERMEDIATE',
      url: 'https://example.com/sat-reading-guide.pdf',
      isPublished: true,
      downloads: 32,
    },
  });
  console.log('✅ Sample resources created');

  // ============================================================================
  // CREATE INITIAL AUDIT LOG
  // ============================================================================

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'SEED',
      entity: 'System',
      entityId: 'database',
      metadata: JSON.stringify({ version: '2.0', seedDate: new Date().toISOString() }),
    },
  });
  console.log('✅ Audit log initialized');

  // ============================================================================
  // SUMMARY
  // ============================================================================
  
  console.log('\n📊 Seed Summary:');
  console.log(`   Users: ${await prisma.user.count()}`);
  console.log(`   Classes: ${await prisma.class.count()}`);
  console.log(`   Enrollments: ${await prisma.enrollment.count()}`);
  console.log(`   Progress Records: ${await prisma.progress.count()}`);
  console.log(`   Resources: ${await prisma.resource.count()}`);
  console.log('\n🎉 Database seeded successfully!');
  
  console.log('\n📝 Accounts created:');
  console.log(`   Admin: ${adminEmail}`);
  console.log('   Students: student@example.com, jane@example.com');
  console.log('   (Passwords were set from environment variables or the local dev defaults — not printed here.)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
