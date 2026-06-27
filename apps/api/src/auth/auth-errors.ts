import {
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

export class AuthenticationRequiredError extends UnauthorizedException {
  constructor(message = 'Authentication is required.') {
    super(message);
  }
}

export class AuthConfigurationError extends InternalServerErrorException {
  constructor(message = 'Authentication provider is not configured.') {
    super(message);
  }
}

export class OrganisationMembershipRequiredError extends ForbiddenException {
  constructor(message = 'Organisation membership is required.') {
    super(message);
  }
}

export class OrganisationContextRequiredError extends ForbiddenException {
  constructor(message = 'Organisation context could not be resolved.') {
    super(message);
  }
}

export class CrossTenantAccessError extends ForbiddenException {
  constructor(message = 'Requested resource is outside the active organisation.') {
    super(message);
  }
}

export class MissingPermissionError extends ForbiddenException {
  constructor(permission: string) {
    super(`Missing required permission: ${permission}.`);
  }
}
