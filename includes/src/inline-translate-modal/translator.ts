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

  static getBrowserType = () => {
    let type = 'Other';
    // @ts-ignore
    if (window.navigator && window.navigator.userAgentData && window.navigator.userAgentData.brands) {
      // @ts-ignore
      window.navigator.userAgentData.brands.forEach((data: any) => {
        if (data.brand === 'Google Chrome') {
          type = 'Chrome';
        } else if (data.brand === 'Microsoft Edge') {
          type = 'Edge';
        }
      });
    } else {
      if (window.navigator.userAgent.includes('Edg')) {
        type = 'Edge';
      } else if (window.hasOwnProperty('chrome')) {
        type = 'Chrome';
      }
    }

    return type;
  }

  public async LanguagePairStatus() {
    // @ts-ignore
    if (!window?.self?.translation && !window?.self?.ai?.translator && !window?.self?.Translator) {
      return { error: `<span style="color: #ff4646; display: inline-block;">The Translator AI modal is currently not supported or disabled in your browser. Please enable it. For detailed instructions on how to enable the Translator AI modal in your ${Translator.getBrowserType() === 'Edge' ? 'Edge' : 'Chrome'} browser, <a href="${Translator.getBrowserType() === 'Edge' ? 'https://learn.microsoft.com/en-us/microsoft-edge/web-platform/translator-api#bypass_language_restrictions_for_local_testing' : 'https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing'}" target="_blank">click here</a>.</span>` };
    }

    const status = await this.languagePairAvality(this.sourceLang, this.targetLang);

    // The model never finished preparing. Point at the browser component that
    // has to be healthy instead of repeating language pack steps that cannot
    // help here.
    if (status === "download-timeout") {
      const browserName = Translator.getBrowserType() === 'Edge' ? 'Edge' : 'Chrome';
      const browser = Translator.getBrowserType() === 'Edge' ? 'edge' : 'chrome';

      return {
        error: `<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          <h4>${browserName} Translation Model Could Not Be Loaded</h4>
          <p>${browserName} could not complete the download of the translation model required for <strong>${this.sourceLangLabel} (${this.sourceLang})</strong> to <strong>${this.targetLangLabel} (${this.targetLang})</strong>. Try these steps:</p>
          <ol>
              <li>Open <strong><span data-clipboard-text="${browser}://components" target="_blank" class="chrome-ai-translator-flags">${browser}://components ${svgIcons({ iconName: 'copy' })}</span></strong> in a new tab.</li>
              <li>Find <strong>Chrome TranslateKit</strong> and check its status.</li>
              <li>If the version shows <strong>0.0.0.0</strong> or an update error, click <strong>Check for update</strong>.</li>
              <li>Make sure your internet connection is working, and disable any VPN, proxy or antivirus web protection that may block the download.</li>
              <li>Reload this page and try the translation again.</li>
              <li>If ${browserName} still cannot load the translation model, choose a different translation engine.</li>
          </ol>
      </span>` };
    }

    // The browser only starts a model download from a direct click.
    if (status === "requires-user-gesture") {
      const browser = Translator.getBrowserType() === 'Edge' ? 'edge' : 'chrome';

      return {
        error: `<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          <h4>Language Model Not Ready:</h4>
          <ol>
              <li>The model for <strong>${this.targetLangLabel} (${this.targetLang})</strong> still has to be downloaded, and your browser only starts that from a direct click.</li>
              <li>Please click <strong>Translate</strong> again to start the download.</li>
              <li>If this keeps coming back, your browser is refusing the download. Check <strong><span data-clipboard-text="${browser}://components" target="_blank" class="chrome-ai-translator-flags">${browser}://components ${svgIcons({ iconName: 'copy' })}</span></strong> for <strong>Chrome TranslateKit</strong>, or pick a different translation engine.</li>
          </ol>
      </span>` };
    }

    // Handle case for language pack after download
    if (status === "after-download" || status === "downloadable" || status === "unavailable") {
      return {
        error: `<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          <h4>Installation Instructions for Language Packs:</h4>
          <ol>
              <li>
                  To proceed, please install the language pack for <strong>${this.targetLangLabel} (${this.targetLang})</strong> or <strong>${this.sourceLangLabel} (${this.sourceLang})</strong>.
              </li>
              <li>
                  After installing the language pack, add this language to your browser's system languages in ${Translator.getBrowserType() === 'Edge' ? 'Edge' : 'Chrome'} settings.<br>
                  Go to <strong>Settings &gt; Languages &gt; Add languages</strong> and add <strong>${this.targetLangLabel}</strong> or <strong>${this.sourceLangLabel}</strong> to your preferred languages list & reload the page.
              </li>
              <li>
                  You can install it by visiting the following link: 
                  <strong>
                      <span data-clipboard-text="${Translator.getBrowserType() === 'Edge' ? 'edge' : 'chrome'}://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">
                          ${Translator.getBrowserType() === 'Edge' ? 'edge' : 'chrome'}://on-device-translation-internals ${svgIcons({ iconName: 'copy' })}
                      </span>
                  </strong>. Click on the URL to copy it, then open a new window and paste this URL to access the settings.
              </li>
              <li>
                  Please check if both your source <strong>(<span style="color:#2271b1">${this.sourceLang}</span>)</strong> and target <strong>(<span style="color:#2271b1">${this.targetLang}</span>)</strong> languages are available in the language packs list.
              </li>
              <li>
                  You need to install both language packs for translation to work. You can search for each language by its language code: <strong>${this.sourceLang}</strong> and <strong>${this.targetLang}</strong>.
              </li>
              <li>For more help, refer to the documentation to check <a href="${Translator.getBrowserType() === 'Edge' ? 'https://learn.microsoft.com/en-us/microsoft-edge/web-platform/translator-api#supported-languages' : 'https://developer.chrome.com/docs/ai/translator-api#supported-languages'}" target="_blank">supported languages</a>.</li>
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
                      <span data-clipboard-text="${Translator.getBrowserType() === 'Edge' ? 'edge' : 'chrome'}://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">
                          ${Translator.getBrowserType() === 'Edge' ? 'edge' : 'chrome'}://on-device-translation-internals ${svgIcons({ iconName: 'copy' })}
                      </span>
                  </strong>
                  . Click on the URL to copy it, then open a new window and paste this URL in ${Translator.getBrowserType() === 'Edge' ? 'Edge' : 'Chrome'} to view the status.
              </li>
              <li>
                  <strong>What to do next:</strong>
                  <ul style="margin-top: .5em;">
                      <li>Wait for the download to finish. The status will change to <strong>Ready</strong> or <strong>Installed</strong> in the <strong>Language Packs</strong> section.</li>
                      <li>After the language pack is installed, you may need to <strong>reload</strong> or <strong>restart</strong> your browser for the changes to take effect.</li>
                  </ul>
              </li>
              <li>
                  For more help, refer to the documentation to check <a href="${Translator.getBrowserType() === 'Edge' ? 'https://learn.microsoft.com/en-us/microsoft-edge/web-platform/translator-api#supported-languages' : 'https://developer.chrome.com/docs/ai/translator-api#supported-languages'}" target="_blank">supported languages</a>.
              </li>
          </ol>
          <div style="text-align: right;">
              <button onclick="location.reload()" class="atfpp-error-reload-btn">Reload Page</button>
          </div>
      </span>`;
      return { error: message };
    }

    if (status !== "readily" && status !== 'available') {
      return {
        error: `<span style="color: #ff4646; margin-top: .5rem; display: inline-block;">
          <h4>Language Pack Installation Required</h4>
          <ol>
              <li>Please ensure that the language pack for <strong>${this.targetLangLabel} (${this.targetLang})</strong> or <strong>${this.sourceLangLabel} (${this.sourceLang})</strong> is installed and set as a preferred language in your browser.</li>
              <li>To install the language pack, visit <strong><span data-clipboard-text="${Translator.getBrowserType() === 'Edge' ? 'edge' : 'chrome'}://on-device-translation-internals" target="_blank" class="chrome-ai-translator-flags">${Translator.getBrowserType() === 'Edge' ? 'edge' : 'chrome'}://on-device-translation-internals ${svgIcons({ iconName: 'copy' })}</span></strong>. Click on the URL to copy it, then open a new window and paste this URL to access the settings.</li>
              <li>If you encounter any issues, please refer to the documentation to check <a href="${Translator.getBrowserType() === 'Edge' ? 'https://learn.microsoft.com/en-us/microsoft-edge/web-platform/translator-api#supported-languages' : 'https://developer.chrome.com/docs/ai/translator-api#supported-languages'}" target="_blank">supported languages</a> for further assistance.</li>
          </ol>
      </span>` };
    }

    await this.createTranslator();
    return true;
  }

  /**
   * How long Translator.create() may go silent before it counts as stalled.
   *
   * @since 1.6.1
   */
  private static CREATE_TIMEOUT_MS = 20000;

  /**
   * Outcomes already settled this page load, keyed by source and target.
   *
   * A pair the browser cannot prepare fails the same way every time, and each
   * retry paid the full create() timeout again.
   *
   * @since 1.6.1
   */
  private static pairStatusCache = new Map<string, string>();

  /**
   * Guard a call that can stay pending forever.
   *
   * Translator.create() never settles when the browser cannot fetch the model:
   * the monitor reports 0% then 100% and the promise is simply left hanging.
   * Nothing throws and nothing resolves, so the modal keeps its loading state
   * for the rest of the session.
   *
   * The clock measures silence, not total time: a real download that is still
   * reporting progress keeps resetting it, so only a genuinely stuck call is
   * cut off.
   *
   * @since 1.6.1
   */
  private static withTimeout = <T>(
    run: (keepAlive: () => void) => Promise<T>,
    ms = Translator.CREATE_TIMEOUT_MS
  ): Promise<T> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let onTimeout: (reason: Error) => void = () => { };

    const deadline = new Promise<never>((_resolve, reject) => {
      onTimeout = reject;
    });

    const keepAlive = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const error = new Error('The browser did not finish preparing the translation model.');
        error.name = 'TimeoutError';
        onTimeout(error);
      }, ms);
    };

    keepAlive();

    return Promise.race([Promise.resolve(run(keepAlive)), deadline])
      .finally(() => clearTimeout(timer));
  }

  private languagePairAvality = async (source: string, target: string) => {
    let status = "unavailable";

    // @ts-ignore
    if (window?.self?.translation) {
      // @ts-ignore
      status = await window?.self?.translation?.canTranslate({
        sourceLanguage: source,
        targetLanguage: target,
      });
    }

    // @ts-ignore
    if (window?.self?.ai?.translator) {
      // @ts-ignore
      const translatorCapabilities = await window?.self?.ai?.translator?.capabilities();
      status = await translatorCapabilities.languagePairAvailable(source, target);
    }

    // @ts-ignore
    if (window?.self?.Translator) {
      // @ts-ignore
      status = await window?.self?.Translator?.availability({
        sourceLanguage: source,
        targetLanguage: target,
      });
    }

    // @ts-ignore
    if (['unavailable', 'downloading', 'after-download', 'downloadable'].includes(status) && window?.self?.Translator) {
      const cacheKey = `${source}|${target}`;

      if (Translator.pairStatusCache.has(cacheKey)) {
        return Translator.pairStatusCache.get(cacheKey) as string;
      }

      try {
        // Guarded by the condition above, so the API is present here.
        // @ts-ignore
        const translatorApi: any = window?.self?.Translator;

        await Translator.withTimeout((keepAlive) => translatorApi.create({
          sourceLanguage: source,
          targetLanguage: target,
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              // Real progress, so the model is not stuck.
              keepAlive();
              console.log(`Downloaded ${e.loaded * 100}%`);
            });
          },
        }));

        // @ts-ignore
        status = await window?.self?.Translator?.availability({
          sourceLanguage: source,
          targetLanguage: target,
        });
      } catch (err) {
        console.warn('Translator init error:', err);

        if (err && 'TimeoutError' === (err as Error).name) {
          status = 'download-timeout';
        } else if (err && (err as Error).message && (err as Error).message.includes('Requires a user gesture')) {
          status = 'requires-user-gesture';
        }
      }

      Translator.pairStatusCache.set(cacheKey, status);
    }

    return status;
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
      // Guarded for the same reason as the availability probe: a stalled
      // create() here would freeze the translation itself.
      // @ts-ignore
      const translatorApi: any = window.self.Translator;

      const translator = await Translator.withTimeout(() => translatorApi.create({
        sourceLanguage: this.sourceLang,
        targetLanguage: this.targetLang,
      }));

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
    // Capture all leading and trailing whitespace (multiple, single, or none)
    const startWhitespace = text.match(/^\s*/)?.[0] ?? '';
    const endWhitespace = text.match(/\s*$/)?.[0] ?? '';

    // Get the main content with whitespace trimmed from both ends
    const coreText = text.slice(startWhitespace.length, text.length - endWhitespace.length);

    // If the entire string is whitespace, just return it (don't call the translator)
    if (coreText === '') {
      return text;
    }

    // Translate only the core text
    let translatedText = await this.translator.translate(coreText);

    // Restore the original leading and trailing whitespace exactly
    return `${startWhitespace}${translatedText}${endWhitespace}`;
  };
}

export default Translator;
