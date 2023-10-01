const BACKEND_URL = process.env['NEXT_PUBLIC_API_URL']!;

class Bridge {
  // Testing
  ping = define_blank<string>('get', '/ping');

  // Properties
  getPropertyData = define<{ address: string }, Record<string, any>>('get', '/property/get-property-data', ['address']);
}

export const bridge = new Bridge();


export type Method = 'get' | 'post' | 'put' | 'delete';

export type Route<R, T> = { (payload: R): Promise<T> };
export type BlankRoute<T> = { (): Promise<T> };

/**
 * Defines a strongly-types request method.
 *
 * @param method HTTP verb to use for the request
 * @param path path to append to the configured API route
 * @param queryParams List of keys to be placed in the URL query instead of the body
 */
function define<R, T>(method: Method, path: string, queryParams: string[] = []): Route<R, T> {
  const url = path.startsWith('/')
    ? BACKEND_URL + path
    : BACKEND_URL + '/' + path;

  return async (data: R): Promise<T> => {
    console.debug("input data:", data);
    const params: Record<string, any> = {}
    if (typeof data == "object") {
      for (const param of queryParams) {
        // @ts-ignore
        console.debug(`adding "${param}"="${data[param]}" to query`);
        // @ts-ignore
        params[param] = data[param];
        // @ts-ignore
        delete data[param];
      }
    }
    const query = Object.keys(params).length > 0 ? formatQuery(params) : "";

    // @ts-ignore
    const dataHasKeys = typeof data == "object" && data !== null && Object.keys(data).length > 0
    let requestInit: RequestInit = dataHasKeys ? {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    } : {};

    console.debug("requestInit:", requestInit);
    console.debug("params:", params);
    console.debug(`query: ${query}`);

    const response = await fetch(url + query, {
      method,
      ...requestInit
    });

    const responseData = await response.json();
    if (response.ok) {
      return responseData;
    } else {
      throw responseData;
    }
  };
}

/**
 * Helper method for defining a request without a body.
 */
function define_blank<T>(method: Method, path: string): BlankRoute<T> {
  const route = define<undefined, T>(method, path);
  return async () => await route(undefined);
}

const formatQuery = (query: Record<string, any>): string =>
  "?" + Object.keys(query).map(key => `${key}=${query[key]}`).join("&")
