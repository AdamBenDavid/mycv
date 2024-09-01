import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// ExecutionContext== works with all comunication protocols and represents the request from the user.
export const CurrentUser = createParamDecorator(
  (data: never, contex: ExecutionContext) => {
    const request = contex.switchToHttp().getRequest(); // underline request that coming

    console.log(request.session.userId);

    return request.currentUser;
  },
);
