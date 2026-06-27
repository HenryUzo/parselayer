import { SetMetadata } from '@nestjs/common';
import type { RequiredPermission } from '@parselayer/domain';

export const REQUIRED_PERMISSION_KEY = 'required_permission';

export function RequirePermission(permission: RequiredPermission) {
  return SetMetadata(REQUIRED_PERMISSION_KEY, permission);
}
