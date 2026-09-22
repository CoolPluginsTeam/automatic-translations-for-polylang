/**
 * Toolkit for Polylang — hub page behaviour.
 *
 * - Saves Translation Inspector / Duplicate Content Check toggles via AJAX.
 * - Locks the last enabled toggle (no alert) so both cannot be off at once.
 * - Syncs Open Translation Inspector button + card badge with the toggle.
 * - Installs/activates tools via AutoPoly's atfp_install_plugin endpoint.
 */
( function ( $ ) {
	'use strict';

	var strings = ( typeof tfpToolkitHub !== 'undefined' && tfpToolkitHub.i18n ) ? tfpToolkitHub.i18n : {};

	function setOpenInspectorButton( enabled ) {
		var $btn = $( '.tfp-open-inspector-btn' );
		var $wrap = $btn.closest( '.tfp-btn-wrap' );
		var $tip = $wrap.find( '.tfp-btn-tip' );
		var $card = $( '.tfp-card[data-tool="inspector"]' );
		var $badge = $card.find( '.tfp-badge' );
		var tipText = strings.inspectorDisabledCard || 'Translation Inspector is disabled. Enable it in Toolkit controls below.';

		if ( $btn.length ) {
			if ( enabled ) {
				$btn.removeClass( 'is-disabled' )
					.removeAttr( 'aria-disabled' )
					.removeAttr( 'tabindex' )
					.attr( 'href', tfpToolkitHub.inspectorUrl || '#' );
				$wrap.removeClass( 'is-disabled' );
				if ( $tip.length ) {
					$tip.prop( 'hidden', true );
				}
			} else {
				$btn.addClass( 'is-disabled' )
					.attr( 'aria-disabled', 'true' )
					.attr( 'tabindex', '-1' )
					.attr( 'href', '#' );
				$wrap.addClass( 'is-disabled' );
				if ( $tip.length ) {
					$tip.text( tipText ).prop( 'hidden', false );
				}
			}
		}

		if ( $badge.length ) {
			var activeLabel = strings.activeText || 'Active';
			var disabledLabel = tfpToolkitHub.disabledText || 'Disabled';
			$badge
				.removeClass( 'active enabled disabled installed not-installed inactive addon' )
				.addClass( enabled ? 'active' : 'disabled' );
			if ( enabled ) {
				$badge.html( '<span class="tfp-badge-dot" aria-hidden="true"></span>' + $( '<span/>' ).text( activeLabel ).html() );
			} else {
				$badge.text( disabledLabel );
			}
		}
	}

	function setControlStatus( $row, enabled, onText, offText ) {
		var $status = $row.find( '.tfp-control-status' );
		$status
			.toggleClass( 'is-on', !! enabled )
			.toggleClass( 'is-off', ! enabled )
			.find( '.tfp-control-status-text' )
			.text( enabled ? onText : offText );
	}

	/**
	 * If only one feature is still on, lock that toggle so it cannot be turned
	 * off until the other is enabled again. No browser alert.
	 */
	function syncProtectionLocks() {
		var $inspector = $( '.tfp-inspector-toggle' );
		var $duplicate = $( '.tfp-duplicate-toggle' );
		if ( ! $inspector.length || ! $duplicate.length ) {
			return;
		}

		var inspectorOn = $inspector.is( ':checked' );
		var duplicateOn = $duplicate.is( ':checked' );
		var lockMsg = strings.protectionRule || 'Both features cannot be disabled at the same time.';

		// Never leave both unlocked when one is already off.
		$inspector.prop( 'disabled', inspectorOn && ! duplicateOn );
		$duplicate.prop( 'disabled', duplicateOn && ! inspectorOn );

		$inspector.closest( '.tfp-toggle' ).toggleClass( 'is-locked', inspectorOn && ! duplicateOn );
		$duplicate.closest( '.tfp-toggle' ).toggleClass( 'is-locked', duplicateOn && ! inspectorOn );

		var $inspectorTip = $inspector.closest( '.tfp-toggle' ).find( '.tfp-toggle-tip' );
		var $duplicateTip = $duplicate.closest( '.tfp-toggle' ).find( '.tfp-toggle-tip' );

		if ( $inspectorTip.length ) {
			$inspectorTip.text( lockMsg ).prop( 'hidden', ! ( inspectorOn && ! duplicateOn ) );
		}
		if ( $duplicateTip.length ) {
			$duplicateTip.text( lockMsg ).prop( 'hidden', ! ( duplicateOn && ! inspectorOn ) );
		}

		$inspector.removeAttr( 'title' );
		$duplicate.removeAttr( 'title' );
	}

	$( document ).on( 'click', '.tfp-open-inspector-btn.is-disabled', function ( e ) {
		e.preventDefault();
	} );

	$( document ).on( 'click', '.tfp-ajax-install', function ( e ) {
		e.preventDefault();

		var $btn = $( this );
		if ( $btn.hasClass( 'tfp-ajax-busy' ) ) {
			return;
		}

		var $text = $btn.find( '.tfp-btn-text' );
		var $msg = $btn.next( '.tfp-install-message' );
		var slug = $btn.data( 'slug' );
		var action = $btn.data( 'action' ) || 'install';
		var nonce = $btn.data( 'nonce' );
		var originalText = $text.text();

		$msg.text( '' );
		$btn.addClass( 'tfp-ajax-busy' ).css( 'opacity', 0.7 );
		$text.text( 'activate' === action ? 'Activating…' : 'Installing…' );

		$.post( ajaxurl, {
			action: 'atfp_install_plugin',
			slug: slug,
			plugin_action: action,
			_wpnonce: nonce
		} )
			.done( function ( response ) {
				if ( response && response.success ) {
					if ( 'install' === action && ! ( response.data && response.data.activated ) ) {
						$btn.data( 'action', 'activate' );
						$text.text( 'Activating…' );
						$btn.trigger( 'click' );
						return;
					}

					$text.text( 'Activated!' );
					setTimeout( function () {
						window.location.reload();
					}, 1000 );
					return;
				}

				var errorMessage = 'Action failed. Please try again.';
				if ( response && response.data ) {
					errorMessage = response.data.message || response.data.errorMessage || errorMessage;
				}
				$msg.text( errorMessage );
				$text.text( originalText );
				$btn.removeClass( 'tfp-ajax-busy' ).css( 'opacity', '' );
			} )
			.fail( function () {
				$msg.text( 'Network error. Please try again.' );
				$text.text( originalText );
				$btn.removeClass( 'tfp-ajax-busy' ).css( 'opacity', '' );
			} );
	} );

	function bindToolToggle( selector, action, nonce, opts ) {
		opts = opts || {};

		$( document ).on( 'change', selector, function () {
			var $checkbox = $( this );
			var $row = $checkbox.closest( '.tfp-control-row' );
			var wanted = $checkbox.is( ':checked' );

			// Locked last-on toggle: ignore (should already be disabled).
			if ( $checkbox.prop( 'disabled' ) ) {
				$checkbox.prop( 'checked', true );
				return;
			}

			$checkbox.prop( 'disabled', true );
			$( '.tfp-inspector-toggle, .tfp-duplicate-toggle' ).prop( 'disabled', true );

			$.post( tfpToolkitHub.ajaxUrl, {
				action: action,
				nonce: nonce,
				enabled: wanted ? '1' : '0'
			} )
				.done( function ( response ) {
					if ( response && response.success ) {
						var isEnabled = !! response.data.enabled;
						$checkbox.prop( 'checked', isEnabled );
						if ( typeof opts.onEnabledChange === 'function' ) {
							opts.onEnabledChange( isEnabled );
						}
						if ( $row.length && opts.onText && opts.offText ) {
							setControlStatus( $row, isEnabled, opts.onText, opts.offText );
						}
						return;
					}
					$checkbox.prop( 'checked', ! wanted );
				} )
				.fail( function () {
					$checkbox.prop( 'checked', ! wanted );
				} )
				.always( function () {
					syncProtectionLocks();
				} );
		} );
	}

	bindToolToggle(
		'.tfp-inspector-toggle',
		'tfp_toggle_language_inspector',
		tfpToolkitHub.inspectorNonce,
		{
			onEnabledChange: setOpenInspectorButton,
			onText: strings.inspectorOn || 'Translation Inspector is enabled.',
			offText: strings.inspectorOff || 'Translation Inspector is disabled.'
		}
	);

	bindToolToggle(
		'.tfp-duplicate-toggle',
		'tfp_toggle_duplicate_content',
		tfpToolkitHub.nonce,
		{
			onText: strings.duplicateOn || 'Duplicate Content Check is enabled.',
			offText: strings.duplicateOff || 'Duplicate Content Check is disabled.'
		}
	);


	/**
	 * When header menu sends ?tfp_install=switcher (etc.), keep pulsing that
	 * card's Install/Activate button until the user clicks it.
	 */
	function focusInstallFromQuery() {
		var params = new URLSearchParams( window.location.search );
		var tool = params.get( 'tfp_install' );
		if ( ! tool || ! /^(inspector|autopoly|switcher)$/.test( tool ) ) {
			return;
		}

		var $card = $( '.tfp-card[data-tool="' + tool + '"]' );
		if ( ! $card.length ) {
			return;
		}

		var $btn = $card.find( 'a.tfp-btn' ).filter( function () {
			var $el = $( this );
			return $el.hasClass( 'dark' ) || $el.hasClass( 'tfp-ajax-install' ) || $el.hasClass( 'thickbox' );
		} ).first();

		if ( ! $btn.length ) {
			$btn = $card.find( 'a.tfp-btn' ).first();
		}
		if ( ! $btn.length ) {
			return;
		}

		$card.addClass( 'tfp-install-focus' );
		$btn.addClass( 'tfp-install-pulse' );

		if ( $btn[0] && typeof $btn[0].scrollIntoView === 'function' ) {
			$btn[0].scrollIntoView( { behavior: 'smooth', block: 'center' } );
		}

		$btn.one( 'click', function () {
			$btn.removeClass( 'tfp-install-pulse' );
			$card.removeClass( 'tfp-install-focus' );
		} );
	}


	/**
	 * Same lazy YouTube embed as AutoPoly dashboard: load iframe on click.
	 */
	function bindHeroVideo() {
		$( document ).on( 'click keydown', '.tfp-hero-video-frame', function ( e ) {
			if ( e.type === 'keydown' && e.which !== 13 && e.which !== 32 ) {
				return;
			}
			if ( e.type === 'keydown' ) {
				e.preventDefault();
			}

			var $frame = $( this );
			var $video = $frame.closest( '.tfp-hero-video' );
			var videoId = $video.data( 'video-id' );

			if ( $frame.find( 'iframe' ).length || ! videoId ) {
				return;
			}

			var $iframe = $( '<iframe></iframe>', {
				src: 'https://www.youtube.com/embed/' + encodeURIComponent( videoId ) + '?autoplay=1',
				title: $video.data( 'video-title' ) || '',
				allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
				allowfullscreen: 'allowfullscreen',
				referrerpolicy: 'strict-origin-when-cross-origin'
			} );

			$frame.empty().append( $iframe );
		} );
	}

	syncProtectionLocks();
	focusInstallFromQuery();
	bindHeroVideo();
} )( jQuery );
