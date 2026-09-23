/**
 * Toolkit for Polylang — hub page behaviour.
 *
 * - Saves Translation Inspector / Duplicate Content Check toggles via AJAX.
 * - Locks the last enabled toggle (no alert) so both cannot be off at once.
 * - Syncs Open Translation Inspector button + card badge with the toggle.
 * - Installs/activates tools via AutoPoly's tfp_install_plugin endpoint.
 */
( function ( $ ) {
	'use strict';

	var strings = ( typeof tfpToolkitHub !== 'undefined' && tfpToolkitHub.i18n ) ? tfpToolkitHub.i18n : {};

	function setOpenInspectorButton( enabled ) {
		var $btn = $( '.tfp-open-inspector-btn' );
		var $wrap = $btn.closest( '.tfp-btn-wrap' );
		var $card = $( '.tfp-card[data-tool="inspector"]' );
		var $badge = $card.find( '.tfp-badge' );
		var $text = $btn.find( '.tfp-btn-text' );
		var openLabel = $btn.data( 'open-label' ) || 'Open Settings';
		var enableLabel = $btn.data( 'enable-label' ) || 'Enable inspector';

		if ( $btn.length ) {
			if ( enabled ) {
				$btn.removeClass( 'is-disabled tfp-enable-inspector-btn' )
					.removeAttr( 'aria-disabled' )
					.removeAttr( 'tabindex' )
					.attr( 'href', tfpToolkitHub.inspectorUrl || '#' );
				$wrap.removeClass( 'is-disabled' );
				if ( $text.length ) {
					$text.text( openLabel );
				}
			} else {
				// Clickable Enable control — not a faded disabled Open button.
				$btn.removeClass( 'is-disabled' )
					.addClass( 'tfp-enable-inspector-btn' )
					.removeAttr( 'aria-disabled' )
					.removeAttr( 'tabindex' )
					.attr( 'href', '#' );
				$wrap.removeClass( 'is-disabled' );
				if ( $text.length ) {
					$text.text( enableLabel );
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
		var $state = $row.find( '.tfp-toggle-state' );
		if ( ! $state.length ) {
			return;
		}
		$state
			.toggleClass( 'is-on', !! enabled )
			.toggleClass( 'is-off', ! enabled )
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
		var nonce = $btn.data( 'nonce' ) || ( window.tfpToolkitHub && tfpToolkitHub.installNonce ) || '';
		var redirect = $btn.data( 'redirect' ) || '';
		var originalText = $text.text();

		$msg.text( '' );
		$btn.addClass( 'tfp-ajax-busy' ).css( 'opacity', 0.7 );
		$text.text( 'activate' === action ? 'Activating…' : 'Installing…' );

		$.post( ( window.tfpToolkitHub && tfpToolkitHub.ajaxUrl ) ? tfpToolkitHub.ajaxUrl : ajaxurl, {
			action: 'tfp_install_plugin',
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
					var goTo = ( response.data && response.data.redirect ) ? response.data.redirect : redirect;
					setTimeout( function () {
						if ( goTo ) {
							window.location.href = goTo;
						} else {
							window.location.reload();
						}
					}, 600 );
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
					
	/**
	 * When a newer Toolkit Hub is active beside an older sibling plugin,
	 * that older dashboard still prints its pre-Toolkit header (no .tfp-nav).
	 * Upgrade it in place: title, shared nav, Get Support / Check Docs.
	 */
	function migrateOldHeaders() {
		var cfg = ( typeof tfpToolkitHub !== 'undefined' && tfpToolkitHub.headerMigrate )
			? tfpToolkitHub.headerMigrate
			: null;

		if ( ! cfg || ! cfg.items || ! cfg.items.length ) {
			return;
		}

		if ( document.querySelector( '.tfp-nav' ) ) {
			return;
		}

		var i18n = ( tfpToolkitHub.i18n ) ? tfpToolkitHub.i18n : {};
		var titleText = i18n.title || 'Toolkit for Polylang';
		var supportText = i18n.support || 'Get Support';
		var docsText = i18n.docs || 'Check Docs';

		var profiles = {
			switcher: [
				{
					root: '.lsdp-header-content',
					title: '.lsdp-header-title',
					actions: '.lsdp-header-actions',
					logoLink: '.lsdp-header-logo-link'
				},
				{
					root: '.lsdp-dashboard-header',
					title: '.lsdp-header-title, h1',
					actions: '.lsdp-header-actions',
					logoLink: '.lsdp-header-logo a, .lsdp-header-logo-link, a'
				}
			],
			inspector: [
				{
					root: '.dupcap-plugin-topbar-inner',
					title: '.dupcap-plugin-topbar-name',
					actions: '.dupcap-plugin-topbar-actions',
					logoLink: '.dupcap-plugin-topbar-link'
				}
			],
			autopoly: [
				{
					root: '.atfpp-dashboard-header',
					title: '.atfpp-dashboard-logo-text',
					actions: '.atfpp-dashboard-header-right',
					logoLink: '.atfpp-dashboard-logo-link, .atfpp-dashboard-header-left a'
				},
				{
					root: '.atfp-dashboard-header',
					title: '.atfp-dashboard-logo-text',
					actions: '.atfp-dashboard-header-right',
					logoLink: '.atfp-dashboard-logo-link, .atfp-dashboard-header-left a'
				}
			]
		};

		var list = profiles[ cfg.activeTool ] || [];
		var profile = null;
		var root = null;
		var p;

		for ( p = 0; p < list.length; p++ ) {
			root = document.querySelector( list[ p ].root );
			if ( root ) {
				profile = list[ p ];
				break;
			}
		}

		if ( ! profile || ! root || root.querySelector( '.tfp-nav' ) ) {
			return;
		}

		var titleEl = root.querySelector( profile.title );
		if ( titleEl ) {
			titleEl.textContent = titleText;
		}

		var logoLink = root.querySelector( profile.logoLink );
		if ( logoLink && cfg.hubUrl ) {
			logoLink.setAttribute( 'href', cfg.hubUrl );
		}

		var nav = document.createElement( 'nav' );
		nav.className = 'tfp-nav';
		nav.setAttribute( 'aria-label', 'Toolkit tools' );

		cfg.items.forEach( function ( item ) {
			var a = document.createElement( 'a' );
			a.href = item.href;
			a.textContent = item.label;
			a.className = 'tfp-nav-item';
			if ( item.here ) {
				a.className += ' active';
			} else if ( ! item.active ) {
				a.className += ' not-installed';
			}
			nav.appendChild( a );
		} );

		var actions = root.querySelector( profile.actions );
		if ( actions ) {
			root.insertBefore( nav, actions );

			actions.innerHTML = '';

			var support = document.createElement( 'a' );
			support.href = cfg.supportUrl;
			support.className = 'tfp-header-btn tfp-header-btn-support';
			support.target = '_blank';
			support.rel = 'noopener noreferrer';
			support.textContent = supportText;
			actions.appendChild( support );

			var docs = document.createElement( 'a' );
			docs.href = cfg.docsUrl;
			docs.className = 'tfp-header-btn tfp-header-btn-docs';
			docs.target = '_blank';
			docs.rel = 'noopener noreferrer';

			var icon = document.createElement( 'span' );
			icon.className = 'dashicons dashicons-media-document tfp-header-btn-icon';
			icon.setAttribute( 'aria-hidden', 'true' );
			docs.appendChild( icon );
			docs.appendChild( document.createTextNode( ' ' + docsText ) );
			actions.appendChild( docs );
		} else {
			root.appendChild( nav );
		}
	}


	migrateOldHeaders();
	syncProtectionLocks();
				} );
		} );
	}


	$( document ).on( 'click', '.tfp-enable-inspector-btn', function ( e ) {
		e.preventDefault();
		var $toggle = $( '.tfp-inspector-toggle' );
		if ( ! $toggle.length || $toggle.is( ':checked' ) || $toggle.prop( 'disabled' ) ) {
			return;
		}
		$toggle.prop( 'checked', true ).trigger( 'change' );
	} );

	bindToolToggle(
		'.tfp-inspector-toggle',
		'tfp_toggle_language_inspector',
		tfpToolkitHub.inspectorNonce,
		{
			onEnabledChange: setOpenInspectorButton,
			onText: strings.inspectorOn || 'Enabled',
			offText: strings.inspectorOff || 'Disabled'
		}
	);

	bindToolToggle(
		'.tfp-duplicate-toggle',
		'tfp_toggle_duplicate_content',
		tfpToolkitHub.nonce,
		{
			onText: strings.duplicateOn || 'Enabled',
			offText: strings.duplicateOff || 'Disabled'
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


		/**
	 * When ?tfp_focus=inspector (etc.) lands on the hub — e.g. menu click while
	 * Translation Inspector is Disabled — scroll to that Toolkit controls row,
	 * highlight it, and show a clear "Turn this on" cue until the user flips it.
	 */
	function focusControlFromQuery() {
		var params = new URLSearchParams( window.location.search );
		var control = params.get( 'tfp_focus' );
		if ( ! control || ! /^(inspector|duplicate)$/.test( control ) ) {
			return;
		}

		var $row = $( '.tfp-control-row[data-control="' + control + '"]' );
		if ( ! $row.length ) {
			return;
		}

		var $right = $row.find( '.tfp-row-right' ).first();
		$row.find( '.tfp-focus-cue' ).remove();
		var $cue = $( '<p class="tfp-focus-cue" role="status"></p>' ).text( 'Turn this on' );
		if ( $right.length ) {
			$right.prepend( $cue );
		} else {
			$row.append( $cue );
		}

		$row.addClass( 'tfp-control-focus' );

		if ( $row[0] && typeof $row[0].scrollIntoView === 'function' ) {
			$row[0].scrollIntoView( { behavior: 'smooth', block: 'center' } );
		}

		$row.find( 'input[type="checkbox"]' ).one( 'change', function () {
			$row.removeClass( 'tfp-control-focus' );
			$row.find( '.tfp-focus-cue' ).remove();
		} );
	}


	syncProtectionLocks();
	focusInstallFromQuery();
	focusControlFromQuery();
	bindHeroVideo();
} )( jQuery );
