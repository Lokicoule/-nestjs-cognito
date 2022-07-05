import { memoize } from './memoize.util';

describe('memoize', () => {
  it('should memo function', () => {
    const fn = jest.fn(() => 'result');
    const memoizedFn = memoize(fn);
    expect(memoizedFn('input')).toBe('result');
    expect(memoizedFn('input')).toBe('result');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should memo function with input', () => {
    const fn = jest.fn((input: string) => `result ${input}`);
    const memoizedFn = memoize(fn);
    expect(memoizedFn('input')).toBe('result input');
    expect(memoizedFn('input')).toBe('result input');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should memo function with input and options', () => {
    const fn = jest.fn(
      (input: string, options: { foo: string }) =>
        `result ${input} ${options.foo}`,
    );
    const memoizedFn = memoize(fn);
    expect(memoizedFn('input', { foo: 'bar' })).toBe('result input bar');
    expect(memoizedFn('input', { foo: 'bar' })).toBe('result input bar');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should memo function with input and options and defaultKey', () => {
    const fn = jest.fn(
      (input: string, options: { foo: string }) =>
        `result ${input} ${options.foo}`,
    );
    const memoizedFn = memoize(fn, 'defaultKey');
    expect(memoizedFn('input', { foo: 'bar' })).toBe('result input bar');
    expect(memoizedFn('input', { foo: 'bar' })).toBe('result input bar');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
