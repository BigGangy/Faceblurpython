import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test the connection by querying the database version
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('Database connection successful!');
    console.log('PostgreSQL Version:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('✅ Database connection test passed');
  } else {
    console.log('❌ Database connection test failed');
  }
}); 