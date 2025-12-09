declare module '*.css';
declare module '*.scss';
declare module '*.module.css';

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
