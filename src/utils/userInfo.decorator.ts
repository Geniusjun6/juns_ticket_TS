import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request: ', request.user); // 먼가 많은 req 정보들이 나오지만 user 정보도 나옴 근데.. password 도 나옴.
    return request.user ? request.user : null;
  },
);
