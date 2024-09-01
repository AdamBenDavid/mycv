import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

//discription on the testing
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  //create fake service
  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    //create a fake copy of users service
    //partial== not all methods of userService
    // fakeUsersService = {
    //   find: () => Promise.resolve([]), //make sure we get the same api exist on the real one
    //   create: (email: string, password: string) =>
    //     Promise.resolve({ id: 1, email, password } as User),
    // };

    //configuration object:
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService }, //if someone ask for copy of userService, give a value fakeUsersService
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can creat a instence of auth service', async () => {
    //making sure that the instence created:
    expect(service).toBeDefined();
  });

  it('creates new user with salted and hashed password', async () => {
    const user = await service.signup('adad@gmail.com', 'adam'); // fake info

    expect(user.password).not.toEqual('adam');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('sadad@ada.com', 'mypassword');

    const user = await service.signin('sadad@ada.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
