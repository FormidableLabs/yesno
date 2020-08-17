import Context from './context';
import { YesNoError } from './errors';
import { Matcher } from './filtering/matcher';
import MockResponse from './mock-response';

export enum RuleType {
  Live = 'LIVE',
  Record = 'RECORD',
  Respond = 'RESPOND',
}

export interface IRule {
  matcher: Matcher;
  mock?: MockResponse;
  ruleType: RuleType;
}

export interface IRuleParams {
  context: Context;
  matcher: Matcher;
}

export default class Rule implements IRule {
  public matcher: Matcher;
  public mock?: MockResponse;
  public ruleType: RuleType;
  private readonly ctx: Context;

  constructor({ context, matcher = {} }: IRuleParams) {
    this.ctx = context;
    this.matcher = matcher;
    this.ruleType = RuleType.Record;
  }

  /**
   * Set the rule type to 'record'
   */
  public record(): IRule {
    const index = this.ctx.rules.length - 1;

    if (index < 0) {
      throw new YesNoError('No rules have been defined yet');
    }

    this.ctx.rules[index].ruleType = RuleType.Record;
    return this.ctx.rules[index];
  }

  /**
   * Set the rule type to 'live'
   */
  public live(): IRule {
    const index = this.ctx.rules.length - 1;

    if (index < 0) {
      throw new YesNoError('No rules have been defined yet');
    }

    this.ctx.rules[index].ruleType = RuleType.Live;
    return this.ctx.rules[index];
  }
}
