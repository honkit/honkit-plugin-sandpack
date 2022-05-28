import { pickLanguage } from "./browser-language";

const supportedLanguages = ["ja", "en", "es"] as const;
const languages = pickLanguage(supportedLanguages, "en");
export const t = (message: keyof typeof MESSAGES): string => {
    let message1 = MESSAGES[message];
    return message1[languages];
};
export const MESSAGES = {
    run_console: {
        ja: "実行",
        en: "Run",
        es: "Ejecutar"
    },
    clear_console: {
        ja: "ログをクリア",
        en: "Clear",
        es: "Limpiar"
    },
    exit_console: {
        ja: "終了",
        en: "Exit",
        es: "Salir"
    }
} as const;
