import { select } from '@wordpress/data';
import FormatNumberCount from "../format-number-count";

const ShowStringCount = (provider, status='none', characterCount=false) => {

    if(false ===characterCount){
        characterCount = select('block-atfp/translate').getTranslationInfo().sourceCharacterCount;
    }

    const stringCount = document.querySelector(`.${provider}-translator-strings-count`);
    if(stringCount){
        stringCount.style.display = status;
        stringCount.querySelector('.totalChars').textContent = FormatNumberCount({number: characterCount});
    }
}

export default ShowStringCount;
