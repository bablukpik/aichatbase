// import prisma from "@/lib/prisma";
import prisma from "../src/lib/prisma";
import { Prisma } from '@prisma/client';
import bcrypt from "bcryptjs";

const organization = {
  id: "default-id",
  name: "Default Organization",
};

const superAdmin = {
  email: "superadmin@example.com",
  name: "Super Admin",
  password: "superadmin123",
  organizationId: organization.id,
};

async function main() {
  // Create default organization first
  const defaultOrg = await prisma.organization.upsert({
    where: { id: organization.id },
    update: {},
    create: {
      id: organization.id,
      name: organization.name,
    },
  });

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
    where: { name: superAdmin.name },
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
  const hashedPassword = await bcrypt.hash(superAdmin.password, 10);
  const superAdminUser = await prisma.user.upsert({
    where: { email: superAdmin.email },
    update: {},
    create: {
      email: superAdmin.email,
      name: superAdmin.name,
      password: hashedPassword,
      organizationId: defaultOrg.id,
      roles: {
        connect: { name: superAdmin.name },
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
