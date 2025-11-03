// @ts-ignore

const isLanguageDetectorPaiAvailable = (): boolean => Boolean(window.ai?.languageDetector) || Boolean(window.self.LanguageDetector);

export default isLanguageDetectorPaiAvailable;