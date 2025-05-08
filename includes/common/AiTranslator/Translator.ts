class Translator {
  private translator: any;
  private sourceLang: string;
  private targetLang: string;
  private targetLangLabel: string;

  constructor(sourceLang: string, targetLang: string, targetLangLabel: string) {
    this.sourceLang = sourceLang;
    this.targetLang = targetLang;
    this.targetLangLabel = targetLangLabel;
  }

  public async LanguagePairStatus() {
    // @ts-ignore
    if (!window?.self?.translation && !window?.self?.ai?.translator && !window?.self?.Translator) {
      return { error: '<span style="color: #ff4646; display: inline-block;">The Translator AI modal is currently not supported or disabled in your browser. Please enable it. For detailed instructions on how to enable the Translator AI modal in your Chrome browser, <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">click here</a>.</span>' };
    }

    const status = await this.languagePairAvality(this.sourceLang, this.targetLang);

    if (status === "after-download") {
      return { error: '<span style="color: #ff4646; display: inline-block;">Please install the <strong>' + this.targetLangLabel + ' (' + this.targetLang + ')</strong> language pack to proceed.To install the language pack, visit <strong>chrome://on-device-translation-internals</strong>. For further assistance, refer to the <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">documentation</a>.</span>' };
    }

    // Handle case for language pack unavailable
    if (status === "unavailable") {
      const message = `<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          <strong>Language Pack Unavailable:</strong>
          The required language pack for <strong>${this.targetLangLabel} (${this.targetLang})</strong> or <strong>${this.sourceLang} (${this.sourceLang})</strong> is not currently available in your browser.
          <br>
          Please check the <a href="https://developer.chrome.com/docs/ai/translator-api#supported-languages" target="_blank">list of supported languages</a> for more information.
      </span>`;
      return { error: message };
    }

    // Handle case for language pack downloadable
    if (status === "downloadable") {
      const message = `<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          The language pack for <strong>${this.targetLangLabel} (${this.targetLang})</strong> or <strong>${this.sourceLang} (${this.sourceLang})</strong> is available for download. For more help, please refer to the <a href="https://developer.chrome.com/docs/ai/translator-api#supported-languages" target="_blank">documentation to check supported languages</a>.
      </span>`;
      return { error: message };
    }

    // Handle case for language pack downloading
    if (status === "downloading") {
      const message = `<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          The language pack for <strong>${this.targetLangLabel} (${this.targetLang})</strong> or <strong>${this.sourceLang} (${this.sourceLang})</strong> is currently downloading. You can check the download progress by visiting <strong><span data-clipboard-text="chrome://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">chrome://on-device-translation-internals</span></strong> (click to copy, then paste in a new browser window to access the settings). For more help, refer to the <a href="https://developer.chrome.com/docs/ai/translator-api#supported-languages" target="_blank">documentation to check supported languages</a>.
      </span>`;
      return { error: message };
    }

    if (status !== "readily" && status !== 'available') {
      return { error: '<span style="color: #ff4646; display: inline-block;">Please ensure that the <strong>' + this.targetLangLabel + ' (' + this.targetLang + ')</strong> language pack is installed and set as a preferred language in your browser. To install the language pack, visit <strong>chrome://on-device-translation-internals</strong>. For further assistance, refer to the <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">documentation</a>.</span>' };
    }

    await this.createTranslator();
    return true;
  }

  private languagePairAvality = async (source: string, target: string) => {
    // @ts-ignore
    if (window?.self?.translation) {
      // @ts-ignore
      const status = await window?.self?.translation?.canTranslate({
        sourceLanguage: source,
        targetLanguage: target,
      });

      return status;
    }

    // @ts-ignore
    if (window?.self?.ai?.translator) {
      // @ts-ignore
      const translatorCapabilities = await window?.self?.ai?.translator?.capabilities();
      const status = await translatorCapabilities.languagePairAvailable(source, target);

      return status;
    }

    // @ts-ignore
    if (window?.self?.Translator) {
      // @ts-ignore
      const status = await window?.self?.Translator?.availability({
        sourceLanguage: source,
        targetLanguage: target,
      });

      return status;
    }

    return false;
  }

  private AITranslator = async () => {
    // @ts-ignore
    if (window?.self?.translation) {
      // @ts-ignore
      this.translator = await window.self.translation.createTranslator({
        sourceLanguage: this.sourceLang,
        targetLanguage: this.targetLang,
      });

      return this.translator;
    }

    // @ts-ignore
    if (window?.self?.ai?.translator) {
      // @ts-ignore
      this.translator = await window.self.ai.translator.create({
        sourceLanguage: this.sourceLang,
        targetLanguage: this.targetLang,
      });

      return this.translator;
    }

    // @ts-ignore
    if ("Translator" in window?.self && "create" in window?.self?.Translator) {
      // @ts-ignore
      const translator = await window.self.Translator.create({
        sourceLanguage: this.sourceLang,
        targetLanguage: this.targetLang,
      });

      return translator;
    }

    return false;
  }

  private createTranslator = async () => {
    if (!this.translator) {
      // @ts-ignore
      this.translator = await this.AITranslator();

      return { error: false };
    }
  }

  public startTranslation = async (
    text: string,
  ): Promise<string> => {

    const translatedText = await this.translator.translate(text);

    return translatedText;
  };
}

export default Translator;
