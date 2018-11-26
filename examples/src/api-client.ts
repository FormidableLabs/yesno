import rp from 'request-promise';
const debug = require('debug')('yesno:example-api-client');

const API_ENDPOINT = 'http://localhost:3000/api';

interface IUser {
  id: number;
  username: string;
  password: string;
}

export async function login(username: string, password: string): Promise<string> {
  const { data } = await rp.post({
    body: {
      password,
      username,
    },
    json: true,
    uri: `${API_ENDPOINT}/login`,
  });

  return data.token;
}

export async function getCurrentUser(token: string): Promise<IUser> {
  const { data: user } = await rp.get({
    headers: {
      authorization: token,
    },
    json: true,
    uri: `${API_ENDPOINT}/me`,
  });

  return user;
}
