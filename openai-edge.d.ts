declare module 'openai-edge' {
    import { AxiosRequestConfig, AxiosResponse } from 'axios';
  
    export class Configuration {
      constructor(config: { apiKey: string });
    }
  
    export class OpenAIApi {
      constructor(configuration: Configuration);
      createChatCompletion(options: {
        model: string;
        stream: boolean;
        messages: Array<{ role: string; content: string }>;
        max_tokens: number;
        temperature: number;
        top_p: number;
        frequency_penalty: number;
        presence_penalty: number;
      }): Promise<AxiosResponse>;
    }
  
    export function OpenAIStream(response: AxiosResponse): ReadableStream;
  
    export class StreamingTextResponse extends Response {
      constructor(stream: ReadableStream);
    }
  }