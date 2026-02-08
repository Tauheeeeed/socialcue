const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying data...');

    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);

    const profileCount = await prisma.userProfile.count();
    console.log(`Profile count: ${profileCount}`);

    const matchCount = await prisma.match.count();
    console.log(`Match count: ${matchCount}`);

    const firstUser = await prisma.user.findFirst({
        include: {
            profile: true,
            messages: true
        }
    });

    if (firstUser) {
        console.log('Sample User:', JSON.stringify(firstUser, null, 2));
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
