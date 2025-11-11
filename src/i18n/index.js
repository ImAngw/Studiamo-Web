import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {fetchTranslations} from "../supabase/DBFunctions";




export async function initI18n() {
    // rileva lingua del browser (o fallback)
    const lang = navigator.language.split("-")[0] || "it";

    // recupera il JSON dal DB
    const translations = await fetchTranslations(lang);

    if (!translations) {
        console.error("Impossibile caricare le traduzioni dal DB");
        return;
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
            detection: {
                order: ["navigator", "htmlTag"],
                caches: [],
            },
            interpolation: {
                escapeValue: false,
            },
        });

    return i18n;
}