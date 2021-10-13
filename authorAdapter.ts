import type { Expression, Agent, GetByAuthorAdapter, HolochainLanguageDelegate, LanguageContext } from "@perspect3vism/ad4m";
import { DNA_NAME } from "./index";
export default class GenericExpressionAuthorAdapter implements GetByAuthorAdapter {
  #dna: HolochainLanguageDelegate;

  constructor(context: LanguageContext) {
    this.#dna = context.Holochain as HolochainLanguageDelegate;
  }

  /// Get expressions authored by a given Agent/Identity
  async getByAuthor(
    author: string,
    count: number,
    page: number
  ): Promise<Expression[]> {
    //TODO: resolve did
    const res = await this.#dna.call(
      DNA_NAME,
      "generic_expression",
      "get_expression_by_author",
      { author: author, page_size: count, page_number: page }
    );
    const out = [];
    res.forEach((expression) => {
      const ad4mExpression: Expression = Object.assign(
        expression.expression_data
      );
      out.push(ad4mExpression);
    });
    return out;
  }
}
