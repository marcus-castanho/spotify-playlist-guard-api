import { z } from 'zod';

const adminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export function validateAdminUserData(payload: unknown) {
  const validation = adminUserSchema.safeParse(payload);
  const { success } = validation;

  return success ? validation.data : undefined;
}
