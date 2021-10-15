import type { Address, Agent, Language, HolochainLanguageDelegate, LanguageContext, Interaction} from "@perspect3vism/ad4m";
import GenericExpressionAdapter from "./adapter";
import GenericExpressionAuthorAdapter from "./authorAdapter";
import { CONFIG, DNA } from "./dna";

function interactions(expression: Address): Interaction[] {
  return [];
}

export const LANGUAGE_NAME = CONFIG.languageName;
export const DNA_NAME = CONFIG.dnaName;

export default async function create(context: LanguageContext): Promise<Language> {
  const Holochain = context.Holochain as HolochainLanguageDelegate;
  await Holochain.registerDNAs([{ file: DNA, nick: DNA_NAME }]);

  const expressionAdapter = new GenericExpressionAdapter(context);
  const authorAdaptor = new GenericExpressionAuthorAdapter(context);

  return {
    name: LANGUAGE_NAME,
    expressionAdapter,
    authorAdaptor,
    interactions,
  } as Language;
}
