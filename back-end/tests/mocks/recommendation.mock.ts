import { faker } from '@faker-js/faker';

const request = {
  name: faker.name.findName(),
  youtubeLink: 'https://youtu.be/qrBz29PeqGI',
};

const fetched = {
  id: 1,
  name: faker.name.findName(),
  youtubeLink: 'https://youtu.be/qrBz29PeqGI',
  score: -6,
};

export { request, fetched };
