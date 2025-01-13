// @ts-ignore
const isTranslatorApiAvailable = (): boolean => Boolean(window?.self?.translation);

export default isTranslatorApiAvailable;
