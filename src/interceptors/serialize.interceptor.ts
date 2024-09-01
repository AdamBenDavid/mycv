import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> {
    //run something before a request is handeled
    //by the request handler
    // console.log('Before the handeler', context);

    //if you want to run a code after a request is handeled:
    return handler.handle().pipe(
      map((data: any) => {
        //run somthimng before the request sents out:
        // console.log('after handle and before sending', data);
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, //ensures thats when we turn dto to plain json exposes only the differnt properties we chose with expose in the dto
        });
      }),
    );
  }
}
