jQuery(document).ready(function(){
    const atfpSubsubsubList = jQuery('.atfp_subsubsub');

    if(atfpSubsubsubList.length){
        const $defaultSubsubsub = jQuery('ul.subsubsub:not(.atfp_subsubsub_list)');

        if($defaultSubsubsub.length){
            $defaultSubsubsub.after(atfpSubsubsubList);
            atfpSubsubsubList.show();
        }
    }
});
