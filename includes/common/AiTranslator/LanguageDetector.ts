class LanguageDetector {
    private supportedLanguage: Array<string> = [];

    constructor(supportedLanguage: Array<string>) {
        this.supportedLanguage = supportedLanguage;
    }

    public async Status() {
        // @ts-ignore
        const status=await window.self.ai.languageDetector.capabilities();

        if(status?.available === 'readily'){
            return true;
        }

        return false;
    }

    public async Detect(text: string) {
        // @ts-ignore
        const detector = await window.self.ai.languageDetector.create();
        
        const filterString=text.trim();

        
        const results=await detector.detect(filterString);

        
        const result=results.slice(0, 5).map(obj =>{
            if(this.supportedLanguage.includes(obj.detectedLanguage)){
                return obj.detectedLanguage;
            }
            return null;
        }).filter(Boolean);

        if(result.length > 0){
            return result[0];
        }
        
        return null;
    }
}

export default LanguageDetector;