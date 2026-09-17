jQuery(document).ready(function(){
    // The dashboard links here with a flag, so the action is only highlighted
    // for someone who just arrived from it -- not on every visit to the list.
    const atfpCameFromDashboard = new URLSearchParams(window.location.search).has('atfp_translation');

    const atfpSubsubsubList = jQuery('.atfp_subsubsub');
    const atfpBulkTranslateBtn = jQuery('.atfp-bulk-translate-btn-group');

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
                clone.css('display', 'inline-flex');

                if(atfpCameFromDashboard){
                    clone.find('.atfp-bulk-translate-btn').addClass('atfp-bulk-translate-attention-btn');
                }
            });

            atfpBulkTranslateBtn.remove();
        }
    }
});
