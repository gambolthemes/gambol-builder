/**
 * Gambol Builder - Interactive blocks
 *
 * Frontend behaviour for blocks whose saved markup is interactive but which
 * previously had no script driving them:
 * - Toggle             (.wp-block-gambol-toggle)
 * - Countdown          (.wp-block-gambol-countdown)
 * - Image carousel     (.wp-block-gambol-image-carousel)
 * - Media carousel     (.wp-block-gambol-media-carousel)
 * - Testimonial carousel (.wp-block-gambol-testimonial-carousel)
 * - Video popup        (.wp-block-gambol-video-popup)
 *
 * Works against the existing saved markup only; every enhancement is applied
 * at runtime and guarded by a data-*-ready attribute so it is idempotent.
 *
 * @package GambolBuilder
 */

( function() {
	'use strict';

	var idCounter = 0;

	/**
	 * Generate a document-unique id.
	 *
	 * @param {string} prefix Id prefix.
	 * @return {string} Unique id.
	 */
	function uniqueId( prefix ) {
		var id;
		do {
			idCounter++;
			id = prefix + '-' + idCounter;
		} while ( document.getElementById( id ) );
		return id;
	}

	/**
	 * Read a boolean data attribute ("true"/"false" as saved by React).
	 *
	 * @param {HTMLElement} el       Element.
	 * @param {string}      name     Dataset key.
	 * @param {boolean}     fallback Value when the attribute is missing.
	 * @return {boolean} Parsed value.
	 */
	function dataBool( el, name, fallback ) {
		var value = el.dataset[ name ];
		if ( value === undefined || value === '' ) return fallback;
		return value !== 'false' && value !== '0';
	}

	/**
	 * Read a numeric data attribute.
	 *
	 * @param {HTMLElement} el       Element.
	 * @param {string}      name     Dataset key.
	 * @param {number}      fallback Value when missing or invalid.
	 * @return {number} Parsed value.
	 */
	function dataNum( el, name, fallback ) {
		var value = parseFloat( el.dataset[ name ] );
		return isNaN( value ) ? fallback : value;
	}

	var reducedMotionQuery = window.matchMedia ? window.matchMedia( '(prefers-reduced-motion: reduce)' ) : null;

	function prefersReducedMotion() {
		return !! ( reducedMotionQuery && reducedMotionQuery.matches );
	}

	function onReducedMotionChange( callback ) {
		if ( ! reducedMotionQuery ) return;
		if ( reducedMotionQuery.addEventListener ) {
			reducedMotionQuery.addEventListener( 'change', callback );
		} else if ( reducedMotionQuery.addListener ) {
			reducedMotionQuery.addListener( callback );
		}
	}

	var FOCUSABLE = 'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, video[controls], [tabindex]:not([tabindex="-1"])';

	// =============================================
	// VIDEO URL HELPERS (shared by popup + media carousel)
	// =============================================

	function isSafeUrl( url ) {
		return /^(https?:)?\/\//i.test( url ) || /^\/[^/]/.test( url );
	}

	function getYouTubeId( url ) {
		var match = String( url ).match( /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/ );
		return match ? match[ 1 ] : '';
	}

	function getVimeoInfo( url ) {
		var match = String( url ).match( /vimeo\.com\/(?:video\/|channels\/[^/]+\/|groups\/[^/]+\/videos\/)?(\d+)(?:\/([A-Za-z0-9]+))?/ );
		if ( ! match ) return null;
		var hash = match[ 2 ] || '';
		var hashParam = String( url ).match( /[?&]h=([A-Za-z0-9]+)/ );
		if ( hashParam ) hash = hashParam[ 1 ];
		return { id: match[ 1 ], hash: hash };
	}

	/**
	 * Build a player element for a video URL.
	 *
	 * @param {string}  url      Video URL.
	 * @param {string}  type     Saved type hint: youtube | vimeo | self.
	 * @param {boolean} autoplay Start playback immediately.
	 * @param {string}  title    Accessible title for the player.
	 * @return {HTMLElement|null} iframe or video element.
	 */
	function createPlayer( url, type, autoplay, title ) {
		if ( ! url || ! isSafeUrl( url ) ) return null;

		var ytId = getYouTubeId( url );
		var vimeo = ytId ? null : getVimeoInfo( url );
		var iframe;

		if ( ytId && type !== 'self' ) {
			iframe = document.createElement( 'iframe' );
			iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent( ytId ) +
				'?rel=0&playsinline=1&autoplay=' + ( autoplay ? '1' : '0' );
		} else if ( vimeo && type !== 'self' ) {
			iframe = document.createElement( 'iframe' );
			iframe.src = 'https://player.vimeo.com/video/' + encodeURIComponent( vimeo.id ) +
				'?dnt=1&autoplay=' + ( autoplay ? '1' : '0' ) +
				( vimeo.hash ? '&h=' + encodeURIComponent( vimeo.hash ) : '' );
		}

		if ( iframe ) {
			iframe.setAttribute( 'allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen' );
			iframe.setAttribute( 'allowfullscreen', '' );
			iframe.setAttribute( 'title', title || 'Video player' );
			return iframe;
		}

		// Self-hosted (or unrecognised provider URL treated as a file).
		var video = document.createElement( 'video' );
		video.src = url;
		video.controls = true;
		video.playsInline = true;
		video.setAttribute( 'playsinline', '' );
		video.setAttribute( 'preload', 'metadata' );
		if ( title ) video.setAttribute( 'aria-label', title );
		if ( autoplay ) {
			video.autoplay = true;
			var attempt = video.play && video.play();
			if ( attempt && attempt.catch ) attempt.catch( function() {} );
		}
		return video;
	}

	/**
	 * Stop and remove any player inside a container.
	 *
	 * @param {HTMLElement} container Container.
	 */
	function destroyPlayers( container ) {
		container.querySelectorAll( 'video' ).forEach( function( video ) {
			try {
				video.pause();
			} catch ( e ) {}
			video.removeAttribute( 'src' );
			video.load && video.load();
		} );
		container.querySelectorAll( 'iframe' ).forEach( function( iframe ) {
			iframe.src = 'about:blank';
		} );
		while ( container.firstChild ) {
			container.removeChild( container.firstChild );
		}
	}

	// =============================================
	// TOGGLE
	// =============================================

	function initToggles() {
		document.querySelectorAll( '.wp-block-gambol-toggle' ).forEach( function( toggle ) {
			if ( toggle.dataset.toggleReady ) return;

			var button = toggle.querySelector( ':scope > .wp-block-gambol-toggle__header' );
			var content = toggle.querySelector( ':scope > .wp-block-gambol-toggle__content' );
			if ( ! button || ! content ) return;

			toggle.dataset.toggleReady = 'true';

			if ( ! button.id ) button.id = uniqueId( 'gambol-toggle-header' );
			if ( ! content.id ) content.id = uniqueId( 'gambol-toggle-content' );

			button.setAttribute( 'type', 'button' );
			button.setAttribute( 'aria-controls', content.id );
			content.setAttribute( 'role', 'region' );
			content.setAttribute( 'aria-labelledby', button.id );
			// Saved markup hides closed content from AT via aria-hidden even
			// though it is visible without JS; visibility is managed below.
			content.removeAttribute( 'aria-hidden' );

			function setOpen( open ) {
				toggle.classList.toggle( 'is-open', open );
				button.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
				content.hidden = ! open;
			}

			// "Open by default" is saved as the is-open class (isOpen attribute).
			setOpen( toggle.classList.contains( 'is-open' ) );
			toggle.classList.add( 'is-ready' );

			button.addEventListener( 'click', function() {
				setOpen( ! toggle.classList.contains( 'is-open' ) );
			} );
		} );
	}

	// =============================================
	// COUNTDOWN
	// =============================================

	var COUNTDOWN_UNITS = [
		{ key: 'days', size: 86400, singular: 'day', plural: 'days' },
		{ key: 'hours', size: 3600, singular: 'hour', plural: 'hours' },
		{ key: 'minutes', size: 60, singular: 'minute', plural: 'minutes' },
		{ key: 'seconds', size: 1, singular: 'second', plural: 'seconds' },
	];

	/**
	 * Parse the saved target date. The editor's DateTimePicker saves a
	 * timezone-less local string (e.g. 2026-12-31T23:59:00), which is
	 * interpreted in the visitor's local time. Strings with Z/offset are
	 * honoured as-is.
	 *
	 * @param {string} value Saved date string.
	 * @return {number} Timestamp in ms, or NaN.
	 */
	function parseTargetDate( value ) {
		if ( ! value ) return NaN;
		var str = String( value ).trim();
		var local = str.match( /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/ );
		if ( local ) {
			return new Date(
				+local[ 1 ], +local[ 2 ] - 1, +local[ 3 ],
				+( local[ 4 ] || 0 ), +( local[ 5 ] || 0 ), +( local[ 6 ] || 0 )
			).getTime();
		}
		return Date.parse( str );
	}

	function initCountdowns() {
		document.querySelectorAll( '.wp-block-gambol-countdown[data-target-date]' ).forEach( function( root ) {
			if ( root.dataset.countdownReady ) return;

			var target = parseTargetDate( root.dataset.targetDate );
			if ( isNaN( target ) ) return;

			root.dataset.countdownReady = 'true';

			var units = [];
			COUNTDOWN_UNITS.forEach( function( unit ) {
				var el = root.querySelector( '.countdown-' + unit.key );
				if ( ! el ) return;
				var wrapper = el.closest( '.countdown-unit' );
				var labelEl = wrapper ? wrapper.querySelector( '.countdown-label' ) : null;
				units.push( {
					unit: unit,
					el: el,
					label: labelEl ? labelEl.textContent.trim() : '',
					last: null,
				} );
				el.setAttribute( 'aria-live', 'off' );
			} );
			if ( ! units.length ) return;

			// Visible digits are presentational; screen readers get a summary.
			root.querySelectorAll( '.countdown-unit, .countdown-separator' ).forEach( function( el ) {
				el.setAttribute( 'aria-hidden', 'true' );
			} );
			var summary = document.createElement( 'span' );
			summary.className = 'wp-block-gambol-countdown__sr';
			root.appendChild( summary );

			var lastSummaryMinute = null;
			var timer = null;

			// Summary always uses days/hours/minutes, independent of shown units.
			function describe( remaining ) {
				var parts = [];
				var rest = remaining;
				COUNTDOWN_UNITS.forEach( function( unit ) {
					if ( unit.size < 60 ) return; // Seconds excluded from summary.
					var value = Math.floor( rest / unit.size );
					rest -= value * unit.size;
					if ( ! value && ! parts.length ) return;
					parts.push( value + ' ' + ( value === 1 ? unit.singular : unit.plural ) );
				} );
				if ( ! parts.length ) {
					return 'Less than a minute remaining';
				}
				return parts.join( ', ' ) + ' remaining';
			}

			function tick() {
				var remaining = Math.max( 0, Math.floor( ( target - Date.now() ) / 1000 ) );
				var rest = remaining;

				// The largest shown unit absorbs any hidden larger units.
				units.forEach( function( item ) {
					var value = Math.floor( rest / item.unit.size );
					rest -= value * item.unit.size;
					var text = value < 10 ? '0' + value : String( value );
					if ( item.last !== text ) {
						item.el.textContent = text;
						item.last = text;
					}
				} );

				root.classList.toggle( 'is-urgent', remaining > 0 && remaining < 3600 );

				if ( remaining <= 0 ) {
					root.classList.add( 'is-expired' );
					root.classList.remove( 'is-urgent' );
					summary.textContent = 'Countdown ended';
					if ( timer ) {
						clearInterval( timer );
						timer = null;
					}
					root.dispatchEvent( new CustomEvent( 'gambol:countdown-expired', { bubbles: true } ) );
					return;
				}

				var minuteKey = Math.ceil( remaining / 60 );
				if ( minuteKey !== lastSummaryMinute ) {
					lastSummaryMinute = minuteKey;
					summary.textContent = describe( remaining );
				}
			}

			tick();
			if ( target > Date.now() ) {
				// Align ticks to the wall-clock second boundary.
				setTimeout( function() {
					tick();
					if ( ! root.classList.contains( 'is-expired' ) ) {
						timer = setInterval( tick, 1000 );
					}
				}, 1000 - ( Date.now() % 1000 ) );
			}
		} );
	}

	// =============================================
	// CAROUSELS (shared slider)
	// =============================================

	var CAROUSELS = [
		{
			name: 'image-carousel',
			label: 'Image carousel',
			mobileMax: 2,
		},
		{
			name: 'media-carousel',
			label: 'Media carousel',
			mobileMax: 2,
		},
		{
			name: 'testimonial-carousel',
			label: 'Testimonials',
			mobileMax: 1,
		},
	];

	var PAUSE_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
	var PLAY_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z"/></svg>';

	function initCarousels() {
		CAROUSELS.forEach( function( config ) {
			document.querySelectorAll( '.wp-block-gambol-' + config.name ).forEach( function( root ) {
				if ( root.dataset.carouselReady ) return;
				var instance = createCarousel( root, config );
				if ( instance ) root.dataset.carouselReady = 'true';
			} );
		} );
	}

	/**
	 * Create a slider for a carousel root element.
	 *
	 * @param {HTMLElement} root   Block root.
	 * @param {Object}      config Block configuration.
	 * @return {Object|null} Instance or null when markup is incomplete.
	 */
	function createCarousel( root, config ) {
		var base = 'wp-block-gambol-' + config.name;
		var cls = function( suffix ) {
			return '.' + base + '__' + suffix;
		};

		var viewport = root.querySelector( cls( 'viewport' ) );
		var track = root.querySelector( cls( 'track' ) );
		if ( ! viewport || ! track ) return null;

		var slides = Array.prototype.slice.call( track.children ).filter( function( el ) {
			return el.classList.contains( base + '__slide' );
		} );
		if ( ! slides.length ) return null;

		var prevBtn = root.querySelector( cls( 'arrow--prev' ) );
		var nextBtn = root.querySelector( cls( 'arrow--next' ) );
		var dotsWrap = root.querySelector( cls( 'dots' ) );
		var dots = dotsWrap ? Array.prototype.slice.call( dotsWrap.querySelectorAll( cls( 'dot' ) ) ) : [];
		var thumbs = Array.prototype.slice.call( root.querySelectorAll( cls( 'thumbnail' ) ) );

		var options = {
			perView: Math.max( 1, Math.round( dataNum( root, 'slidesToShow', 1 ) ) ),
			step: Math.max( 1, Math.round( dataNum( root, 'slidesToScroll', 1 ) ) ),
			autoplay: dataBool( root, 'autoplay', false ),
			speed: Math.max( 1000, dataNum( root, 'autoplaySpeed', 5000 ) ),
			loop: dataBool( root, 'infinite', true ),
			pauseOnHover: dataBool( root, 'pauseOnHover', true ),
		};

		var count = slides.length;
		var state = {
			index: 0,
			perView: 1,
			slideWidth: 0,
			gap: 0,
			maxIndex: 0,
			positions: [ 0 ],
			pauseReasons: {},
			userPaused: false,
			timer: null,
			autoplayActive: false,
		};

		// ---- Accessibility scaffolding ----
		root.setAttribute( 'role', 'region' );
		root.setAttribute( 'aria-roledescription', 'carousel' );
		if ( ! root.getAttribute( 'aria-label' ) && ! root.getAttribute( 'aria-labelledby' ) ) {
			root.setAttribute( 'aria-label', config.label );
		}
		if ( ! track.id ) track.id = uniqueId( 'gambol-carousel-track' );

		slides.forEach( function( slide, i ) {
			slide.setAttribute( 'role', 'group' );
			slide.setAttribute( 'aria-roledescription', 'slide' );
			slide.setAttribute( 'aria-label', ( i + 1 ) + ' of ' + count );
		} );

		[ prevBtn, nextBtn ].forEach( function( btn ) {
			if ( ! btn ) return;
			btn.setAttribute( 'type', 'button' );
			btn.setAttribute( 'aria-controls', track.id );
		} );
		if ( prevBtn && prevBtn.getAttribute( 'aria-label' ) === 'Previous' ) {
			prevBtn.setAttribute( 'aria-label', 'Previous slide' );
		}
		if ( nextBtn && nextBtn.getAttribute( 'aria-label' ) === 'Next' ) {
			nextBtn.setAttribute( 'aria-label', 'Next slide' );
		}

		dots.concat( thumbs ).forEach( function( btn, i ) {
			btn.setAttribute( 'type', 'button' );
			btn.setAttribute( 'aria-controls', track.id );
			if ( ! btn.getAttribute( 'aria-label' ) ) {
				btn.setAttribute( 'aria-label', 'Go to slide ' + ( ( i % count ) + 1 ) );
			}
		} );

		// Keyboard access when there are no other focusable controls.
		if ( ! prevBtn && ! nextBtn && ! dots.length && ! thumbs.length ) {
			viewport.setAttribute( 'tabindex', '0' );
		}

		root.classList.add( 'is-ready' );

		// ---- Layout ----
		function computePerView( width ) {
			var perView = options.perView;
			if ( width < 480 ) {
				perView = 1;
			} else if ( width < 768 ) {
				perView = Math.min( perView, config.mobileMax );
			}
			return Math.max( 1, Math.min( perView, count ) );
		}

		function layout() {
			var width = viewport.clientWidth;
			if ( ! width ) return;

			var trackStyle = window.getComputedStyle( track );
			var gap = parseFloat( trackStyle.columnGap );
			state.gap = isNaN( gap ) ? 0 : gap;
			state.rtl = trackStyle.direction === 'rtl';
			state.perView = computePerView( width );
			state.slideWidth = ( width - state.gap * ( state.perView - 1 ) ) / state.perView;
			state.maxIndex = Math.max( 0, count - state.perView );

			state.positions = [];
			for ( var p = 0; p < state.maxIndex; p += options.step ) {
				state.positions.push( p );
			}
			state.positions.push( state.maxIndex );

			slides.forEach( function( slide ) {
				slide.style.setProperty( 'flex', '0 0 ' + state.slideWidth + 'px', 'important' );
				slide.style.setProperty( 'max-width', state.slideWidth + 'px' );
			} );

			root.classList.toggle( 'is-static', state.maxIndex === 0 );

			track.classList.add( 'is-resizing' );
			goTo( Math.min( state.index, state.maxIndex ), true );
			// Force reflow so the jump is not animated, then restore transitions.
			void track.offsetWidth;
			track.classList.remove( 'is-resizing' );
		}

		function offsetFor( index ) {
			// In RTL the flex row starts on the right, so the track moves the other way.
			return ( state.rtl ? 1 : -1 ) * index * ( state.slideWidth + state.gap );
		}

		function setTranslate( px ) {
			track.style.transform = 'translate3d(' + px + 'px, 0, 0)';
		}

		function activePosition() {
			var active = 0;
			state.positions.forEach( function( pos, k ) {
				if ( pos <= state.index ) active = k;
			} );
			return active;
		}

		function update() {
			setTranslate( offsetFor( state.index ) );

			slides.forEach( function( slide, i ) {
				var visible = i >= state.index && i < state.index + state.perView;
				slide.classList.toggle( 'is-active', visible );
				if ( visible ) {
					slide.removeAttribute( 'aria-hidden' );
					slide.inert = false;
					slide.removeAttribute( 'inert' );
				} else {
					slide.setAttribute( 'aria-hidden', 'true' );
					slide.inert = true;
					slide.setAttribute( 'inert', '' );
				}
			} );

			var activeDot = activePosition();
			dots.forEach( function( dot, k ) {
				var exists = k < state.positions.length;
				dot.hidden = ! exists || state.maxIndex === 0;
				var current = exists && k === activeDot;
				dot.classList.toggle( 'is-active', current );
				if ( current ) {
					dot.setAttribute( 'aria-current', 'true' );
				} else {
					dot.removeAttribute( 'aria-current' );
				}
			} );

			thumbs.forEach( function( thumb, i ) {
				var current = i === state.index;
				thumb.classList.toggle( 'is-active', current );
				if ( current ) {
					thumb.setAttribute( 'aria-current', 'true' );
				} else {
					thumb.removeAttribute( 'aria-current' );
				}
			} );

			var atStart = state.index <= 0;
			var atEnd = state.index >= state.maxIndex;
			if ( prevBtn ) {
				prevBtn.hidden = state.maxIndex === 0;
				prevBtn.disabled = ! options.loop && atStart;
			}
			if ( nextBtn ) {
				nextBtn.hidden = state.maxIndex === 0;
				nextBtn.disabled = ! options.loop && atEnd;
			}
		}

		function goTo( index, silent ) {
			var target = Math.max( 0, Math.min( index, state.maxIndex ) );
			var changed = target !== state.index;
			state.index = target;
			if ( changed && ! silent ) stopInlineMedia();
			update();
		}

		function next() {
			if ( state.index >= state.maxIndex ) {
				goTo( options.loop ? 0 : state.maxIndex );
			} else {
				goTo( Math.min( state.index + options.step, state.maxIndex ) );
			}
		}

		function prev() {
			if ( state.index <= 0 ) {
				goTo( options.loop ? state.maxIndex : 0 );
			} else {
				goTo( Math.max( state.index - options.step, 0 ) );
			}
		}

		// ---- Controls ----
		if ( prevBtn ) {
			prevBtn.addEventListener( 'click', function() {
				prev();
				restartAutoplay();
			} );
		}
		if ( nextBtn ) {
			nextBtn.addEventListener( 'click', function() {
				next();
				restartAutoplay();
			} );
		}
		dots.forEach( function( dot, k ) {
			dot.addEventListener( 'click', function() {
				var pos = state.positions[ k ];
				if ( pos === undefined ) return;
				goTo( pos );
				restartAutoplay();
			} );
		} );
		thumbs.forEach( function( thumb, i ) {
			thumb.addEventListener( 'click', function() {
				goTo( i );
				restartAutoplay();
			} );
		} );

		root.addEventListener( 'keydown', function( event ) {
			if ( event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey ) return;
			var tag = event.target && event.target.tagName;
			if ( tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || ( event.target && event.target.isContentEditable ) ) return;
			if ( event.target && event.target.closest && event.target.closest( 'video, iframe' ) ) return;
			if ( event.key === 'ArrowLeft' || event.key === 'Left' ) {
				event.preventDefault();
				state.rtl ? next() : prev();
			} else if ( event.key === 'ArrowRight' || event.key === 'Right' ) {
				event.preventDefault();
				state.rtl ? prev() : next();
			} else {
				return;
			}
			restartAutoplay();
		} );

		// ---- Swipe (pointer events) ----
		var drag = null;
		var suppressClick = false;

		viewport.addEventListener( 'pointerdown', function( event ) {
			if ( state.maxIndex === 0 ) return;
			if ( event.pointerType === 'mouse' && event.button !== 0 ) return;
			if ( event.target.closest( 'video, iframe, ' + cls( 'play' ) ) ) return;
			drag = {
				id: event.pointerId,
				startX: event.clientX,
				startY: event.clientY,
				dx: 0,
				active: false,
			};
		} );

		viewport.addEventListener( 'pointermove', function( event ) {
			if ( ! drag || event.pointerId !== drag.id ) return;
			var dx = event.clientX - drag.startX;
			var dy = event.clientY - drag.startY;
			if ( ! drag.active ) {
				if ( Math.abs( dx ) < 6 ) return;
				if ( Math.abs( dy ) > Math.abs( dx ) ) {
					drag = null; // Vertical scroll gesture.
					return;
				}
				drag.active = true;
				track.classList.add( 'is-dragging' );
				try {
					viewport.setPointerCapture( event.pointerId );
				} catch ( e ) {}
				setPause( 'drag', true );
			}
			drag.dx = dx;
			// Work in "forward" space (positive = towards later slides), then map to px.
			var sign = state.rtl ? 1 : -1;
			var forward = state.index * ( state.slideWidth + state.gap ) + sign * dx;
			var maxForward = state.maxIndex * ( state.slideWidth + state.gap );
			// Resist dragging beyond the ends.
			if ( forward < 0 ) forward = forward / 3;
			if ( forward > maxForward ) forward = maxForward + ( forward - maxForward ) / 3;
			setTranslate( sign * forward );
		} );

		function endDrag( event ) {
			if ( ! drag || event.pointerId !== drag.id ) return;
			var wasActive = drag.active;
			var dx = drag.dx;
			drag = null;
			if ( ! wasActive ) return;
			track.classList.remove( 'is-dragging' );
			try {
				viewport.releasePointerCapture( event.pointerId );
			} catch ( e ) {}
			suppressClick = true;
			setTimeout( function() {
				suppressClick = false;
			}, 0 );
			var threshold = Math.min( 60, state.slideWidth * 0.2 );
			if ( event.type !== 'pointercancel' && Math.abs( dx ) > threshold ) {
				// Dragging left reveals later slides in LTR, earlier ones in RTL.
				if ( ( dx < 0 ) !== !! state.rtl ) {
					if ( state.index < state.maxIndex ) next();
					else update();
				} else if ( state.index > 0 ) {
					prev();
				} else {
					update();
				}
			} else {
				update();
			}
			setPause( 'drag', false );
		}

		viewport.addEventListener( 'pointerup', endDrag );
		viewport.addEventListener( 'pointercancel', endDrag );
		viewport.addEventListener( 'click', function( event ) {
			if ( suppressClick ) {
				event.preventDefault();
				event.stopPropagation();
			}
		}, true );
		viewport.addEventListener( 'dragstart', function( event ) {
			if ( event.target && event.target.tagName === 'IMG' ) event.preventDefault();
		} );

		// ---- Inline video (media carousel) ----
		var playingSlide = null;

		function stopInlineMedia() {
			if ( ! playingSlide ) return;
			var holder = playingSlide.querySelector( '.' + base + '__player' );
			if ( holder ) {
				destroyPlayers( holder );
				holder.parentNode.removeChild( holder );
			}
			playingSlide.classList.remove( 'is-playing' );
			var playBtn = playingSlide.querySelector( cls( 'play' ) );
			if ( playBtn ) playBtn.hidden = false;
			playingSlide = null;
			setPause( 'video', false );
		}

		root.querySelectorAll( cls( 'play' ) ).forEach( function( playBtn ) {
			playBtn.setAttribute( 'type', 'button' );
			playBtn.addEventListener( 'click', function() {
				var slide = playBtn.closest( cls( 'slide' ) );
				var src = playBtn.getAttribute( 'data-src' );
				if ( ! slide || ! src ) return;
				stopInlineMedia();
				var player = createPlayer( src, '', true, playBtn.getAttribute( 'aria-label' ) || 'Video' );
				if ( ! player ) return;
				var holder = document.createElement( 'div' );
				holder.className = base + '__player';
				holder.appendChild( player );
				slide.appendChild( holder );
				slide.classList.add( 'is-playing' );
				playBtn.hidden = true;
				playingSlide = slide;
				setPause( 'video', true );
				player.focus && player.focus();
			} );
		} );

		// ---- Autoplay ----
		var pauseBtn = null;

		function isPaused() {
			if ( state.userPaused ) return true;
			for ( var key in state.pauseReasons ) {
				if ( state.pauseReasons[ key ] ) return true;
			}
			return false;
		}

		function schedule() {
			if ( state.timer ) {
				clearInterval( state.timer );
				state.timer = null;
			}
			if ( state.autoplayActive && ! isPaused() && state.maxIndex > 0 ) {
				state.timer = setInterval( function() {
					if ( state.index >= state.maxIndex ) {
						goTo( 0 );
					} else {
						next();
					}
				}, options.speed );
			}
			viewport.setAttribute( 'aria-live', state.autoplayActive && ! isPaused() ? 'off' : 'polite' );
		}

		function setPause( reason, paused ) {
			state.pauseReasons[ reason ] = paused;
			schedule();
		}

		function restartAutoplay() {
			if ( state.autoplayActive ) schedule();
		}

		function renderPauseButton() {
			if ( ! pauseBtn ) return;
			pauseBtn.innerHTML = state.userPaused ? PLAY_ICON : PAUSE_ICON;
			pauseBtn.setAttribute( 'aria-label', state.userPaused ? 'Start automatic slide show' : 'Stop automatic slide show' );
			pauseBtn.classList.toggle( 'is-paused', state.userPaused );
		}

		function setupAutoplay() {
			state.autoplayActive = options.autoplay && ! prefersReducedMotion() && count > 1;

			if ( state.autoplayActive && ! pauseBtn ) {
				pauseBtn = root.querySelector( cls( 'pause' ) );
				if ( ! pauseBtn ) {
					pauseBtn = document.createElement( 'button' );
					pauseBtn.className = base + '__pause';
					root.insertBefore( pauseBtn, root.firstChild );
				}
				pauseBtn.setAttribute( 'type', 'button' );
				pauseBtn.setAttribute( 'aria-controls', track.id );
				pauseBtn.addEventListener( 'click', function() {
					state.userPaused = ! state.userPaused;
					renderPauseButton();
					schedule();
				} );
			}
			if ( pauseBtn ) {
				pauseBtn.hidden = ! state.autoplayActive || state.maxIndex === 0;
				renderPauseButton();
			}
			schedule();
		}

		if ( options.pauseOnHover ) {
			// Pointer events so a touch tap does not leave the carousel "hovered".
			root.addEventListener( 'pointerenter', function( event ) {
				if ( event.pointerType === 'mouse' ) setPause( 'hover', true );
			} );
			root.addEventListener( 'pointerleave', function( event ) {
				if ( event.pointerType === 'mouse' ) setPause( 'hover', false );
			} );
		}
		root.addEventListener( 'focusin', function() {
			setPause( 'focus', true );
		} );
		root.addEventListener( 'focusout', function( event ) {
			if ( event.relatedTarget && root.contains( event.relatedTarget ) ) return;
			setPause( 'focus', false );
		} );
		document.addEventListener( 'visibilitychange', function() {
			setPause( 'hidden', document.hidden );
		} );

		onReducedMotionChange( setupAutoplay );

		// ---- Resize ----
		if ( window.ResizeObserver ) {
			var lastWidth = 0;
			new window.ResizeObserver( function() {
				var width = viewport.clientWidth;
				if ( width === lastWidth ) return;
				lastWidth = width;
				layout();
				setupAutoplay();
			} ).observe( viewport );
		} else {
			window.addEventListener( 'resize', function() {
				layout();
				setupAutoplay();
			} );
		}

		layout();
		setupAutoplay();

		return { goTo: goTo, next: next, prev: prev };
	}

	// =============================================
	// VIDEO POPUP
	// =============================================

	var openPopup = null;

	function lockScroll() {
		var html = document.documentElement;
		var scrollbar = window.innerWidth - html.clientWidth;
		var saved = {
			overflow: html.style.overflow,
			paddingRight: document.body.style.paddingRight,
		};
		html.style.overflow = 'hidden';
		if ( scrollbar > 0 ) {
			var current = parseFloat( window.getComputedStyle( document.body ).paddingRight ) || 0;
			document.body.style.paddingRight = ( current + scrollbar ) + 'px';
		}
		return function unlock() {
			html.style.overflow = saved.overflow;
			document.body.style.paddingRight = saved.paddingRight;
		};
	}

	function getFocusable( container ) {
		return Array.prototype.slice.call( container.querySelectorAll( FOCUSABLE ) ).filter( function( el ) {
			return ! el.hidden && el.getClientRects().length > 0;
		} );
	}

	function initVideoPopups() {
		document.querySelectorAll( '.wp-block-gambol-video-popup' ).forEach( function( root ) {
			if ( root.dataset.videoPopupReady ) return;

			var trigger = root.querySelector( '.wp-block-gambol-video-popup__wrapper' );
			var lightbox = root.querySelector( '.wp-block-gambol-video-popup__lightbox' );
			if ( ! trigger || ! lightbox ) return;

			var overlay = lightbox.querySelector( '.wp-block-gambol-video-popup__lightbox-overlay' );
			var content = lightbox.querySelector( '.wp-block-gambol-video-popup__lightbox-content' );
			var closeBtn = lightbox.querySelector( '.wp-block-gambol-video-popup__lightbox-close' );
			var videoBox = lightbox.querySelector( '.wp-block-gambol-video-popup__lightbox-video' );
			if ( ! videoBox ) return;

			root.dataset.videoPopupReady = 'true';

			var url = root.dataset.videoUrl || '';
			var type = root.dataset.videoType || '';
			var autoplay = dataBool( root, 'autoplay', true );
			var title = trigger.getAttribute( 'aria-label' ) || 'Video';

			if ( ! lightbox.id ) lightbox.id = uniqueId( 'gambol-video-popup' );
			trigger.setAttribute( 'type', 'button' );
			trigger.setAttribute( 'aria-haspopup', 'dialog' );
			trigger.setAttribute( 'aria-controls', lightbox.id );

			lightbox.setAttribute( 'role', 'dialog' );
			lightbox.setAttribute( 'aria-modal', 'true' );
			lightbox.setAttribute( 'aria-label', title );
			lightbox.hidden = true;
			if ( closeBtn ) {
				closeBtn.setAttribute( 'type', 'button' );
				if ( closeBtn.getAttribute( 'aria-label' ) === 'Close' ) {
					closeBtn.setAttribute( 'aria-label', 'Close video' );
				}
			}
			if ( content ) content.setAttribute( 'tabindex', '-1' );
			var initialFocus = closeBtn || content || lightbox;
			if ( initialFocus === lightbox ) lightbox.setAttribute( 'tabindex', '-1' );

			// Remember the original location so the dialog can be returned.
			var placeholder = document.createComment( 'gambol-video-popup' );
			var unlock = null;
			var returnFocus = null;

			function onKeydown( event ) {
				if ( event.key === 'Escape' || event.key === 'Esc' ) {
					event.preventDefault();
					close();
					return;
				}
				if ( event.key !== 'Tab' ) return;
				var focusable = getFocusable( lightbox );
				if ( ! focusable.length ) {
					event.preventDefault();
					return;
				}
				var first = focusable[ 0 ];
				var last = focusable[ focusable.length - 1 ];
				if ( event.shiftKey && ( document.activeElement === first || ! lightbox.contains( document.activeElement ) ) ) {
					event.preventDefault();
					last.focus();
				} else if ( ! event.shiftKey && ( document.activeElement === last || ! lightbox.contains( document.activeElement ) ) ) {
					event.preventDefault();
					first.focus();
				}
			}

			function onFocusIn( event ) {
				if ( ! lightbox.contains( event.target ) ) {
					initialFocus.focus();
				}
			}

			function open() {
				if ( openPopup ) openPopup();
				returnFocus = document.activeElement && document.activeElement !== document.body ? document.activeElement : trigger;

				// Escape any transformed ancestor so position: fixed is viewport-relative.
				lightbox.parentNode.insertBefore( placeholder, lightbox );
				document.body.appendChild( lightbox );

				destroyPlayers( videoBox );
				var player = createPlayer( url, type, autoplay, title );
				if ( player ) videoBox.appendChild( player );

				lightbox.hidden = false;
				lightbox.removeAttribute( 'aria-hidden' );
				lightbox.classList.add( 'is-open' );
				unlock = lockScroll();

				document.addEventListener( 'keydown', onKeydown, true );
				document.addEventListener( 'focusin', onFocusIn );
				openPopup = close;

				initialFocus.focus();
			}

			function close() {
				if ( ! lightbox.classList.contains( 'is-open' ) ) return;
				document.removeEventListener( 'keydown', onKeydown, true );
				document.removeEventListener( 'focusin', onFocusIn );

				destroyPlayers( videoBox );
				lightbox.classList.remove( 'is-open' );
				lightbox.setAttribute( 'aria-hidden', 'true' );
				lightbox.hidden = true;

				if ( placeholder.parentNode ) {
					placeholder.parentNode.insertBefore( lightbox, placeholder );
					placeholder.parentNode.removeChild( placeholder );
				}
				if ( unlock ) {
					unlock();
					unlock = null;
				}
				if ( openPopup === close ) openPopup = null;

				var target = returnFocus && document.contains( returnFocus ) ? returnFocus : trigger;
				returnFocus = null;
				target.focus();
			}

			// Button element: Enter/Space activate click natively.
			trigger.addEventListener( 'click', function( event ) {
				event.preventDefault();
				open();
			} );
			if ( closeBtn ) closeBtn.addEventListener( 'click', close );
			if ( overlay ) overlay.addEventListener( 'click', close );
			lightbox.addEventListener( 'click', function( event ) {
				// Clicks on the backdrop area outside the content also close.
				if ( event.target === lightbox ) close();
			} );
		} );
	}

	// =============================================
	// BOOT
	// =============================================

	function init() {
		initToggles();
		initCountdowns();
		initCarousels();
		initVideoPopups();
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
