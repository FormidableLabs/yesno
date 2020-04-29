import { ISerializedHttp, RequestSerializer } from './http-serializer';

export interface IInFlightRequest {
  startTime: number;
  requestSerializer: RequestSerializer;
}

/**
 * Store the current execution context for YesNo by tracking requests & mocks.
 */
export default class Context {
  /**
   * Completed serialized request-response objects. Used for:
   * A. Assertions
   * B. Saved to disk if in record mode
   */
  public interceptedRequestsCompleted: ISerializedHttp[] = [];
  /**
   * Serialized records loaded from disk.
   */
  public loadedMocks: ISerializedHttp[] = [];
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
