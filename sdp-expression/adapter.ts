import type { Address, Agent, Expression, ExpressionAdapter, PublicSharing, HolochainLanguageDelegate, LanguageContext, AgentService } from "@perspect3vism/ad4m";
import { DNA_NICK } from "./dna";

class SdpPutAdapter implements PublicSharing {
  #agent: AgentService;
  #sdpDNA: HolochainLanguageDelegate;

  constructor(context: LanguageContext) {
    this.#agent = context.agent;
    this.#sdpDNA = context.Holochain as HolochainLanguageDelegate;
  }

  async createPublic(sdp: object): Promise<Address> {
    const orderedSdpData = Object.keys(sdp)
      .sort()
      .reduce((obj, key) => {
        obj[key] = sdp[key];
        return obj;
      }, {});
    const expression = this.#agent.createSignedExpression(orderedSdpData);
    const expressionPostData = {
      author: expression.author,
      timestamp: expression.timestamp,
      data: JSON.stringify(expression.data),
      proof: expression.proof,
    };
    const res = await this.#sdpDNA.call(
      DNA_NICK,
      "generic_expression",
      "create_expression",
      expressionPostData
    );
    return res.toString("hex");
  }
}

export default class SdpAdapter implements ExpressionAdapter {
  #sdpDNA: HolochainLanguageDelegate;

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.#sdpDNA = context.Holochain as HolochainLanguageDelegate;
    this.putAdapter = new SdpPutAdapter(context);
  }

  async get(address: Address): Promise<Expression> {
    const hash = Buffer.from(address, "hex");
    const expression = await this.#sdpDNA.call(
      DNA_NICK,
      "generic_expression",
      "get_expression_by_address",
      hash
    );
    return expression
  }
}
