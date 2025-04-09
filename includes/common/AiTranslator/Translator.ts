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
    if (!window?.self?.translation && !window?.self?.ai?.translator) {
      return { error: '<span style="color: #ff4646; display: inline-block;">The Translator AI modal is currently not supported or disabled in your browser. Please enable it. For detailed instructions on how to enable the Translator AI modal in your Chrome browser, <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">click here</a>.</span>' };
    }

    const status=await this.languagePairAvality(this.sourceLang, this.targetLang);

    if (status === "after-download") {
      return { error: '<span style="color: #ff4646; display: inline-block;">Please install the <strong>' + this.targetLangLabel + ' (' + this.targetLang + ')</strong> language pack to proceed.To install the language pack, visit <strong>chrome://on-device-translation-internals</strong>. For further assistance, refer to the <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">documentation</a>.</span>' };
    } else if (status !== "readily") {
      return { error: '<span style="color: #ff4646; display: inline-block;">Please ensure that the <strong>' + this.targetLangLabel + ' (' + this.targetLang + ')</strong> language pack is installed and set as a preferred language in your browser. To install the language pack, visit <strong>chrome://on-device-translation-internals</strong>. For further assistance, refer to the <a href="https://developer.chrome.com/docs/ai/translator-api#bypass_language_restrictions_for_local_testing" target="_blank">documentation</a>.</span>' };
    }

    await this.createTranslator();
    return true;
  }

  private languagePairAvality=async (source: string, target: string)=>{
    // @ts-ignore
    if(window?.self?.translation){
      // @ts-ignore
      const status = await window?.self?.translation?.canTranslate({
        sourceLanguage: source,
        targetLanguage: target,
      });

      return status;
    }

    // @ts-ignore
    if(window?.self?.ai?.translator){
      // @ts-ignore
      const translatorCapabilities = await window?.self?.ai?.translator?.capabilities();
      const status = await translatorCapabilities.languagePairAvailable(source, target);

      return status;  
    }

    return false;
  }

  private AITranslator=async ()=>{
    // @ts-ignore
    if(window?.self?.translation){
      // @ts-ignore
      this.translator = await window.self.translation.createTranslator({
        sourceLanguage: this.sourceLang,
        targetLanguage: this.targetLang,
      }); 

      return this.translator;
    }

    // @ts-ignore
    if(window?.self?.ai?.translator){
      // @ts-ignore
      this.translator = await window.self.ai.translator.create({
        sourceLanguage: this.sourceLang,
        targetLanguage: this.targetLang,
      });

      return this.translator;
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
