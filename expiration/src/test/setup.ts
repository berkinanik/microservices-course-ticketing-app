jest.mock('../nats-wrapper');
jest.mock('../queues');

beforeEach(async () => {
  jest.clearAllMocks();
});
