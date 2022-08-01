import { jest } from '@jest/globals';
import supertest from 'supertest';
import app from '../src/app';
// import { prisma } from '../src/database';

import { recommendationRepository } from '../src/repositories/recommendationRepository';
import { recommendationService } from '../src/services/recommendationsService';

import * as mock from './mocks/recommendation.mock';
import * as error from '../src/utils/errorUtils';

const agent = supertest.agent(app);

/* beforeAll(async () => {
  await prisma.recommendation.deleteMany({});
}); */

describe('Integration tests suite', () => {
  it('should create a recommendation', async () => {
    const response = await agent.post('/recommendations').send(mock.request);

    expect(response.statusCode).toBe(201);
  });

  it('should upvote a recommendation', async () => {
    const response = await agent.post('/recommendations/1/upvote');

    expect(response.statusCode).toBe(200);
  });
  it('should downvote a recommendation', async () => {
    const response = await agent.post('/recommendations/1/downvote');

    expect(response.statusCode).toBe(200);
  });
  it('should delete if score is less than -5', async () => {
    const request = await agent.get('/recommendations');
    const recommendations = request.body;

    const url = `/recommendations/${recommendations[1].id}/downvote`;

    await agent.post(url);
    await agent.post(url);
    await agent.post(url);
    await agent.post(url);
    await agent.post(url);
    await agent.post(url);

    const response = await agent.get(
      `/recommendations/${recommendations[1].id}`,
    );
    expect(response).toMatchObject({
      statusCode: 404,
    });
  });

  it('should get a random recommendation', async () => {
    const response = await agent.get('/recommendations/random');

    expect(response.body).toHaveProperty('id');
  });
  it('should get a recommendation by id', async () => {
    const response = await agent.get('/recommendations/1');

    expect(response.body).toHaveProperty('id');
  });
  it('should get top recommendations', async () => {
    const response = await agent.get('/recommendations/top/10');

    expect(response.body).toHaveProperty('length');
  });
  it('shoudl return all recommendations', async () => {
    const response = await agent.get('/recommendations');

    expect(response.body).toHaveProperty('length');
  });

  it('should return a 404 status code', async () => {
    const response = await agent.get('/recommendations/12345/upvote');

    expect(response.statusCode).toBe(404);
  });
  it('should return a 409 status code', async () => {
    const response = await agent.post('/recommendations').send(mock.request);

    expect(response.statusCode).toBe(409);
  });
  it('should return a 422 status code', async () => {
    const response = await agent.post('/recommendations').send({});

    expect(response.statusCode).toBe(422);
  });
});

describe('Services test suite', () => {
  it('should remove if score is less than -5', async () => {
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {
        return mock.fetched;
      });
    jest
      .spyOn(recommendationRepository, 'remove')
      .mockImplementationOnce((): any => {});

    const request = await recommendationService.downvote(5);
    expect(request).resolves;
  });

  it('should use greater than filter', async () => {
    jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.5);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => {
        return [mock.fetched];
      });
    jest.spyOn(Math, 'floor').mockImplementationOnce(() => 0);

    const request = await recommendationService.getRandom();
    expect(request).toEqual(mock.fetched);
  });
  it('should use less than or equal to filter', async () => {
    jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.8);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => {
        return [mock.fetched];
      });
    jest.spyOn(Math, 'floor').mockImplementationOnce(() => 0);

    const request = await recommendationService.getRandom();
    expect(request).toEqual(mock.fetched);
  });
});

describe('Errors test suite', () => {
  it('should throw not found` for random fetching', async () => {
    jest.spyOn(Math, 'random').mockImplementationOnce(() => 0.5);
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementation((): any => {
        return [];
      });

    try {
      await recommendationService.getRandom();
    } catch (error) {
      expect(error).toMatchObject({
        type: expect.stringMatching('not_found'),
        message: expect.any(String),
      });
    }
  });

  it('should throw `not found` for downvoting', async () => {
    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => {
        return null;
      });

    try {
      await recommendationService.downvote(1);
    } catch (error) {
      expect(error).toMatchObject({
        type: expect.stringMatching('not_found'),
        message: expect.any(String),
      });
    }
  });

  it('should return a `400` status code', async () => {
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => {
        throw { type: 'bad_request' };
      });

    const response = await agent.get('/recommendations');
    expect(response.statusCode).toBe(400);
  });

  it('should return a `not found` error object', async () => {
    const expected = error.notFoundError();
    expect(expected).toMatchObject({
      type: expect.stringMatching('not_found'),
      message: expect.any(String),
    });
  });

  it('should return a `conflict` error object', async () => {
    const expected = error.conflictError();
    expect(expected).toMatchObject({
      type: expect.stringMatching('conflict'),
      message: expect.any(String),
    });
  });

  it('should return a `wrong schema` error object', async () => {
    const expected = error.wrongSchemaError();
    expect(expected).toMatchObject({
      type: expect.stringMatching('wrong_schema'),
      message: expect.any(String),
    });
  });

  it('should return a `500` status code', async () => {
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => {
        throw new Error('Internal server error');
      });

    const response = await agent.get('/recommendations');
    expect(response.statusCode).toBe(500);
  });
});
