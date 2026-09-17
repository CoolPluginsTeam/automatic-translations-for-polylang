jQuery(document).ready(function ($) {
    if ($('form#string-translation .tablenav.top .alignleft.actions').length) {
        var proUrl = (typeof atfp_mlang_strings_obj !== 'undefined' && atfp_mlang_strings_obj.pro_url) ? atfp_mlang_strings_obj.pro_url : 'https://coolplugins.net/product/autopoly-ai-translation-for-polylang/';
        $('form#string-translation .tablenav.top .alignleft.actions').last().append(
            '<a class="atfp-bulk-translate-pro-btn" href="' + proUrl + '" target="_blank" style="align-items: center; background: none; border: 1px solid var(--wp-admin-theme-color,#2271b1); border-radius: 3px; box-shadow: none; color: var(--wp-admin-theme-color,#2271b1); display: inline-flex; font-size: 13px; gap: 4px; line-height: 2.15384615; min-height: 30px; padding: 0 10px; text-decoration: none;">' +
            '<span class="dashicons dashicons-lock"></span> ' +
            'AI Translate' +
            '</a>'
        );
    }
});
