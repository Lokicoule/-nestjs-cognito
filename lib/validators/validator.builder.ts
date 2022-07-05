import { AbstractValidator } from './abstract.validator';

export class ValidatorChainBuilder {
  private _first: AbstractValidator;
  private _last: AbstractValidator;

  public get first(): AbstractValidator {
    return this._first;
  }

  public get last(): AbstractValidator {
    return this._last;
  }

  public build(): AbstractValidator {
    return this._first;
  }

  public static create(): ValidatorChainBuilder {
    return new ValidatorChainBuilder();
  }

  public static createWith(
    validator: AbstractValidator,
  ): ValidatorChainBuilder {
    return new ValidatorChainBuilder().with(validator);
  }

  public with(validator: AbstractValidator): ValidatorChainBuilder {
    if (!this._first) {
      this._first = validator;
    }
    if (this._last) {
      this._last.setNext(validator);
    }
    this._last = validator;
    return this;
  }
}
