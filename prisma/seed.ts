import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PRODUCT_CATALOG } from "../src/lib/catalog";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data (order matters due to foreign keys).
  // Users are preserved so a registered admin account survives re-seeding.
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const p of PRODUCT_CATALOG) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        imageUrl: p.imageUrl,
        stock: p.stock,
      },
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        imageUrl: p.imageUrl,
        stock: p.stock,
      },
    });
  }

  const count = await prisma.product.count();
  console.log(`✅ Seeded ${count} products`);

  // Provision the admin account from .env (ADMIN_EMAIL + ADMIN_PASSWORD).
  // Ensures the site owner always has working admin credentials after a seed.
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existing) {
      // Promote to admin + refresh password in case credentials changed.
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: "admin", passwordHash: await bcrypt.hash(adminPassword, 10) },
      });
      console.log(`✅ Admin account updated: ${adminEmail}`);
    } else {
      await prisma.user.create({
        data: {
          name: "Admin",
          email: adminEmail,
          passwordHash: await bcrypt.hash(adminPassword, 10),
          role: "admin",
        },
      });
      console.log(`✅ Admin account created: ${adminEmail}`);
    }
  } else {
    console.log("⚠️  ADMIN_EMAIL/ADMIN_PASSWORD not set in .env — skipping admin provisioning.");
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
