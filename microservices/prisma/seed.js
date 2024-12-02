const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create dummy users with their NIN records
    const users = [
      {
        fullName: 'John Doe',
        email: 'john.doe@student.edu',
        dateOfBirth: new Date('1999-05-15'),
        studentNumber: 'STU001',
        qrSignature: 'initial_signature',
        qrTimestamp: new Date(),
        program: 'Computer Science',
        yearOfStudy: 3,
        nin: {
          create: {
            ninNumber: 'NIN001',
            registrationDate: new Date('2020-01-15'),
            registrationLocation: 'Kampala Central'
          }
        }
      },
      {
        fullName: 'Jane Smith',
        email: 'jane.smith@student.edu',
        dateOfBirth: new Date('2000-08-22'),
        studentNumber: 'STU002',
        qrSignature: 'initial_signature',
        qrTimestamp: new Date(),
        program: 'Engineering',
        yearOfStudy: 2,
        nin: {
          create: {
            ninNumber: 'NIN002',
            registrationDate: new Date('2021-03-20'),
            registrationLocation: 'Entebbe'
          }
        }
      },
      {
        fullName: 'Alice Johnson',
        email: 'alice.johnson@student.edu',
        dateOfBirth: new Date('2001-02-10'),
        studentNumber: 'STU003',
        qrSignature: 'initial_signature',
        qrTimestamp: new Date(),
        program: 'Medicine',
        yearOfStudy: 1,
        nin: {
          create: {
            ninNumber: 'NIN003',
            registrationDate: new Date('2022-06-05'),
            registrationLocation: 'Jinja'
          }
        }
      }
    ];

    // Insert the dummy data
    for (const userData of users) {
      const user = await prisma.user.create({
        data: userData,
        include: {
          nin: true
        }
      });
      console.log(`Created user with ID: ${user.id}`);
    }

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
