/**
 * ATFP Language Switcher Notice
 * Handles sidebar injection, plugin install/activate, and notice dismissal.
 */
class AtfpLanguageSwitcherNotice {

	constructor($) {
		this.$ = $;
		this.selectors = {
			notice: '#atfp-lsdp-ml-box-notice',
			target: '#ml_box .inside',
			wrapper: '.atfp-lsdp-card-wrapper',
			installBtn: '.atfp-lsdp-card-wrapper .atfp-install-plugin',
			dismissBtn: '.atfp-lsdp-card-wrapper .notice-dismiss, .atfp-lsdp-card-wrapper .atfp-dismiss-btn'
		};
	}

	init() {
		this.bindEvents();
		this.injectLsdpNotice();
	}

	bindEvents() {
		const self = this;

		this.$(document).on('click', this.selectors.installBtn, function (e) {
			self.handleInstall(e, self.$(this));
		});

		this.$(document).on('click', this.selectors.dismissBtn, function (e) {
			self.handleDismiss(e, self.$(this));
		});
	}

	injectLsdpNotice() {
		const $notice = this.$(this.selectors.notice);
		if (!$notice.length) {
			return;
		}

		const tryInject = () => {
			const $target = this.$(this.selectors.target);
			if (!$target.length) {
				return false;
			}
			$target.append($notice.show());
			return true;
		};

		if (tryInject()) {
			return;
		}

		let tries = 0;
		const timer = setInterval(() => {
			if (tryInject() || ++tries > 20) {
				clearInterval(timer);
				if (tries > 20) {
					$notice.remove();
				}
			}
		}, 500);
	}

	setButtonState($btn, $btnText, text, busy) {
		$btnText.text(text);
		$btn.toggleClass('disabled', busy).css({
			'pointer-events': busy ? 'none' : 'auto',
			'opacity': busy ? '0.7' : '1'
		});
	}

	handleInstall(e, $btn) {
		e.preventDefault();

		const $wrapper = $btn.closest(this.selectors.wrapper);
		const slug = $btn.data('slug');
		const nonce = $btn.data('nonce');
		const action = $btn.data('action') || 'install';
		const $btnText = $btn.find('.atfp-btn-text');
		const originalText = $btnText.text();
		const $msg = $wrapper.find('.atfp-install-message');

		$msg.empty();

		if (slug !== 'language-switcher-for-divi-polylang' || !nonce || typeof ajaxurl === 'undefined') {
			$msg.text('Missing required data. Please reload the page.');
			return;
		}

		this.setButtonState($btn, $btnText, action === 'activate' ? 'Activating...' : 'Installing...', true);

		this.$.post(ajaxurl, {
			action: 'atfp_install_plugin',
			slug: slug,
			plugin_action: action,
			_wpnonce: nonce
		}, (response) => {
			this.handleInstallResponse(response, action, $btn, $btnText, $msg, originalText);
		}).fail(() => {
			$msg.text('Network error. Try again.');
			this.setButtonState($btn, $btnText, originalText, false);
		});
	}

	handleInstallResponse(response, action, $btn, $btnText, $msg, originalText) {
		if (response && response.success) {
			if (action === 'install' && !(response.data && response.data.activated)) {
				$btn.data('action', 'activate');
				this.setButtonState($btn, $btnText, 'Activating...', false);
				$btn.trigger('click');
				return;
			}

			$btnText.text('Activated!');
			$btn.addClass('disabled');
			setTimeout(() => location.reload(), 1000);
			return;
		}

		let errorMessage = 'Action failed. Please try again.';
		if (response && response.data) {
			errorMessage = response.data.message || response.data.errorMessage || response.data || errorMessage;
		}
		$msg.text(errorMessage);
		this.setButtonState($btn, $btnText, originalText, false);
	}

	handleDismiss(e, $btn) {
		e.preventDefault();
		e.stopPropagation();

		const $wrapper = $btn.closest(this.selectors.wrapper);
		const nonce = $wrapper.data('nonce');
		const url = $wrapper.data('url');
		const noticeOption = $wrapper.data('notice') || 'dupcap-lsdp-notice';

		if (!nonce || !url) {
			return;
		}

		this.$(this.selectors.wrapper + '[data-notice="' + noticeOption + '"]').slideUp(200, function () {
			jQuery(this).remove();
		});

		this.$.post(url, {
			action: 'atfp_notice_dismiss',
			atfp_lsdp_dismiss: true,
			notice_option: noticeOption,
			nonce: nonce
		});
	}
}

jQuery(document).ready(function ($) {
	new AtfpLanguageSwitcherNotice($).init();
});
