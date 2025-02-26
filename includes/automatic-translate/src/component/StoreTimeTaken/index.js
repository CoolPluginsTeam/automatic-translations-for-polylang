import { select, dispatch } from "@wordpress/data";

const StoreTimeTaken = ({ prefix = false, start = false, end = false, translateStatus = false }) => {

    const timeTaken = (end - start) / 1000; // Convert milliseconds to seconds
    const data = {};

    if (prefix) {
        data.provider = prefix;
        if (start && end) {
            const oldTimeTaken = select('block-atfp/translate').getTranslationInfo().translateData[prefix]?.timeTaken || 0;
            data.timeTaken = timeTaken + oldTimeTaken;
        }

        if (translateStatus) {
            data.translateStatus = true;
        }

        dispatch('block-atfp/translate').translationInfo(data);
    }
}

export default StoreTimeTaken;