export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}
