jQuery(document).ready(function ($) {
	$('.atfp_dismiss_notice').on('click', function (event) {
		var $this = $(this);
		var wrapper=$this.parents('.cool-feedback-notice-wrapper');
		var ajaxURL=wrapper.data('ajax-url');
		var ajaxCallback=wrapper.data('ajax-callback');
		var private=wrapper.data('nonce');
		
		$.post(ajaxURL, { 'action':ajaxCallback,'private':private }, function( data ) {
			wrapper.slideUp('fast');
		  }, "json");

	});
});