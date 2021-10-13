import type { Address, Agent, Expression, ExpressionAdapter, PublicSharing, HolochainLanguageDelegate, LanguageContext, AgentService } from "@perspect3vism/ad4m";
import { DNA_NAME } from "./index";

class GenericExpressionPutAdapter implements PublicSharing {
  #agent: AgentService;
  #genericExpressionDNA: HolochainLanguageDelegate;

  constructor(context: LanguageContext) {
    this.#agent = context.agent;
    this.#genericExpressionDNA = context.Holochain as HolochainLanguageDelegate;
  }

  async createPublic(data: object): Promise<Address> {
    const orderedData = Object.keys(data)
      .sort()
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
    const expression = this.#agent.createSignedExpression(orderedData);
    const expressionPostData = {
      author: expression.author,
      timestamp: expression.timestamp,
      data: JSON.stringify(expression.data),
      proof: expression.proof,
    };
    const res = await this.#genericExpressionDNA.call(
      DNA_NAME,
      "generic_expression",
      "create_expression",
      expressionPostData
    );
    return res.toString("hex");
  }
}

export default class GenericExpressionAdapter implements ExpressionAdapter {
  #genericExpressionDNA: HolochainLanguageDelegate;

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.#genericExpressionDNA = context.Holochain as HolochainLanguageDelegate;
    this.putAdapter = new GenericExpressionPutAdapter(context);
  }

  async get(address: Address): Promise<Expression> {
    const hash = Buffer.from(address, "hex");
    const expression = await this.#genericExpressionDNA.call(
      DNA_NAME,
      "generic_expression",
      "get_expression_by_address",
      hash
    );
    return expression
  }
}
