import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    if (context.getType() === 'ws') {
      const client = context.switchToWs().getClient();
      return client.data.user;
    }

    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
