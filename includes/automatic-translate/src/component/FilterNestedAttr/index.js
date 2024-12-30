const FilterBlockNestedAttr = (idsArr, attrObj, blockAttr, callBack) => {
    /**
     * Iterates over the keys of the filter object and calls saveTranslatedAttr for each key.
     * 
     * @param {Array} idArr - The array of IDs.
     * @param {Object} filterObj - The filter object to iterate over.
     */
    const childAttr = (idArr, filterObj) => {
        Object.keys(filterObj).map(key => {
            let filterObjType = filterObj;
            filterObjType = filterObjType[key];
            const newIdArr = new Array(...idArr, key);

            callBack(newIdArr, filterObjType);
        });
    }

    /**
     * Handles the attributes that are arrays and objects by recursively calling saveTranslatedAttr.
     * 
     * @param {Array} idArr - The array of IDs.
     * @param {Array} attrFilter - The filter attribute array.
     */
    const childAttrArray = (idArr, attrFilter) => {

        const newIdArr = new Array(...idArr);
        let dynamicBlockAttr = blockAttr;

        newIdArr.forEach(key => {
            dynamicBlockAttr = dynamicBlockAttr[key];
        });

        if([null, undefined].includes(dynamicBlockAttr)) {
            return;
        }

        if (Object.getPrototypeOf(dynamicBlockAttr) === Object.prototype) {
            childAttr(idArr, attrFilter[0]);
            return;
        }
        
        if (Object.getPrototypeOf(dynamicBlockAttr) === Array.prototype) {
            dynamicBlockAttr.forEach((_, index) => {
                const nestedId = new Array();
                newIdArr.forEach(key => {
                    nestedId.push(key);
                });
                
                nestedId.push(index);
                callBack(nestedId, attrFilter[0]);
            });
        }

        if (typeof dynamicBlockAttr === 'object') {
            childAttr(idArr, attrFilter[0]);
            return;
        }
    }


    const typeCheck = () => {
        if (Object.getPrototypeOf(attrObj) === Array.prototype) {
            childAttrArray(idsArr, attrObj);
        } else if (Object.getPrototypeOf(attrObj) === Object.prototype) {
            childAttr(idsArr, attrObj);
        }
    }

    typeCheck();
}

export default FilterBlockNestedAttr;