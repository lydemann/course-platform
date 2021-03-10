import * as mock from 'jest-mock';

/**
 * uses jest to mock an instantiated/constructed class
 *
 * replaces `jest.mock('./class.ts')` and returns a fully typed mock
 *
 * @example const mock = mockInstantiatedClass(ClassToMock)
 */
export const mockInstantiatedClass = <T>(
  _class: (new (...args: any[]) => T) | ((...args: any[]) => T)
): jest.Mocked<T> => {
  // @ts-ignore
  const Mock = mock.generateFromMetadata(mock.getMetadata(_class));

  // @ts-ignore
  return new Mock();
};
