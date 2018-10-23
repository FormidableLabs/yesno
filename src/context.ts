import { RequestSerializer, SerializedRequestResponse } from './http-serializer';

export interface IInFlightRequest {
  startTime: number;
  requestSerializer: RequestSerializer;
}

export default class Context {
  /**
   * Completed serialized request-response objects. Used for:
   * A. Assertions
   * B. Saved to disk if in record mode
   */
  public interceptedRequestsCompleted: SerializedRequestResponse[] = [];
  /**
   * Serialized records loaded from disk.
   */
  public loadedMocks: SerializedRequestResponse[] = [];
  /**
   * Proxied requests which have not yet responded. When completed
   * the value is set to "null" but the index is preserved.
   */
  public inFlightRequests: Array<IInFlightRequest | null> = [];

  public clear() {
    this.interceptedRequestsCompleted = [];
    this.inFlightRequests = [];
    this.loadedMocks = [];
  }
}
