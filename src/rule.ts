import Context from './context';
import { YesNoError } from './errors';
import { Matcher } from './filtering/matcher';
import MockResponse from './mock-response';

export enum MockMode {
  Live = 'LIVE',
  Record = 'RECORD',
  Respond = 'RESPOND',
}

export interface IRule {
  matcher: Matcher;
  mock?: MockResponse;
  mode: MockMode;
}

export interface IRuleParams {
  context: Context;
  matcher: Matcher;
}

export default class Rule implements IRule {
  public matcher: Matcher;
  public mock?: MockResponse;
  public mode: MockMode;
  private readonly ctx: Context;

  constructor({ context, matcher = {} }: IRuleParams) {
    this.ctx = context;
    this.matcher = matcher;
    this.mode = MockMode.Record;
  }

  /**
   * Set the rule mode to 'record'
   */
  public record(): IRule {
    const index = this.ctx.rules.length - 1;

    if (index < 0) {
      throw new YesNoError('No rules have been defined yet');
    }

    this.ctx.rules[index].mode = MockMode.Record;
    return this.ctx.rules[index];
  }

  /**
   * Set the rule mode to 'live'
   */
  public live(): IRule {
    const index = this.ctx.rules.length - 1;

    if (index < 0) {
      throw new YesNoError('No rules have been defined yet');
    }

    this.ctx.rules[index].mode = MockMode.Live;
    return this.ctx.rules[index];
  }
}
