export interface SerializedRequestResponse {
  request: SerializedRequest;
  response: SerializedResponse;
}

export interface SerializedResponse {
  statusCode: number;
}

export interface SerializedRequest {
  method: string;
}

// tslint:disable-next-line:no-empty
export function serialize(): void {}
