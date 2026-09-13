const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Error: Please provide an email address.');
    console.log('Usage: node make-admin.js <email>');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error(`❌ Error: User with email "${email}" not found in the database.`);
      process.exit(1);
    }

    await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    });

    console.log(`✅ Success! User "${email}" has been successfully promoted to ADMIN.`);
    console.log('You can now log in and access the Admin Panel.');
  } catch (err) {
    console.error('❌ Database error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
