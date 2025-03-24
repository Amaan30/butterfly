// Add Node.js process global
declare namespace NodeJS {
        interface ProcessEnv {
          PORT?: string;
          MONGODB_URI: string;
          JWT_SECRET: string;
          NODE_ENV?: 'development' | 'production';
        }
      }
      
      // Add module declarations
      declare module 'express';
      declare module 'jsonwebtoken';
      declare module 'cors';
      declare module 'cookie-parser';
      declare module 'node:path';

      declare module 'express' {
        export interface Response {
          send(body: any): Response;
          json(body: any): Response;
          sendFile(path: string): Response;
          status(code: number): Response;
        }
      }