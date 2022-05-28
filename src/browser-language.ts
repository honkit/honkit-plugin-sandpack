/**
 * Based on https://github.com/kchapelier/in-browser-language
 */
const list = function list() {
    const navigator = window.navigator || {};
    const languages = [...navigator.languages, navigator.language];

    let results = [],
        language,
        i;

    for (i = 0; i < languages.length; i++) {
        language = languages[i];
        if (language && (language = language.replace(/-.*/, "").toLowerCase()) && results.indexOf(language) === -1) {
            results.push(language);
        }
    }

    return results;
};

export const pickLanguage = <T extends readonly string[]>(proposedLanguages: T, defaultLanguage: string): T[number] => {
    let languages = list(),
        result = null,
        i;
    for (i = 0; i < languages.length && result === null; i++) {
        if (proposedLanguages.indexOf(languages[i]) !== -1) {
            result = languages[i];
        }
    }

    if (result === null) {
        result = defaultLanguage;
    }

    return result as T[number];
};
