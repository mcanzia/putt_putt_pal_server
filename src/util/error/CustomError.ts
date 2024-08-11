class CustomError extends Error {
    statusCode: number;

    constructor(message?: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode || 400;
    }
}

export class NotFoundError extends CustomError {
    constructor(message = 'Not Found') {
      super(message, 404);
    }
}

export class DuplicateNameError extends CustomError {
    constructor(message = 'Duplicate Player Name') {
      super(message, 303);
    }
}

export class DuplicateColorError extends CustomError {
    constructor(message = 'Duplicate Player Color') {
      super(message, 313);
    }
}
  
export class InternalServerError extends CustomError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}

export class AuthorizationError extends CustomError {
    constructor(message : string) {
        super(message, 401);
    }
}

export class DatabaseError extends CustomError {
    constructor(message : string) {
        super(message, 400)
    }
}

export { CustomError };