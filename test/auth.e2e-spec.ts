import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handels signup request', () => {
    const email = 'adamsssaad@getMaxListeners.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'adsasad' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'wasd@gmail.com';

    const res = await request(app.getHttpServer()) //sign up seesion
      .post('/auth/signup')
      .send({ email, password: 'adsasad' })
      .expect(201);

    const cookie = res.get('Set-Cookie'); //get access to the cookie

    const { body } = await request(app.getHttpServer()) //how to hendle the cookie as well
      .post('/auth/whoami')
      .set('Cookie', cookie) //attach the cookie to the flow up request
      .expect(200);

    expect(body.email).toEqual(email); // the email we sign in on the top of the test
  });
});
