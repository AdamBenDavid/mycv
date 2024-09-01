import {
  NestInterceptor,
  CallHandler,
  Injectable,
  ExecutionContext,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  //contex: ExecutionContextHost => incoming reqeust
  //handler: CallHandler => route handler
  async intercept(contex: ExecutionContextHost, handler: CallHandler) {
    const request = contex.switchToHttp().getRequest();
    const { userId } = request.session || {}; //returns the filed userId from and object

    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentUser = user;
    }

    return handler.handle(); //continue the route and run the route handler
  }
}
