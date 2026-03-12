import { map, Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((response: any) => {
        if (response.data) {
          return {
            ...response,
            data: plainToInstance(this.dto, response.data, {
              excludeExtraneousValues: true,
            }),
          };
        }

        return plainToInstance(this.dto, response, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
