(function ($) {
	'use strict';

	var dialog = {
		init: function () {
			if ('undefined' === typeof atfpMenuSync || !atfpMenuSync.menuId) {
				return;
			}

			this.addButton();
			this.createDialog();
			this.bindEvents();
		},

		addButton: function () {
			var $saveButton = $('#save_menu_header');

			if (!$saveButton.length || $('#atfp-sync-menu-btn').length) {
				return;
			}

			$saveButton.after(
				$('<button/>', {
					type: 'button',
					id: 'atfp-sync-menu-btn',
					class: 'button button-primary',
					text: atfpMenuSync.strings.syncButton
				})
					.attr('data-menu-id', atfpMenuSync.menuId)
					.attr('data-menu-lang', atfpMenuSync.menuLang)
			);

			$('#nav-menu-header').after(
				$('<div/>', {
					id: 'atfp-sync-result',
					style: 'display:none; margin-top: 15px; clear: both;'
				})
			);
		},

		createDialog: function () {
			var $modal = $('<div/>', {
				id: 'atfp-sync-dialog',
				style: 'display:none;'
			});

			$modal.append($('<div/>', { class: 'atfp-sync-overlay' }));

			var $box = $('<div/>', { class: 'atfp-sync-modal' });
			var $header = $('<div/>', { class: 'atfp-sync-header' });
			var $headerLeft = $('<div/>', { class: 'atfp-sync-header-left' });
			var $body = $('<div/>', { class: 'atfp-sync-body' });
			var $footer = $('<div/>', { class: 'atfp-sync-footer' });
			var $status = $('<div/>', { class: 'atfp-sync-status' })
				.append($('<span/>', { class: 'atfp-sync-status-icon', 'aria-hidden': 'true' }))
				.append(
					$('<div/>')
						.append($('<strong/>', { class: 'atfp-sync-status-title' }))
						.append($('<p/>', { class: 'atfp-sync-status-text' }))
				);

			$headerLeft
				.append($('<span/>', { class: 'dashicons dashicons-translation', 'aria-hidden': 'true' }))
				.append($('<h2/>').text(atfpMenuSync.strings.selectLanguages));

			$header
				.append($headerLeft)
				.append($('<button/>', {
					type: 'button',
					class: 'atfp-sync-close',
					'aria-label': atfpMenuSync.strings.cancel,
					text: 'x'
				}));

			$body
				.append($status)
				.append(
					$('<div/>', { class: 'atfp-sync-actions' }).append(
						$('<button/>', {
							type: 'button',
							class: 'button atfp-toggle-all',
							text: atfpMenuSync.strings.selectAll
						})
					)
				)
				.append($('<div/>', { class: 'atfp-sync-error', style: 'display:none;' }))
				.append($('<div/>', { class: 'atfp-sync-languages' }));

			$footer
				.append(
					$('<div/>', { class: 'atfp-sync-footer-actions' })
						.append($('<button/>', {
							type: 'button',
							class: 'button button-primary atfp-sync-confirm',
							text: atfpMenuSync.strings.sync
						}))
						.append($('<button/>', {
							type: 'button',
							class: 'button atfp-sync-cancel',
							text: atfpMenuSync.strings.cancel
						}))
						.append($('<span/>', { class: 'atfp-sync-spinner spinner' }))
				)
				.append($('<div/>', { class: 'atfp-sync-bottom-notice' }));

			$box.append($header, $body, $footer);
			$modal.append($box);
			$('body').append($modal);

			this.$dialog = $('#atfp-sync-dialog');
			this.$error = this.$dialog.find('.atfp-sync-error');
			this.$languages = this.$dialog.find('.atfp-sync-languages');
			this.$toggleAll = this.$dialog.find('.atfp-toggle-all');
			this.$confirm = this.$dialog.find('.atfp-sync-confirm');
			this.$spinner = this.$dialog.find('.atfp-sync-spinner');
			this.$status = this.$dialog.find('.atfp-sync-status');
			this.$statusTitle = this.$dialog.find('.atfp-sync-status-title');
			this.$statusText = this.$dialog.find('.atfp-sync-status-text');
			this.$bottomNotice = this.$dialog.find('.atfp-sync-bottom-notice');

			this.populateLanguages();
		},

		populateLanguages: function () {
			var self = this;

			this.$languages.empty();

			$.each(atfpMenuSync.languages, function (index, language) {
				var labelText = language.name;

				if (language.locale) {
					labelText += ' - ' + language.locale;
				}

				var $label = $('<label/>', {
					class: 'atfp-lang-option' + (language.has_synced_menu ? ' is-synced' : ' is-unsynced')
				});

				$label
					.append($('<input/>', {
						type: 'checkbox',
						name: 'target_langs[]',
						value: language.slug
					}))
					.append($('<span/>', { class: 'atfp-lang-name' }).text(labelText));

				if (language.has_synced_menu) {
					$label.append(
						$('<span/>', {
							class: 'atfp-lang-state',
							text: atfpMenuSync.strings.synchronized
						})
					);
				}

				self.$languages.append($label);
			});
		},

		bindEvents: function () {
			var self = this;

			$(document).on('click', '#atfp-sync-menu-btn', function (event) {
				event.preventDefault();
				self.showDialog();
			});

			$(document).on('click', '.atfp-sync-close, .atfp-sync-cancel, .atfp-sync-overlay', function () {
				self.hideDialog();
			});

			$(document).on('click', '.atfp-toggle-all', function () {
				var $checkboxes = self.getCheckboxes();
				var allChecked = $checkboxes.length === $checkboxes.filter(':checked').length;

				$checkboxes.prop('checked', !allChecked);
				self.$toggleAll.text(allChecked ? atfpMenuSync.strings.selectAll : atfpMenuSync.strings.deselectAll);
			});

			$(document).on('change', '#atfp-sync-dialog input[type="checkbox"]', function () {
				self.$error.slideUp(150);
			});

			$(document).on('click', '.atfp-sync-confirm', function () {
				self.performSync();
			});

			$(document).on('keyup', function (event) {
				if ('Escape' === event.key && self.$dialog.is(':visible')) {
					self.hideDialog();
				}
			});
		},

		showDialog: function () {
			if (!$('#menu-to-edit li.menu-item').length) {
				this.showResult('error', atfpMenuSync.strings.emptyMenuError);
				return;
			}

			if (!atfpMenuSync.languages.length) {
				this.showResult('error', atfpMenuSync.strings.noTranslatedContent);
				return;
			}

			this.getCheckboxes().prop('checked', false);
			this.$toggleAll.text(atfpMenuSync.strings.selectAll);
			this.$error.hide();
			this.refreshSyncState();
			this.$dialog.fadeIn(150);
		},

		hideDialog: function () {
			this.$dialog.fadeOut(150);
			this.$error.hide();
		},

		performSync: function () {
			var self = this;
			var selectedLangs = [];

			this.getCheckboxes().filter(':checked').each(function () {
				selectedLangs.push($(this).val());
			});

			if (!selectedLangs.length) {
				this.$error.text(atfpMenuSync.strings.noLanguages).slideDown(150);
				return;
			}

			this.$error.hide();
			this.$spinner.addClass('is-active');
			this.$confirm.prop('disabled', true).text(atfpMenuSync.strings.syncing);
			$('#atfp-sync-menu-btn').prop('disabled', true);

			$.ajax({
				url: atfpMenuSync.ajaxUrl,
				type: 'POST',
				data: {
					action: 'atfp_sync_menu',
					nonce: atfpMenuSync.nonce,
					menu_id: atfpMenuSync.menuId,
					target_langs: selectedLangs
				}
			}).done(function (response) {
				if (response && response.success) {
					self.showResult('success', response.data.message, response.data.details);
					setTimeout(function () {
						window.location.reload();
					}, 1500);
					return;
				}

				self.showResult('error', self.getErrorMessage(response));
			}).fail(function (xhr) {
				var message = atfpMenuSync.strings.error;

				if (xhr && 403 === xhr.status) {
					message = atfpMenuSync.strings.permissionError;
				} else if (xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.message) {
					message = xhr.responseJSON.data.message;
				}

				self.showResult('error', message);
			}).always(function () {
				self.$spinner.removeClass('is-active');
				self.$confirm.prop('disabled', false).text(atfpMenuSync.strings.sync);
				$('#atfp-sync-menu-btn').prop('disabled', false);
				self.hideDialog();
			});
		},

		getCheckboxes: function () {
			return this.$dialog.find('input[type="checkbox"]');
		},

		refreshSyncState: function () {
			var hasLanguages = atfpMenuSync.languages.length > 0;
			var allSynced = hasLanguages && atfpMenuSync.languages.every(function (language) {
				return !!language.has_synced_menu;
			});

			this.$status
				.toggleClass('is-synced', allSynced)
				.toggleClass('is-unsynced', !allSynced);
			this.$statusTitle.text(allSynced ? atfpMenuSync.strings.alreadySyncedTitle : atfpMenuSync.strings.notSyncedTitle);
			this.$statusText.text(allSynced ? atfpMenuSync.strings.alreadySyncedText : atfpMenuSync.strings.notSyncedText);
			this.$bottomNotice
				.toggleClass('is-update', allSynced)
				.toggleClass('is-overwrite', !allSynced)
				.text(allSynced ? atfpMenuSync.strings.updateNotice : atfpMenuSync.strings.overwriteNotice);
		},

		getErrorMessage: function (response) {
			if (response && response.data && response.data.message) {
				return response.data.message;
			}

			return atfpMenuSync.strings.error;
		},

		showResult: function (type, message, details) {
			var $result = $('#atfp-sync-result');
			var $notice = $('<div/>', {
				class: 'notice ' + ('success' === type ? 'notice-success' : 'notice-error') + ' is-dismissible'
			}).append($('<p/>').text(message));

			if (details) {
				var $list = $('<ul/>');

				$.each(details, function (language, detail) {
					if (detail.synced > 0) {
						$list.append(
							$('<li/>').text(language + ': ' + detail.synced + ' items synced, ' + detail.skipped + ' items skipped')
						);
					}
				});

				$notice.append($list);
			}

			$result.empty().append($notice).slideDown(150);
		}
	};

	$(document).ready(function () {
		dialog.init();
	});
})(jQuery);
