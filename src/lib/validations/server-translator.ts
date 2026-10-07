import { getLocale, getTranslations } from "next-intl/server";
import { defaultTranslator, type Translator } from "./translator";

export async function getValidationTranslator(): Promise<Translator> {
  try {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "Validation" });
    return (key, values) => {
      try {
        return t(key, values);
      } catch {
        return defaultTranslator(key, values);
      }
    };
  } catch {
    return defaultTranslator;
  }
}
