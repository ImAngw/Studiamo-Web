import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {fetchTranslations} from "../supabase/DBFunctions";




export async function initI18n() {
    // rileva lingua del browser (o fallback)
    const rawLang = navigator.language.split("-")[0];
    const lang = ["it", "en"].includes(rawLang) ? rawLang : "it";

    let translations;
    try {
        translations = await fetchTranslations(lang);
    } catch (e) {
        console.error("Errore fetch traduzioni", e);
        translations = {};
    }

    await i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            fallbackLng: "it",
            supportedLngs: ["it", "en"],
            resources: {
                [lang]: { translation: translations },
            },
            interpolation: {
                escapeValue: false,
            },
        });

    return i18n;
}