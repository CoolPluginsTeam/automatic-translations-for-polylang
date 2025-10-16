class LanguageDetector {
    private supportedLanguage: Array<string> = [];

    constructor(supportedLanguage: Array<string>) {
        this.supportedLanguage = supportedLanguage;
    }

    private languageDetectorApi=async()=>{
        // @ts-ignore
        if(window.self.ai?.languageDetector){
            // @ts-ignore
            return window.self.ai.languageDetector;
        }

        // @ts-ignore
        if(window.self.LanguageDetector){
            // @ts-ignore
            return window.self.LanguageDetector;
        }
        
        return false;
    }   

    public async Status() {
        const languageDetectorApi=await this.languageDetectorApi();
        
        if(languageDetectorApi){
           // @ts-ignore
            const status=window?.self?.ai?.languageDetector ? await languageDetectorApi.capabilities() : await languageDetectorApi.availability();

            if(status?.available === 'readily' || status === 'available'){
                return true;
            }
        }
        return false;
    }

    public async Detect(text: string) {

        const languageDetectorApi=await this.languageDetectorApi();
        if(languageDetectorApi){
            // @ts-ignore
            const detector = await languageDetectorApi.create();
            
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
        }
        
        return null;
    }
}

export default LanguageDetector;