export const mockRepository = {
  create: jest.fn().mockImplementation((object) => object),
  save: jest.fn(),
  find: jest.fn(),
};
