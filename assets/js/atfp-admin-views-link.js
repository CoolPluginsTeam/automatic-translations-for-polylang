jQuery(document).ready(function(){
    const atfpSubsubsubList = jQuery('.atfp_subsubsub');
    const atfpBulkTranslateBtn = jQuery('.atfp-bulk-translate-btn');

    if(atfpSubsubsubList.length){
        const $defaultSubsubsub = jQuery('ul.subsubsub:not(.atfp_subsubsub_list)');

        if($defaultSubsubsub.length){
            $defaultSubsubsub.after(atfpSubsubsubList);
            atfpSubsubsubList.show();
        }
    }

    if(atfpBulkTranslateBtn.length){
        const $defaultFilter = jQuery('.actions:not(.bulkactions)');

        if($defaultFilter.length){
            $defaultFilter.each(function(){
                const clone=atfpBulkTranslateBtn.clone(true);
                jQuery(this).after(clone);
                clone.show();
            });

            atfpBulkTranslateBtn.remove();
        }
    }
});
