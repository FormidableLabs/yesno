import rp from 'request-promise';

export function getRequest(options: object = {}): rp.RequestPromise {
  return rp({
    method: 'GET',
    uri: 'http://localhost:3001/get',
    ...options,
  });
}

export function postRequest(options: object = {}): rp.RequestPromise {
  return rp({
    method: 'POST',
    uri: 'http://localhost:3001/post',
    ...options,
  });
}
