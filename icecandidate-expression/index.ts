import type { Address, Agent, Language, HolochainLanguageDelegate, LanguageContext, Interaction} from "@perspect3vism/ad4m";
import IceCandidateAdapter from "./adapter";
import IceCandidateAuthorAdapter from "./authorAdapter";
import { DNA, DNA_NICK } from "./dna";

function interactions(expression: Address): Interaction[] {
  return [];
}

export const name = "junto-icecandidate";

export default async function create(context: LanguageContext): Promise<Language> {
  const Holochain = context.Holochain as HolochainLanguageDelegate;
  await Holochain.registerDNAs([{ file: DNA, nick: DNA_NICK }]);

  const expressionAdapter = new IceCandidateAdapter(context);
  const authorAdaptor = new IceCandidateAuthorAdapter(context);

  return {
    name,
    expressionAdapter,
    authorAdaptor,
    interactions,
  } as Language;
}
