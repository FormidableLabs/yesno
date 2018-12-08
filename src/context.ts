import { ISerializedHttp, RequestSerializer } from './http-serializer';

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
  public interceptedRequestsCompleted: ISerializedHttp[] = [];
  /**
   * Proxied requests which have not yet responded. When completed
   * the value is set to "null" but the index is preserved.
   */
  public inFlightRequests: Array<IInFlightRequest | null> = [];

  /**
   * Serialized records loaded from disk.
   */
  private mocks: ISerializedHttp[] = [];
  /**
   * Mocks which have already been consumed.  The ordinal position of
   * each entry is a boolean that, when true, indicates the parallel
   * array entry in loadedMocks has been consumed.
   */
  private consumed: boolean[] = [];

  public clear() {
    this.interceptedRequestsCompleted = [];
    this.inFlightRequests = [];
    this.loadedMocks = [];
  }

  public get consumedMocks(): boolean[] {
    return this.consumed;
  }

  public get loadedMocks(): ISerializedHttp[] {
    return this.mocks;
  }
  public set loadedMocks(value: ISerializedHttp[]) {
    this.mocks = value;

    // reset consumed mocks
    this.consumed = [];
  }
}
