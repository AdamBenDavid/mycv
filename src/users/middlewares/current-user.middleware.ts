import { NestMiddleware } from '@nestjs/common/interfaces';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  } // go and find express, find interface Request and add currentUser property
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);

      req.currentUser = user;
    }

    next(); //go ahead and run an
  }
}

//@ts-ignore -ignore staff
