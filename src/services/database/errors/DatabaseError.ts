export class DatabaseError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }

  static isPostgrestError(error: any): boolean {
    return error?.code && typeof error.code === 'string' && error?.message;
  }

  static getErrorMessage(error: unknown): string {
    if (error instanceof DatabaseError) {
      return error.message;
    }
    
    if (this.isPostgrestError(error)) {
      return `Database error: ${error.message}`;
    }
    
    return 'An unexpected database error occurred';
  }
}