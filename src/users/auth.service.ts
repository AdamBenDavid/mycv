import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const ifExist = await this.userService.find(email);
    if (ifExist.length) throw new BadRequestException('Mail is already exist');
    //Encryption comes here: Hash the user password.

    //1. Generate a a salt
    const salt = randomBytes(8).toString('hex');
    //2.Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //3. Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    //4. Create a new user and save it
    const user = await this.userService.create(email, result);
    //5. return the user
    return user;
  }

  async signin(email: string, password: string) {
    //[] returns one mail and not list
    //check if there is such mail
    const [findUser] = await this.userService.find(email);
    if (!findUser) throw new NotFoundException('No such mail');

    //split by the .
    const [salt, storedHash] = findUser.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('bad password');

    return findUser;
  }
}
