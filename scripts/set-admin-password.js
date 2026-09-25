// scripts/set-admin-password.js
//
// Set (or reset) an admin account's password safely, without reseeding or
// editing the database by hand. If the user doesn't exist yet, it is created
// as an ADMIN. If it exists, its password is updated and it is ensured to be
// an active ADMIN.
//
// Usage (PowerShell / terminal), from the project root:
//
//   node scripts/set-admin-password.js "admin@yourdomain.com" "YourStrongPassword123"
//
// Or, without arguments, it falls back to the ADMIN_EMAIL / ADMIN_PASSWORD
// environment variables:
//
//   node scripts/set-admin-password.js
//
// The password is stored bcrypt-hashed (never in plain text).

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('\nMissing email or password.\n');
    console.error('Usage:  node scripts/set-admin-password.js "<email>" "<password>"');
    console.error('Or set ADMIN_EMAIL and ADMIN_PASSWORD in your environment.\n');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('\nPassword must be at least 8 characters.\n');
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      password: hashed,
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email: normalizedEmail,
      name: 'Admin',
      password: hashed,
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
    },
  });

  console.log(`\n✅ Admin password set for ${user.email} (role: ${user.role}).`);
  console.log('   The password is stored hashed and was not printed.\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Failed to set admin password:', e.message, '\n');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
