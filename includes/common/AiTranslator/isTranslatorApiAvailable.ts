// @ts-ignore
const isTranslatorApiAvailable = (): boolean => Boolean(window.self.translation || (window.self.ai && window.self.ai.translator));

export default isTranslatorApiAvailable;
