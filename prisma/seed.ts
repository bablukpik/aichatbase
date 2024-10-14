// import prisma from "@/lib/prisma";
import prisma from "../src/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  // Create roles
  const roles: Prisma.RoleCreateInput[] = [
    { name: "Super Admin", description: "Full access to all features" },
    { name: "Admin", description: "Administrative access" },
    { name: "Manager", description: "Manage specific areas" },
    { name: "Staff", description: "Regular staff access" },
    { name: "Guest", description: "Limited access" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // Create permissions
  const permissions: Prisma.PermissionCreateInput[] = [
    { name: "all", route: "*" },
    { name: "dashboard", route: "/dashboard" },
    { name: "users", route: "/users" },
    { name: "roles", route: "/roles" },
    { name: "permissions", route: "/permissions" },
    // Add more permissions as needed
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  // Assign all permissions to Super Admin role
  const superAdminRole = await prisma.role.findUnique({
    where: { name: "Super Admin" },
  });
  const allPermissions = await prisma.permission.findMany();

  if (superAdminRole) {
    await prisma.role.update({
      where: { id: superAdminRole.id },
      data: {
        permissions: {
          connect: allPermissions.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  // Create a super admin user
  const hashedPassword = await bcrypt.hash("superadmin123", 10);
  const superAdminUser = await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      email: "superadmin@example.com",
      name: "Super Admin",
      password: hashedPassword,
      roles: {
        connect: { name: "Super Admin" },
      },
    },
  });

  console.log("Seed data created successfully");
  console.log("Super Admin user created:", superAdminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
