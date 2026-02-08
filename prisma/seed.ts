import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Clean existing data (safe for hackathon)
    await prisma.match.deleteMany();
    await prisma.userMessage.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    const users = await Promise.all(
        Array.from({ length: 10 }).map(() =>
            prisma.user.create({
                data: {
                    name: faker.person.firstName(),
                },
            })
        )
    );

    // Create messages + profiles
    for (const user of users) {
        await prisma.userMessage.createMany({
            data: [
                {
                    userId: user.id,
                    role: "user",
                    content: faker.lorem.sentence(),
                },
                {
                    userId: user.id,
                    role: "assistant",
                    content: faker.lorem.sentence(),
                },
            ],
        });

        await prisma.userProfile.create({
            data: {
                userId: user.id,
                profile: {
                    bio: faker.lorem.sentence(),
                    values: ["growth", "authenticity"],
                    personality: {
                        introversion: faker.number.float({ min: 0.3, max: 0.8 }),
                        conversation_depth: "deep",
                    },
                    activities: [
                        { name: "coffee walks", level: 5 },
                        { name: "park walks", level: 4 },
                    ],
                    interests: [
                        { name: "philosophy", category: "ideas", level: 4 },
                        { name: "movies", category: "entertainment", level: 3 },
                    ],
                    availability: { weekends: true },
                    dealbreakers: { excessive_phone_use: true },
                },
            },
        });
    }

    console.log("✅ Seeding complete");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
