/**
 * Gambol Builder — Sticky Elements
 *
 * Tracks [data-gambol-sticky="true"] elements.
 * On scroll adds/removes:
 *   - .is-sticky    — element should be fixed
 *   - .is-shrunk    — scrolled 30px past natural position
 *
 * Behaviors: 'always' | 'scroll-up' | 'scroll-down'
 *
 * @package GambolBuilder
 */

/**
 * Initialize sticky elements.
 *
 * @return {void}
 */
export function initSticky() {
	var elements = document.querySelectorAll( '[data-gambol-sticky="true"]' );
	if ( ! elements.length ) return;

	if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) return;

	var lastScrollY = window.scrollY;
	var ticking     = false;

	var stickyItems = Array.prototype.map.call( elements, function( el ) {
		var offset   = parseInt( el.dataset.stickyOffset, 10 ) || 0;
		var behavior = el.dataset.stickyBehavior || 'always';
		var rect     = el.getBoundingClientRect();
		var naturalTop = rect.top + window.scrollY;

		// Placeholder to prevent layout shift.
		var placeholder = document.createElement( 'div' );
		placeholder.style.display = 'none';
		placeholder.style.height  = rect.height + 'px';
		placeholder.setAttribute( 'aria-hidden', 'true' );
		el.parentNode.insertBefore( placeholder, el.nextSibling );

		return { el, offset, behavior, naturalTop, placeholder };
	} );

	function update() {
		var scrollY    = window.scrollY;
		var delta      = scrollY - lastScrollY;
		var scrollUp   = delta < 0;
		var scrollDown = delta > 0;

		stickyItems.forEach( function( item ) {
			var pastNatural = scrollY >= item.naturalTop - item.offset;
			var shouldStick = false;

			if ( pastNatural ) {
				if ( item.behavior === 'always' ) {
					shouldStick = true;
				} else if ( item.behavior === 'scroll-up' && scrollUp ) {
					shouldStick = true;
				} else if ( item.behavior === 'scroll-down' && scrollDown ) {
					shouldStick = true;
				}
			}

			if ( shouldStick ) {
				if ( ! item.el.classList.contains( 'is-sticky' ) ) {
					item.el.classList.add( 'is-sticky' );
					item.el.style.position = 'fixed';
					item.el.style.top      = item.offset + 'px';
					item.el.style.zIndex   = '999';
					item.placeholder.style.display = 'block';
				}
				item.el.classList.toggle( 'is-shrunk', scrollY > item.naturalTop + 30 );
			} else {
				if ( item.el.classList.contains( 'is-sticky' ) ) {
					item.el.classList.remove( 'is-sticky', 'is-shrunk' );
					item.el.style.position = '';
					item.el.style.top      = '';
					item.el.style.zIndex   = '';
					item.placeholder.style.display = 'none';
				}
			}
		} );

		lastScrollY = scrollY;
		ticking     = false;
	}

	window.addEventListener( 'scroll', function() {
		if ( ! ticking ) {
			requestAnimationFrame( update );
			ticking = true;
		}
	}, { passive: true } );

	update();
}
