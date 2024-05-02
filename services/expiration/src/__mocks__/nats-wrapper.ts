export const natsWrapper = {
  connect: jest.fn().mockImplementation(() => Promise.resolve()),
  client: {
    publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
      callback();
    }),
    on: jest.fn(),
    close: jest.fn(),
  },
};
