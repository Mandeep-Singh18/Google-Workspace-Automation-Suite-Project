declare global {
  namespace Express {
    interface User {
      id: number;
    }

    interface Request {
      user?: User; // Extend the `Request` type to include `user`
    }
  }
}

export {};