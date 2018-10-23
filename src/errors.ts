export class YesNoError extends Error {
  constructor(message: string) {
    super(`YesNo: ${message}`);
  }
}
