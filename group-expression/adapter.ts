import type { Address, Expression, ExpressionAdapter, PublicSharing, HolochainLanguageDelegate, LanguageContext, AgentService } from "@perspect3vism/ad4m";
import type { IPFS } from "ipfs-core-types";
import { name } from "./index";

const _appendBuffer = (buffer1, buffer2) => {
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};

const uint8ArrayConcat = (chunks) => {
  return chunks.reduce(_appendBuffer);
};

class GenericExpressionPutAdapter implements PublicSharing {
  #agent: AgentService;
  #genericExpressionDNA: HolochainLanguageDelegate;
  #IPFS: IPFS;

  constructor(context: LanguageContext) {
    this.#agent = context.agent;
    this.#genericExpressionDNA = context.Holochain as HolochainLanguageDelegate;
    this.#IPFS = context.IPFS;
  }

  async createPublic(groupData: object): Promise<Address> {
    if (groupData["image"]) {
      const ipfsAddress = await this.#IPFS.add({content: groupData["image"]});

      // @ts-ignore
      const ipfsHash = ipfsAddress.cid.toString();

      groupData["imageAddr"] = `ipfs://${ipfsHash}`;
      delete groupData["image"];
    }


    if (groupData["thumbnail"]) {
      const ipfsAddress = await this.#IPFS.add({content: groupData["thumbnail"]});

      // @ts-ignore
      const ipfsHash = ipfsAddress.cid.toString();

      groupData["thumbnailAddr"] = `ipfs://${ipfsHash}`;
      delete groupData["thumbnail"];
    }

    const data = JSON.stringify(groupData);
    const expression = this.#agent.createSignedExpression(data);

    const res = await this.#genericExpressionDNA.call(
      name,
      "generic_expression",
      "create_expression",
      expression
    );

    return res.toString("hex");
  }
}

export default class GenericExpressionAdapter implements ExpressionAdapter {
  #genericExpressionDNA: HolochainLanguageDelegate;
  #IPFS: IPFS;

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.#genericExpressionDNA = context.Holochain as HolochainLanguageDelegate;
    this.putAdapter = new GenericExpressionPutAdapter(context);
    this.#IPFS = context.IPFS;
  }

  async get(address: Address): Promise<Expression> {
    const hash = Buffer.from(address, "hex");
    const expression = await this.#genericExpressionDNA.call(
      name,
      "generic_expression",
      "get_expression_by_address",
      hash
    );
    return expression;
  }
}
