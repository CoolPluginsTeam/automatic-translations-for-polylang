import { svgIcons } from "./modal/svgIcons";

class Translator {
  private translator: any;
  private sourceLang: string;
  private targetLang: string;
  private targetLangLabel: string;
  private sourceLangLabel: string;

  constructor(sourceLang: string, targetLang: string, targetLangLabel: string, sourceLangLabel: string) {
    this.sourceLang = sourceLang;
    this.targetLang = targetLang;
    this.targetLangLabel = targetLangLabel;
    this.sourceLangLabel = sourceLangLabel;
  }

  public async LanguagePairStatus() {
    // @ts-ignore
    if (!window?.self?.translation && !window?.self?.ai?.translator && !window?.self?.Translator) {
      return { error: '<span style="color: #ff4646; display: inline-block;">The Translator AI modal is currently not supported or disabled in your browser. Please enable it. For detailed instructions on how to enable the Translator AI modal in your Chrome browser, <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">click here</a>.</span>' };
    }

    const status = await this.languagePairAvality(this.sourceLang, this.targetLang);

    // Handle case for language pack after download
    if (status === "after-download" || status === "downloadable" || status === "unavailable") {
      return { error: `<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          <h4>Installation Instructions for Language Packs:</h4>
          <ol>
              <li>
                  To proceed, please install the language pack for <strong>${this.targetLangLabel} (${this.targetLang})</strong> or <strong>${this.sourceLangLabel} (${this.sourceLang})</strong>.
              </li>
              <li>
                  After installing the language pack, add this language to your browser's system languages in Chrome settings.<br>
                  Go to <strong>Settings &gt; Languages &gt; Add languages</strong> and add <strong>${this.targetLangLabel}</strong> or <strong>${this.sourceLangLabel}</strong> to your preferred languages list & reload the page.
              </li>
              <li>
                  You can install it by visiting the following link: 
                  <strong>
                      <span data-clipboard-text="chrome://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">
                          chrome://on-device-translation-internals ${svgIcons({iconName: 'copy'})}
                      </span>
                  </strong>. Click on the URL to copy it, then open a new window and paste this URL to access the settings.
              </li>
              <li>
                  Please check if both your source <strong>(<span style="color:#2271b1">${this.sourceLang}</span>)</strong> and target <strong>(<span style="color:#2271b1">${this.targetLang}</span>)</strong> languages are available in the language packs list.
              </li>
              <li>
                  You need to install both language packs for translation to work. You can search for each language by its language code: <strong>${this.sourceLang}</strong> and <strong>${this.targetLang}</strong>.
              </li>
              <li>For more help, refer to the documentation to check <a href="https://developer.chrome.com/docs/ai/translator-api#supported-languages" target="_blank">supported languages</a>.</li>
          </ol>
      </span>`};
    }

    // Handle case for language pack downloading
    if (status === "downloading") {
      const message = `<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          <h4>Language Pack Download In Progress:</h4>
          <ol>
              <li>
                  The language pack for <strong>${this.targetLangLabel} (${this.targetLang})</strong> or <strong>${this.sourceLangLabel} (${this.sourceLang})</strong> is already being downloaded.
              </li>
              <li>
                  <strong>You do not need to start the download again.</strong> Please wait for the download to complete. Once finished, the translation feature will become available automatically.
              </li>
              <li>
                  You can check the download progress by opening:
                  <strong>
                      <span data-clipboard-text="chrome://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">
                          chrome://on-device-translation-internals ${svgIcons({iconName: 'copy'})}
                      </span>
                  </strong>
                  . Click on the URL to copy it, then open a new window and paste this URL in Chrome to view the status.
              </li>
              <li>
                  <strong>What to do next:</strong>
                  <ul style="margin-top: .5em;">
                      <li>Wait for the download to finish. The status will change to <strong>Ready</strong> or <strong>Installed</strong> in the <strong>Language Packs</strong> section.</li>
                      <li>After the language pack is installed, you may need to <strong>reload</strong> or <strong>restart</strong> your browser for the changes to take effect.</li>
                  </ul>
              </li>
              <li>
                  For more help, refer to the documentation to check <a href="https://developer.chrome.com/docs/ai/translator-api#supported-languages" target="_blank">supported languages</a>.
              </li>
          </ol>
          <div style="text-align: right;">
              <button onclick="location.reload()" class="atfpp-error-reload-btn">Reload Page</button>
          </div>
      </span>`;
      return { error: message };
    }

    if (status !== "readily" && status !== 'available') {
      return { error: `<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          <h4>Language Pack Installation Required</h4>
          <ol>
              <li>Please ensure that the language pack for <strong>${this.targetLangLabel} (${this.targetLang})</strong> or <strong>${this.sourceLangLabel} (${this.sourceLang})</strong> is installed and set as a preferred language in your browser.</li>
              <li>To install the language pack, visit <strong><span data-clipboard-text="chrome://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">chrome://on-device-translation-internals ${svgIcons({iconName: 'copy'})}</span></strong>. Click on the URL to copy it, then open a new window and paste this URL to access the settings.</li>
              <li>If you encounter any issues, please refer to the documentation to check <a href="https://developer.chrome.com/docs/ai/translator-api#supported-languages" target="_blank">supported languages</a> for further assistance.</li>
          </ol>
      </span>` };
    }

    await this.createTranslator();
    return true;
  }

  private languagePairAvality = async (source: string, target: string) => {

      try {
        // @ts-ignore
        const translator = await window.self.Translator.create({
            sourceLanguage: source,
            targetLanguage: target,
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    console.log(`Downloaded ${e.loaded * 100}%`);
                });
            },
        });

    } catch (err) { console.log('err', err) }

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
