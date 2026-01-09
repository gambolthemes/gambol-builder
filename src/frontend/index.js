/**
 * Gambol Builder - Frontend Interactivity
 *
 * Handles client-side interactions for Gambol Builder blocks:
 * - Accordion toggle
 * - Tabs switching
 * - Video lightbox
 * - Gallery lightbox
 *
 * @package GambolBuilder
 */

( function() {
	'use strict';

	/**
	 * Initialize when DOM is ready.
	 */
	document.addEventListener( 'DOMContentLoaded', function() {
		initAccordions();
		initTabs();
		initVideoLightbox();
		initGalleryLightbox();
		initCounters();
	} );

	// =============================================
	// ACCORDION
	// =============================================

	/**
	 * Initialize all accordions on the page.
	 */
	function initAccordions() {
		const accordions = document.querySelectorAll( '.gambol-accordion' );
		
		accordions.forEach( function( accordion ) {
			const allowMultiple = accordion.dataset.allowMultiple === 'true';
			const headers = accordion.querySelectorAll( '.gambol-accordion-item__header' );

			headers.forEach( function( header ) {
				header.addEventListener( 'click', function() {
					const item = this.closest( '.gambol-accordion-item' );
					const isOpen = item.classList.contains( 'is-open' );
					const body = item.querySelector( '.gambol-accordion-item__body' );

					// Close others if not allowing multiple
					if ( ! allowMultiple && ! isOpen ) {
						accordion.querySelectorAll( '.gambol-accordion-item.is-open' ).forEach( function( openItem ) {
							openItem.classList.remove( 'is-open' );
							openItem.querySelector( '.gambol-accordion-item__header' ).setAttribute( 'aria-expanded', 'false' );
							openItem.querySelector( '.gambol-accordion-item__body' ).hidden = true;
						} );
					}

					// Toggle current item
					item.classList.toggle( 'is-open' );
					this.setAttribute( 'aria-expanded', ! isOpen );
					body.hidden = isOpen;
				} );

				// Keyboard support
				header.addEventListener( 'keydown', function( e ) {
					if ( e.key === 'Enter' || e.key === ' ' ) {
						e.preventDefault();
						this.click();
					}
				} );
			} );
		} );
	}

	// =============================================
	// TABS
	// =============================================

	/**
	 * Initialize all tabs on the page.
	 */
	function initTabs() {
		const tabContainers = document.querySelectorAll( '.gambol-tabs' );

		tabContainers.forEach( function( container ) {
			const tabButtons = container.querySelectorAll( '.gambol-tabs__button' );
			const tabPanels = container.querySelectorAll( '.gambol-tabs__panel' );

			tabButtons.forEach( function( button, index ) {
				button.addEventListener( 'click', function() {
					// Deactivate all tabs
					tabButtons.forEach( function( btn ) {
						btn.classList.remove( 'is-active' );
						btn.setAttribute( 'aria-selected', 'false' );
						btn.setAttribute( 'tabindex', '-1' );
					} );

					tabPanels.forEach( function( panel ) {
						panel.classList.remove( 'is-active' );
						panel.hidden = true;
					} );

					// Activate clicked tab
					this.classList.add( 'is-active' );
					this.setAttribute( 'aria-selected', 'true' );
					this.setAttribute( 'tabindex', '0' );

					const panelId = this.getAttribute( 'aria-controls' );
					const panel = document.getElementById( panelId );
					if ( panel ) {
						panel.classList.add( 'is-active' );
						panel.hidden = false;
					}
				} );

				// Keyboard navigation
				button.addEventListener( 'keydown', function( e ) {
					const currentIndex = Array.from( tabButtons ).indexOf( this );
					let newIndex = currentIndex;

					switch ( e.key ) {
						case 'ArrowLeft':
						case 'ArrowUp':
							e.preventDefault();
							newIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
							break;
						case 'ArrowRight':
						case 'ArrowDown':
							e.preventDefault();
							newIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
							break;
						case 'Home':
							e.preventDefault();
							newIndex = 0;
							break;
						case 'End':
							e.preventDefault();
							newIndex = tabButtons.length - 1;
							break;
						default:
							return;
					}

					tabButtons[ newIndex ].click();
					tabButtons[ newIndex ].focus();
				} );
			} );
		} );
	}

	// =============================================
	// VIDEO LIGHTBOX
	// =============================================

	/**
	 * Initialize video lightbox functionality.
	 */
	function initVideoLightbox() {
		const videoTriggers = document.querySelectorAll( '.gambol-video--lightbox .gambol-video__trigger' );

		if ( ! videoTriggers.length ) return;

		// Create lightbox container
		const lightbox = createLightboxElement( 'gambol-video-lightbox' );
		let currentVideoUrl = '';

		videoTriggers.forEach( function( trigger ) {
			trigger.addEventListener( 'click', function( e ) {
				e.preventDefault();
				currentVideoUrl = this.dataset.videoUrl;

				if ( currentVideoUrl ) {
					const content = lightbox.querySelector( '.gambol-lightbox__content' );
					content.innerHTML = `
						<div class="gambol-video-lightbox__wrapper">
							<iframe src="${ currentVideoUrl }&autoplay=1" 
								title="Video" 
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
								allowfullscreen>
							</iframe>
						</div>
					`;
					openLightbox( lightbox );
				}
			} );
		} );

		// Close on click outside or button
		lightbox.addEventListener( 'click', function( e ) {
			if ( e.target === this || e.target.closest( '.gambol-lightbox__close' ) ) {
				closeLightbox( lightbox );
				// Stop video
				const content = lightbox.querySelector( '.gambol-lightbox__content' );
				content.innerHTML = '';
			}
		} );

		// Close on escape
		document.addEventListener( 'keydown', function( e ) {
			if ( e.key === 'Escape' && lightbox.classList.contains( 'is-open' ) ) {
				closeLightbox( lightbox );
				const content = lightbox.querySelector( '.gambol-lightbox__content' );
				content.innerHTML = '';
			}
		} );
	}

	// =============================================
	// GALLERY LIGHTBOX
	// =============================================

	/**
	 * Initialize gallery lightbox functionality.
	 */
	function initGalleryLightbox() {
		const galleries = document.querySelectorAll( '.gambol-gallery--lightbox' );

		if ( ! galleries.length ) return;

		// Create lightbox container
		const lightbox = createLightboxElement( 'gambol-lightbox', true );
		let currentGallery = [];
		let currentIndex = 0;

		galleries.forEach( function( gallery ) {
			const links = gallery.querySelectorAll( '.gambol-gallery__link' );

			links.forEach( function( link, index ) {
				link.addEventListener( 'click', function( e ) {
					e.preventDefault();

					// Build gallery array
					currentGallery = Array.from( links ).map( function( l ) {
						return {
							url: l.href,
							alt: l.querySelector( 'img' )?.alt || ''
						};
					} );

					currentIndex = index;
					showGalleryImage( lightbox, currentGallery, currentIndex );
					openLightbox( lightbox );
				} );
			} );
		} );

		// Navigation
		lightbox.addEventListener( 'click', function( e ) {
			if ( e.target.closest( '.gambol-lightbox__nav--prev' ) ) {
				currentIndex = currentIndex > 0 ? currentIndex - 1 : currentGallery.length - 1;
				showGalleryImage( lightbox, currentGallery, currentIndex );
			} else if ( e.target.closest( '.gambol-lightbox__nav--next' ) ) {
				currentIndex = currentIndex < currentGallery.length - 1 ? currentIndex + 1 : 0;
				showGalleryImage( lightbox, currentGallery, currentIndex );
			} else if ( e.target === this || e.target.closest( '.gambol-lightbox__close' ) ) {
				closeLightbox( lightbox );
			}
		} );

		// Keyboard navigation
		document.addEventListener( 'keydown', function( e ) {
			if ( ! lightbox.classList.contains( 'is-open' ) ) return;

			switch ( e.key ) {
				case 'ArrowLeft':
					currentIndex = currentIndex > 0 ? currentIndex - 1 : currentGallery.length - 1;
					showGalleryImage( lightbox, currentGallery, currentIndex );
					break;
				case 'ArrowRight':
					currentIndex = currentIndex < currentGallery.length - 1 ? currentIndex + 1 : 0;
					showGalleryImage( lightbox, currentGallery, currentIndex );
					break;
				case 'Escape':
					closeLightbox( lightbox );
					break;
			}
		} );
	}

	/**
	 * Show gallery image at index.
	 */
	function showGalleryImage( lightbox, gallery, index ) {
		const image = gallery[ index ];
		const content = lightbox.querySelector( '.gambol-lightbox__content' );
		content.innerHTML = `
			<img src="${ image.url }" alt="${ image.alt }" class="gambol-lightbox__image" />
		`;
		
		const counter = lightbox.querySelector( '.gambol-lightbox__counter' );
		if ( counter ) {
			counter.textContent = `${ index + 1 } / ${ gallery.length }`;
		}
	}

	// =============================================
	// LIGHTBOX HELPERS
	// =============================================

	/**
	 * Create lightbox element.
	 */
	function createLightboxElement( className, hasNav ) {
		// Check if already exists
		let existing = document.querySelector( '.' + className );
		if ( existing ) return existing;

		const lightbox = document.createElement( 'div' );
		lightbox.className = className;
		lightbox.setAttribute( 'role', 'dialog' );
		lightbox.setAttribute( 'aria-modal', 'true' );
		lightbox.innerHTML = `
			<button type="button" class="gambol-lightbox__close" aria-label="Close">&times;</button>
			${ hasNav ? `
				<button type="button" class="gambol-lightbox__nav gambol-lightbox__nav--prev" aria-label="Previous">&#8249;</button>
				<button type="button" class="gambol-lightbox__nav gambol-lightbox__nav--next" aria-label="Next">&#8250;</button>
			` : '' }
			<div class="gambol-lightbox__content"></div>
			${ hasNav ? '<div class="gambol-lightbox__counter"></div>' : '' }
		`;
		document.body.appendChild( lightbox );
		return lightbox;
	}

	/**
	 * Open lightbox.
	 */
	function openLightbox( lightbox ) {
		lightbox.classList.add( 'is-open' );
		document.body.style.overflow = 'hidden';
		lightbox.querySelector( '.gambol-lightbox__close' ).focus();
	}

	/**
	 * Close lightbox.
	 */
	function closeLightbox( lightbox ) {
		lightbox.classList.remove( 'is-open' );
		document.body.style.overflow = '';
	}

	// =============================================
	// COUNTER ANIMATION
	// =============================================

	/**
	 * Initialize counter animations on scroll.
	 */
	function initCounters() {
		const counters = document.querySelectorAll( '.gambol-counter' );
		
		if ( ! counters.length ) return;

		// Use Intersection Observer for scroll-based animation
		const observer = new IntersectionObserver( function( entries ) {
			entries.forEach( function( entry ) {
				if ( entry.isIntersecting && ! entry.target.dataset.animated ) {
					animateCounter( entry.target );
					entry.target.dataset.animated = 'true';
				}
			} );
		}, {
			threshold: 0.5,
			rootMargin: '0px'
		} );

		counters.forEach( function( counter ) {
			observer.observe( counter );
		} );
	}

	/**
	 * Animate a single counter element.
	 */
	function animateCounter( counter ) {
		const valueEl = counter.querySelector( '.gambol-counter__value' );
		if ( ! valueEl ) return;

		const startValue = parseInt( counter.dataset.start, 10 ) || 0;
		const endValue = parseInt( counter.dataset.end, 10 ) || parseInt( valueEl.dataset.value, 10 ) || 0;
		const duration = parseInt( counter.dataset.duration, 10 ) || 2000;
		const useSeparator = counter.dataset.separator === 'true';

		const startTime = performance.now();
		const difference = endValue - startValue;

		/**
		 * Easing function (ease-out-cubic).
		 */
		function easeOutCubic( t ) {
			return 1 - Math.pow( 1 - t, 3 );
		}

		/**
		 * Format number with thousand separator.
		 */
		function formatNumber( num ) {
			if ( useSeparator ) {
				return num.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' );
			}
			return num.toString();
		}

		/**
		 * Animation frame handler.
		 */
		function updateCounter( currentTime ) {
			const elapsed = currentTime - startTime;
			const progress = Math.min( elapsed / duration, 1 );
			const easedProgress = easeOutCubic( progress );
			const currentValue = Math.round( startValue + ( difference * easedProgress ) );

			valueEl.textContent = formatNumber( currentValue );

			if ( progress < 1 ) {
				requestAnimationFrame( updateCounter );
			}
		}

		requestAnimationFrame( updateCounter );
	}

} )();
