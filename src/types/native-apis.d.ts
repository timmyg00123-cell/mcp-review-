import 'react';

declare module 'react' {
  interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
    closedby?: 'any' | 'closerequest' | 'none' | string;
  }
}

declare global {
  interface Window {
    ai?: {
      languageModel?: {
        capabilities?: () => Promise<{ available: 'readily' | 'after-download' | 'no' }>;
        create?: (options?: {
          systemPrompt?: string;
          temperature?: number;
          topK?: number;
        }) => Promise<{
          prompt: (input: string) => Promise<string>;
          promptStreaming?: (input: string) => ReadableStream<string>;
          destroy?: () => void;
        }>;
      };
      assistant?: any;
    };
  }

  interface Document {
    modelContext?: {
      registerTool: (name: string, definition: {
        description: string;
        parameters: Record<string, any>;
        handler: (params: any) => Promise<any> | any;
      }) => void;
      unregisterTool?: (name: string) => void;
    };
  }
}
