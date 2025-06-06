// @ts-ignore
const isTranslatorApiAvailable = (): boolean => Boolean(window?.self?.translation || (window?.self?.ai && window?.self?.ai?.translator) || (window?.self?.ai && window?.self?.Translator));

export default isTranslatorApiAvailable;
