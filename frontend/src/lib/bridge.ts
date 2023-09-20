const BACKEND_URL = process.env['NEXT_PUBLIC_API_URL']!;

type Method = 'get' | 'post' | 'put' | 'delete';

type Route<R, T> = { (payload: R): Promise<T> };
type BlankRoute<T> = { (): Promise<T> };

class Bridge {
  private define<R, T>(method: Method, path: string): Route<R, T> {
    const url = path.startsWith('/')
      ? BACKEND_URL + path
      : BACKEND_URL + '/' + path;

    return async (data: R): Promise<T> => {
      const requestData = data !== undefined ? {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      } : {};

      const response = await fetch(url, {
        method,
        ...requestData
      });

      const responseData = await response.json();
      if (response.ok) {
        return responseData;
      } else {
        throw responseData;
      }
    };
  }

  private define_blank<T>(method: Method, path: string): BlankRoute<T> {
    const route = this.define<undefined, T>(method, path);
    return async () => await route(undefined);
  }

  ping = this.define_blank<string>('get', '/ping');
}

export const bridge = new Bridge();
