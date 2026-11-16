/**
 * Gambol Builder — Form & Subscribe submissions
 *
 * Progressive enhancement for the gambol/form and gambol/subscribe blocks.
 * Their saved markup posts to `action=""` with no server handler, so this
 * module intercepts submit and posts JSON to the REST endpoint
 * gambol-builder/v1/forms/submit (see includes/forms/class-forms.php).
 *
 * Config comes from window.gambolForms (printed inline before the frontend
 * script): { restUrl, nonce, postId, forms: [ { index, type, token } ], i18n }.
 * Forms are matched to config entries by document order.
 *
 * @package GambolBuilder
 */

var FORM_SELECTOR = 'form.wp-block-gambol-form, form.wp-block-gambol-subscribe';
var HONEYPOT_NAME = 'gambol_hp';
var TIMESTAMP_NAME = 'gambol_ts';
var uid = 0;

/**
 * Get a translated string with fallback.
 *
 * @param {Object} config   Global config.
 * @param {string} key      i18n key.
 * @param {string} fallback Fallback text.
 * @return {string} Text.
 */
function t( config, key, fallback ) {
	return ( config && config.i18n && config.i18n[ key ] ) || fallback;
}

/**
 * Link unlabeled controls to their labels / give them accessible names.
 *
 * @param {HTMLFormElement} form Form element.
 * @return {void}
 */
function fixAccessibility( form ) {
	var fields = form.querySelectorAll( '.form-field' );
	Array.prototype.forEach.call( fields, function( field ) {
		var label = field.querySelector( 'label' );
		var control = field.querySelector( 'input, textarea, select' );
		if ( ! label || ! control || label.htmlFor || label.contains( control ) ) {
			return;
		}
		if ( ! control.id ) {
			uid++;
			control.id = 'gambol-form-field-' + uid + ( control.name ? '-' + control.name : '' );
		}
		label.htmlFor = control.id;
	} );

	if ( form.classList.contains( 'wp-block-gambol-subscribe' ) ) {
		var inputs = form.querySelectorAll( 'input:not([type="hidden"])' );
		Array.prototype.forEach.call( inputs, function( input ) {
			var hasLabel = input.getAttribute( 'aria-label' ) ||
				input.getAttribute( 'aria-labelledby' ) ||
				( input.labels && input.labels.length );
			if ( ! hasLabel && input.placeholder ) {
				input.setAttribute( 'aria-label', input.placeholder );
			}
		} );
	}
}

/**
 * Inject the honeypot and timestamp inputs.
 *
 * @param {HTMLFormElement} form   Form element.
 * @param {Object}          config Global config.
 * @return {void}
 */
function injectAntiSpam( form, config ) {
	if ( ! form.querySelector( '[name="' + HONEYPOT_NAME + '"]' ) ) {
		var wrap = document.createElement( 'div' );
		wrap.setAttribute( 'aria-hidden', 'true' );
		wrap.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';

		uid++;
		var hpId = 'gambol-hp-' + uid;
		var hpLabel = document.createElement( 'label' );
		hpLabel.htmlFor = hpId;
		hpLabel.textContent = t( config, 'honeypot', 'Leave this field empty' );

		var hp = document.createElement( 'input' );
		hp.type = 'text';
		hp.id = hpId;
		hp.name = HONEYPOT_NAME;
		hp.tabIndex = -1;
		hp.autocomplete = 'off';
		hp.value = '';

		wrap.appendChild( hpLabel );
		wrap.appendChild( hp );
		form.appendChild( wrap );
	}

	if ( ! form.querySelector( '[name="' + TIMESTAMP_NAME + '"]' ) ) {
		var ts = document.createElement( 'input' );
		ts.type = 'hidden';
		ts.name = TIMESTAMP_NAME;
		ts.value = String( Date.now() );
		form.appendChild( ts );
	}
}

/**
 * Get or create the aria-live status region after the form.
 *
 * @param {HTMLFormElement} form Form element.
 * @return {HTMLElement} Region.
 */
function getStatusRegion( form ) {
	var next = form.nextElementSibling;
	if ( next && next.classList.contains( 'gambol-form-status' ) ) {
		return next;
	}
	var region = document.createElement( 'div' );
	region.className = 'gambol-form-status';
	region.setAttribute( 'role', 'status' );
	region.setAttribute( 'aria-live', 'polite' );
	form.parentNode.insertBefore( region, form.nextSibling );
	return region;
}

/**
 * Show a message in the status region.
 *
 * @param {HTMLFormElement} form    Form element.
 * @param {string}          message Message text.
 * @param {string}          state   'success' | 'error' | 'pending'.
 * @return {void}
 */
function setStatus( form, message, state ) {
	var region = getStatusRegion( form );
	region.classList.remove( 'is-success', 'is-error', 'is-pending' );
	if ( state ) {
		region.classList.add( 'is-' + state );
	}
	region.textContent = message || '';
}

/**
 * Remove previous field error state.
 *
 * @param {HTMLFormElement} form Form element.
 * @return {void}
 */
function clearErrors( form ) {
	Array.prototype.forEach.call( form.querySelectorAll( '[aria-invalid="true"]' ), function( el ) {
		el.removeAttribute( 'aria-invalid' );
		var errId = el.getAttribute( 'data-gambol-error-id' );
		if ( errId ) {
			var described = ( el.getAttribute( 'aria-describedby' ) || '' )
				.split( ' ' )
				.filter( function( id ) {
					return id && id !== errId;
				} )
				.join( ' ' );
			if ( described ) {
				el.setAttribute( 'aria-describedby', described );
			} else {
				el.removeAttribute( 'aria-describedby' );
			}
			el.removeAttribute( 'data-gambol-error-id' );
		}
	} );
	Array.prototype.forEach.call( form.querySelectorAll( '.gambol-form-error' ), function( el ) {
		el.parentNode.removeChild( el );
	} );
}

/**
 * Mark fields invalid from a server errors map and focus the first one.
 *
 * @param {HTMLFormElement} form   Form element.
 * @param {Object}          errors { fieldName: message }.
 * @return {string[]} Messages that could not be attached to a field.
 */
function showFieldErrors( form, errors ) {
	var first = null;
	var unattached = [];

	Object.keys( errors ).forEach( function( name ) {
		var control = form.querySelector( '[name="' + name + '"]' );
		if ( ! control ) {
			unattached.push( errors[ name ] );
			return;
		}
		control.setAttribute( 'aria-invalid', 'true' );

		var field = control.closest( '.form-field' );
		if ( field ) {
			uid++;
			var msg = document.createElement( 'p' );
			msg.className = 'gambol-form-error';
			msg.id = 'gambol-form-error-' + uid;
			msg.textContent = errors[ name ];
			field.appendChild( msg );
			var described = control.getAttribute( 'aria-describedby' );
			control.setAttribute( 'aria-describedby', described ? described + ' ' + msg.id : msg.id );
			control.setAttribute( 'data-gambol-error-id', msg.id );
		} else {
			// Subscribe block: no field wrappers, report in the live region.
			unattached.push( errors[ name ] );
		}

		if ( ! first ) {
			first = control;
		}
	} );

	if ( first ) {
		first.focus();
	}
	return unattached;
}

/**
 * Collect the visible field values (excluding anti-spam inputs).
 *
 * @param {HTMLFormElement} form Form element.
 * @return {Object} Field map.
 */
function collectFields( form ) {
	var fields = {};
	Array.prototype.forEach.call( form.elements, function( el ) {
		if ( ! el.name || el.name === HONEYPOT_NAME || el.name === TIMESTAMP_NAME || el.disabled ) {
			return;
		}
		if ( el.type === 'submit' || el.type === 'button' || el.type === 'file' ) {
			return;
		}
		if ( ( el.type === 'checkbox' || el.type === 'radio' ) && ! el.checked ) {
			return;
		}
		fields[ el.name ] = el.value;
	} );
	return fields;
}

/**
 * Set busy state on the form and its submit button.
 *
 * @param {HTMLFormElement} form Form element.
 * @param {boolean}         busy Busy.
 * @return {void}
 */
function setBusy( form, busy ) {
	form.setAttribute( 'aria-busy', busy ? 'true' : 'false' );
	Array.prototype.forEach.call( form.querySelectorAll( 'button[type="submit"], input[type="submit"], button:not([type])' ), function( btn ) {
		btn.disabled = busy;
	} );
}

/**
 * Enhance one form.
 *
 * @param {HTMLFormElement} form   Form element.
 * @param {Object|null}     entry  Matching config entry ({ index, token }).
 * @param {Object}          config Global config.
 * @return {void}
 */
function enhanceForm( form, entry, config ) {
	if ( form.getAttribute( 'data-gambol-form-ready' ) ) {
		return;
	}
	form.setAttribute( 'data-gambol-form-ready', 'true' );

	fixAccessibility( form );
	injectAntiSpam( form, config );
	getStatusRegion( form );

	var sending = false;

	form.addEventListener( 'input', function( e ) {
		var target = e.target;
		if ( target && target.getAttribute && target.getAttribute( 'aria-invalid' ) === 'true' ) {
			target.removeAttribute( 'aria-invalid' );
		}
	} );

	form.addEventListener( 'submit', function( e ) {
		// Never let the native post to action="" happen — it has no handler.
		e.preventDefault();

		if ( sending ) {
			return;
		}

		if ( ! entry || ! config || ! config.restUrl || ! window.fetch ) {
			setStatus( form, t( config, 'unavailable', 'This form cannot be submitted right now.' ), 'error' );
			return;
		}

		clearErrors( form );

		if ( typeof form.reportValidity === 'function' && ! form.reportValidity() ) {
			return;
		}

		var tsInput = form.querySelector( '[name="' + TIMESTAMP_NAME + '"]' );
		var hpInput = form.querySelector( '[name="' + HONEYPOT_NAME + '"]' );
		var timestamp = tsInput ? parseInt( tsInput.value, 10 ) || 0 : 0;

		var payload = {
			post_id: config.postId,
			form_index: entry.index,
			token: entry.token || '',
			fields: collectFields( form ),
			hp: hpInput ? hpInput.value : '',
			timestamp: timestamp,
			elapsed: timestamp ? Math.max( 0, Date.now() - timestamp ) : 0,
		};

		var headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
		if ( config.nonce ) {
			headers[ 'X-WP-Nonce' ] = config.nonce;
		}

		sending = true;
		setBusy( form, true );
		setStatus( form, t( config, 'sending', 'Sending…' ), 'pending' );

		window.fetch( config.restUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: headers,
			body: JSON.stringify( payload ),
		} )
			.then( function( response ) {
				return response.json().then(
					function( data ) {
						return { ok: response.ok, data: data || {} };
					},
					function() {
						return { ok: false, data: {} };
					}
				);
			} )
			.then( function( result ) {
				var data = result.data;
				if ( result.ok && data.success === true ) {
					setStatus( form, data.message || '', 'success' );
					form.reset();
					return;
				}

				var extra = [];
				if ( data.errors && typeof data.errors === 'object' && Object.keys( data.errors ).length ) {
					extra = showFieldErrors( form, data.errors );
				}
				var message = data.message || t( config, 'error', 'Something went wrong. Please try again.' );
				if ( extra.length ) {
					message += ' ' + extra.join( ' ' );
				}
				setStatus( form, message, 'error' );
			} )
			.catch( function() {
				setStatus( form, t( config, 'network', 'Could not reach the server. Please check your connection and try again.' ), 'error' );
			} )
			.then( function() {
				sending = false;
				setBusy( form, false );
			} );
	} );
}

/**
 * Initialize all forms on the page.
 *
 * @return {void}
 */
export function initForms() {
	var forms = document.querySelectorAll( FORM_SELECTOR );
	if ( ! forms.length ) {
		return;
	}

	var config = window.gambolForms || null;
	var entries = ( config && Array.isArray( config.forms ) ) ? config.forms : [];

	Array.prototype.forEach.call( forms, function( form, i ) {
		var entry = null;
		for ( var j = 0; j < entries.length; j++ ) {
			if ( entries[ j ].index === i ) {
				entry = entries[ j ];
				break;
			}
		}
		// Guard against misalignment (e.g. a form rendered by a template part).
		var type = form.classList.contains( 'wp-block-gambol-subscribe' ) ? 'subscribe' : 'form';
		if ( entry && entry.type && entry.type !== type ) {
			entry = null;
		}
		enhanceForm( form, entry, config );
	} );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initForms );
} else {
	initForms();
}
