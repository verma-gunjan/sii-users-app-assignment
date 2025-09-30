import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { users } from 'src/mock_data/data';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermission) return true; // No permission required

    const request = context.switchToHttp().getRequest();
    const userId = Number(request.headers['authorization']);
    if (!userId) throw new ForbiddenException('Authorization header missing');

    const user = users.find(u => u.id === userId);
    if (!user) throw new ForbiddenException('User not found');

    const userPermissions = user.roles.flatMap(roleCode => {
      if (roleCode === 'ADMIN') return ['CREATE', 'VIEW', 'EDIT', 'DELETE'];
      if (roleCode === 'VIEWER') return ['VIEW'];
      return [];
    });

    if (!userPermissions.includes(requiredPermission)) {
      throw new ForbiddenException('Not allowed to perform action due to insufficient permissions.');
    }

    return true;
  }
}
