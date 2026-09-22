import { Request } from 'express';

export const getHttpRoutePattern = (req: Request) => {
  if (!req.route) {
    return 'unknown';
  }

  return `${req.baseUrl}${req.route.path}`;
};
