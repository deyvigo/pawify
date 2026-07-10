const mockPost = jest.fn();
const mockGet = jest.fn();
const mockPatch = jest.fn();

export const api = {
  post: mockPost,
  get: mockGet,
  patch: mockPatch,
};

export default api;
