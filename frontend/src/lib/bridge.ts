import { BACKEND_URL } from './env';

export const ping = define<undefined, string>('get', '/ping');

export const predict = define<{
  netIncome: number,
  buildingSF: number,
  parkingSpaces: number,
  studioUnits: number,
  oneBedroomUnits: number,
  twoBedroomUnits: number,
  threeBedroomUnits: number,
}, {
  prediction: number
}>('post', '/property/predict');

export const contact = define<{
  name: string,
  email: string,
  phone: string,
  message: string
}, never>('post', '/property/contact');

type Method = 'get' | 'post';
type Route<T, R> = T extends undefined
  ? () => Promise<R>
  : (payload: T) => Promise<R>;


function define<T, R>(method: Method, path: string): Route<T, R> {
  const url = BACKEND_URL + (path.startsWith('/') ? path : '/' + path);

  const route = async (payload: T) => {
    const req: RequestInit = {
      method,
      mode: 'cors',
      ...payload !== undefined ? {
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      } : {}
    };

    const res = await fetch(url, req);

    const data = await res.json();
    if (res.ok) {
      return data as R;
    } else {
      throw new Error(`${path} responded with ${res.status}${res.statusText ? ': ' + res.statusText : ''}`);
    }
  };

  return route as Route<T, R>;
}
