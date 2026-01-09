/**
 * Gambol Builder - Block Registry
 * 
 * Centralized registry of all 77 Gambol blocks organized by category.
 * Provides block definitions, icons, and programmatic insertion API.
 * Complete Elementor-like page builder experience.
 *
 * @package GambolBuilder
 */

import { __ } from '@wordpress/i18n';
import { createBlock, getBlockType } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';

// =============================================================================
// BLOCK CATEGORIES
// =============================================================================

/**
 * Block category definitions.
 * Complete set of categories for the Gambol page builder.
 */
export const BLOCK_CATEGORIES = [
	{
		id: 'layout',
		label: __( 'Layout', 'gambol-builder' ),
		icon: 'layout',
		description: __( 'Structure and organize your page content', 'gambol-builder' ),
		priority: 1,
	},
	{
		id: 'basic',
		label: __( 'Basic', 'gambol-builder' ),
		icon: 'basic',
		description: __( 'Essential building blocks', 'gambol-builder' ),
		priority: 2,
	},
	{
		id: 'media',
		label: __( 'Media', 'gambol-builder' ),
		icon: 'media',
		description: __( 'Images, videos, and carousels', 'gambol-builder' ),
		priority: 3,
	},
	{
		id: 'content',
		label: __( 'Content', 'gambol-builder' ),
		icon: 'content',
		description: __( 'Text, headings, and lists', 'gambol-builder' ),
		priority: 4,
	},
	{
		id: 'interactive',
		label: __( 'Interactive', 'gambol-builder' ),
		icon: 'interactive',
		description: __( 'Tabs, accordions, and toggles', 'gambol-builder' ),
		priority: 5,
	},
	{
		id: 'social',
		label: __( 'Social', 'gambol-builder' ),
		icon: 'social',
		description: __( 'Social icons and sharing', 'gambol-builder' ),
		priority: 6,
	},
	{
		id: 'theme',
		label: __( 'Theme Elements', 'gambol-builder' ),
		icon: 'theme',
		description: __( 'Dynamic site elements', 'gambol-builder' ),
		priority: 7,
	},
	{
		id: 'posts',
		label: __( 'Posts & Archive', 'gambol-builder' ),
		icon: 'posts',
		description: __( 'Post loops and archives', 'gambol-builder' ),
		priority: 8,
	},
	{
		id: 'woocommerce',
		label: __( 'WooCommerce', 'gambol-builder' ),
		icon: 'woocommerce',
		description: __( 'Shop and product elements', 'gambol-builder' ),
		priority: 9,
	},
	{
		id: 'marketing',
		label: __( 'Marketing', 'gambol-builder' ),
		icon: 'marketing',
		description: __( 'Forms, CTAs, and conversions', 'gambol-builder' ),
		priority: 10,
	},
	{
		id: 'pro',
		label: __( 'Pro', 'gambol-builder' ),
		icon: 'pro',
		description: __( 'Advanced widgets', 'gambol-builder' ),
		priority: 11,
	},
];

/**
 * SVG icons for each block.
 * Custom-designed icons for Gambol Builder.
 */
export const BLOCK_ICONS = {
	// Layout blocks
	section: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<line x1="3" y1="9" x2="21" y2="9" />
			<line x1="3" y1="15" x2="21" y2="15" />
		</svg>
	),
	container: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="4" y="4" width="16" height="16" rx="2" />
			<rect x="7" y="7" width="10" height="10" rx="1" strokeDasharray="2 2" />
		</svg>
	),
	column: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="7" height="18" rx="1" />
			<rect x="14" y="3" width="7" height="18" rx="1" />
		</svg>
	),
	grid: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="3" width="7" height="7" rx="1" />
			<rect x="3" y="14" width="7" height="7" rx="1" />
			<rect x="14" y="14" width="7" height="7" rx="1" />
		</svg>
	),
	'inner-section': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<rect x="5" y="7" width="14" height="10" rx="1" strokeDasharray="3 2" />
		</svg>
	),
	
	// Basic blocks
	heading: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M6 4v16" />
			<path d="M18 4v16" />
			<path d="M6 12h12" />
		</svg>
	),
	text: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<line x1="4" y1="6" x2="20" y2="6" />
			<line x1="4" y1="10" x2="20" y2="10" />
			<line x1="4" y1="14" x2="16" y2="14" />
			<line x1="4" y1="18" x2="12" y2="18" />
		</svg>
	),
	button: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="7" width="18" height="10" rx="5" />
			<line x1="8" y1="12" x2="16" y2="12" />
		</svg>
	),
	divider: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<line x1="3" y1="12" x2="21" y2="12" />
			<circle cx="7" cy="12" r="1" fill="currentColor" />
			<circle cx="12" cy="12" r="1" fill="currentColor" />
			<circle cx="17" cy="12" r="1" fill="currentColor" />
		</svg>
	),
	spacer: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<line x1="12" y1="4" x2="12" y2="8" />
			<polyline points="8 6 12 4 16 6" />
			<line x1="12" y1="20" x2="12" y2="16" />
			<polyline points="8 18 12 20 16 18" />
			<line x1="4" y1="12" x2="20" y2="12" strokeDasharray="2 2" />
		</svg>
	),
	alert: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
			<line x1="12" y1="9" x2="12" y2="13" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	),
	html: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<polyline points="16 18 22 12 16 6" />
			<polyline points="8 6 2 12 8 18" />
		</svg>
	),
	shortcode: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M7 8l-4 4 4 4" />
			<path d="M17 8l4 4-4 4" />
			<line x1="14" y1="4" x2="10" y2="20" />
		</svg>
	),
	
	// Media blocks
	image: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<circle cx="8.5" cy="10" r="1.5" />
			<path d="M21 15l-5-5L5 19" />
		</svg>
	),
	icon: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
		</svg>
	),
	video: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
		</svg>
	),
	gallery: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="3" width="7" height="7" rx="1" />
			<rect x="3" y="14" width="7" height="7" rx="1" />
			<rect x="14" y="14" width="7" height="7" rx="1" />
		</svg>
	),
	audio: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M9 18V5l12-2v13" />
			<circle cx="6" cy="18" r="3" />
			<circle cx="18" cy="16" r="3" />
		</svg>
	),
	'image-carousel': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="5" y="5" width="14" height="14" rx="2" />
			<path d="M2 9v6" />
			<path d="M22 9v6" />
		</svg>
	),
	'video-popup': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
		</svg>
	),
	lottie: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<path d="M8 12s1.5-2 4-2 4 2 4 2" />
			<path d="M8 14s1.5 2 4 2 4-2 4-2" />
		</svg>
	),
	
	// Content blocks
	'icon-list': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="5" cy="6" r="2" />
			<line x1="10" y1="6" x2="21" y2="6" />
			<circle cx="5" cy="12" r="2" />
			<line x1="10" y1="12" x2="21" y2="12" />
			<circle cx="5" cy="18" r="2" />
			<line x1="10" y1="18" x2="21" y2="18" />
		</svg>
	),
	'image-box': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="10" rx="2" />
			<line x1="6" y1="16" x2="18" y2="16" />
			<line x1="6" y1="19" x2="14" y2="19" />
		</svg>
	),
	'icon-box': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="8" r="4" />
			<line x1="6" y1="15" x2="18" y2="15" />
			<line x1="8" y1="19" x2="16" y2="19" />
		</svg>
	),
	counter: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 6v6l4 2" />
			<circle cx="12" cy="12" r="10" />
		</svg>
	),
	testimonial: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
			<line x1="8" y1="8" x2="16" y2="8" />
			<line x1="8" y1="12" x2="14" y2="12" />
		</svg>
	),
	'star-rating': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" />
		</svg>
	),
	'progress-bar': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="2" y="10" width="20" height="4" rx="2" />
			<rect x="2" y="10" width="14" height="4" rx="2" fill="currentColor" />
		</svg>
	),
	
	// Interactive blocks
	tabs: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="2" y="3" width="20" height="18" rx="2" />
			<line x1="2" y1="8" x2="22" y2="8" />
			<line x1="8" y1="3" x2="8" y2="8" />
			<line x1="14" y1="3" x2="14" y2="8" />
		</svg>
	),
	accordion: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="5" rx="1" />
			<rect x="3" y="10" width="18" height="5" rx="1" />
			<rect x="3" y="17" width="18" height="5" rx="1" />
			<polyline points="15 5 17 5.5 15 6" />
		</svg>
	),
	toggle: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="1" y="5" width="22" height="14" rx="7" />
			<circle cx="16" cy="12" r="4" fill="currentColor" />
		</svg>
	),
	popup: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<line x1="3" y1="9" x2="21" y2="9" />
			<line x1="18" y1="6" x2="18" y2="6.01" />
		</svg>
	),
	
	// Social blocks
	'social-icons': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="6" cy="12" r="3" />
			<circle cx="18" cy="12" r="3" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	),
	'share-buttons': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="18" cy="5" r="3" />
			<circle cx="6" cy="12" r="3" />
			<circle cx="18" cy="19" r="3" />
			<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
			<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
		</svg>
	),
	
	// Theme blocks
	'site-logo': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<path d="M12 6v6l4 2" />
		</svg>
	),
	'site-title': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<text x="4" y="16" fontSize="12" fill="currentColor" fontWeight="bold">T</text>
			<line x1="4" y1="20" x2="20" y2="20" />
		</svg>
	),
	'nav-menu': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="18" x2="21" y2="18" />
		</svg>
	),
	'search-form': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
	),
	breadcrumbs: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<polyline points="9 6 15 12 9 18" />
			<line x1="3" y1="12" x2="9" y2="12" />
			<line x1="15" y1="12" x2="21" y2="12" />
		</svg>
	),
	'author-box': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="9" cy="7" r="4" />
			<path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
			<line x1="16" y1="8" x2="22" y2="8" />
			<line x1="16" y1="12" x2="20" y2="12" />
		</svg>
	),
	sitemap: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="9" y="2" width="6" height="4" rx="1" />
			<rect x="2" y="18" width="6" height="4" rx="1" />
			<rect x="9" y="18" width="6" height="4" rx="1" />
			<rect x="16" y="18" width="6" height="4" rx="1" />
			<line x1="12" y1="6" x2="12" y2="10" />
			<line x1="5" y1="10" x2="19" y2="10" />
			<line x1="5" y1="10" x2="5" y2="18" />
			<line x1="12" y1="10" x2="12" y2="18" />
			<line x1="19" y1="10" x2="19" y2="18" />
		</svg>
	),
	
	// Posts blocks
	posts: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="7" height="9" rx="1" />
			<rect x="14" y="3" width="7" height="9" rx="1" />
			<rect x="3" y="16" width="18" height="5" rx="1" />
		</svg>
	),
	'loop-grid': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="3" width="7" height="7" rx="1" />
			<rect x="3" y="14" width="7" height="7" rx="1" />
			<rect x="14" y="14" width="7" height="7" rx="1" />
			<polyline points="20 8 22 8 22 22 8 22 8 20" />
		</svg>
	),
	'post-title': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M6 4v16" />
			<path d="M18 4v16" />
			<path d="M6 12h12" />
			<line x1="3" y1="20" x2="21" y2="20" />
		</svg>
	),
	'featured-image': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<circle cx="8.5" cy="10" r="1.5" />
			<path d="M21 15l-5-5L5 19" />
			<polygon points="19 3 21 5 19 7" fill="currentColor" />
		</svg>
	),
	portfolio: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="2" y="7" width="20" height="14" rx="2" />
			<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
			<line x1="12" y1="12" x2="12" y2="16" />
			<line x1="10" y1="14" x2="14" y2="14" />
		</svg>
	),
	
	// WooCommerce blocks
	products: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<line x1="3" y1="9" x2="21" y2="9" />
			<line x1="9" y1="21" x2="9" y2="9" />
		</svg>
	),
	'add-to-cart': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="9" cy="21" r="1" />
			<circle cx="20" cy="21" r="1" />
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
			<line x1="12" y1="9" x2="12" y2="15" />
			<line x1="9" y1="12" x2="15" y2="12" />
		</svg>
	),
	cart: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="9" cy="21" r="1" />
			<circle cx="20" cy="21" r="1" />
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
		</svg>
	),
	'mini-cart': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M6 6h15l-1.5 9h-12z" />
			<circle cx="9" cy="20" r="1" />
			<circle cx="18" cy="20" r="1" />
			<path d="M6 6L5 2H2" />
			<circle cx="19" cy="5" r="3" fill="currentColor" />
		</svg>
	),
	
	// Marketing blocks
	form: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<line x1="7" y1="8" x2="17" y2="8" />
			<line x1="7" y1="12" x2="17" y2="12" />
			<rect x="7" y="16" width="6" height="2" rx="1" fill="currentColor" />
		</svg>
	),
	login: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
			<polyline points="10 17 15 12 10 7" />
			<line x1="15" y1="12" x2="3" y2="12" />
		</svg>
	),
	countdown: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	),
	'call-to-action': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="2" y="5" width="20" height="14" rx="2" />
			<line x1="6" y1="9" x2="14" y2="9" />
			<line x1="6" y1="13" x2="12" y2="13" />
			<rect x="15" y="11" width="5" height="4" rx="2" fill="currentColor" />
		</svg>
	),
	'pricing-table': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<line x1="3" y1="9" x2="21" y2="9" />
			<line x1="9" y1="21" x2="9" y2="9" />
			<line x1="15" y1="21" x2="15" y2="9" />
		</svg>
	),
	table: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<line x1="3" y1="9" x2="21" y2="9" />
			<line x1="3" y1="15" x2="21" y2="15" />
			<line x1="9" y1="3" x2="9" y2="21" />
			<line x1="15" y1="3" x2="15" y2="21" />
		</svg>
	),
	'table-of-contents': (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<line x1="4" y1="6" x2="20" y2="6" />
			<line x1="6" y1="10" x2="20" y2="10" />
			<line x1="6" y1="14" x2="18" y2="14" />
			<line x1="8" y1="18" x2="16" y2="18" />
			<circle cx="4" cy="10" r="1" fill="currentColor" />
			<circle cx="4" cy="14" r="1" fill="currentColor" />
			<circle cx="6" cy="18" r="1" fill="currentColor" />
		</svg>
	),
	
	// Category icons
	layout: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="3" width="7" height="7" rx="1" />
			<rect x="3" y="14" width="7" height="7" rx="1" />
			<rect x="14" y="14" width="7" height="7" rx="1" />
		</svg>
	),
	basic: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<line x1="9" y1="3" x2="9" y2="21" />
		</svg>
	),
	content: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M4 7V4h16v3" />
			<line x1="9" y1="20" x2="15" y2="20" />
			<line x1="12" y1="4" x2="12" y2="20" />
		</svg>
	),
	media: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<circle cx="8.5" cy="8.5" r="1.5" />
			<path d="M21 15l-5-5L5 21" />
		</svg>
	),
	interactive: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<path d="M8 12h8" />
			<path d="M12 8v8" />
		</svg>
	),
	social: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="18" cy="5" r="3" />
			<circle cx="6" cy="12" r="3" />
			<circle cx="18" cy="19" r="3" />
			<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
			<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
		</svg>
	),
	theme: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
			<path d="M12 12l8-4.5" />
			<path d="M12 12v9" />
			<path d="M12 12L4 7.5" />
		</svg>
	),
	posts: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
		</svg>
	),
	woocommerce: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="9" cy="21" r="1" />
			<circle cx="20" cy="21" r="1" />
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
		</svg>
	),
	marketing: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<polygon points="3 11 22 2 13 21 11 13 3 11" />
		</svg>
	),
	pro: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" />
		</svg>
	),
};

/**
 * Complete block definitions organized by category.
 * All 77 Gambol blocks with full metadata.
 */
export const GAMBOL_BLOCKS = {
	// =========================================================================
	// LAYOUT BLOCKS
	// =========================================================================
	layout: [
		{
			name: 'gambol/section',
			title: __( 'Section', 'gambol-builder' ),
			icon: 'section',
			description: __( 'Full-width container for page sections', 'gambol-builder' ),
			keywords: ['section', 'row', 'layout', 'full-width'],
			category: 'layout',
		},
		{
			name: 'gambol/container',
			title: __( 'Container', 'gambol-builder' ),
			icon: 'container',
			description: __( 'Flexible content container', 'gambol-builder' ),
			keywords: ['container', 'box', 'wrapper', 'group'],
			category: 'layout',
		},
		{
			name: 'gambol/column',
			title: __( 'Column', 'gambol-builder' ),
			icon: 'column',
			description: __( 'Responsive column layout', 'gambol-builder' ),
			keywords: ['column', 'col', 'grid'],
			category: 'layout',
		},
		{
			name: 'gambol/grid',
			title: __( 'Grid', 'gambol-builder' ),
			icon: 'grid',
			description: __( 'CSS Grid layout container', 'gambol-builder' ),
			keywords: ['grid', 'columns', 'layout'],
			category: 'layout',
		},
		{
			name: 'gambol/inner-section',
			title: __( 'Inner Section', 'gambol-builder' ),
			icon: 'inner-section',
			description: __( 'Nested section inside sections', 'gambol-builder' ),
			keywords: ['inner', 'nested', 'section'],
			category: 'layout',
		},
	],
	
	// =========================================================================
	// BASIC BLOCKS
	// =========================================================================
	basic: [
		{
			name: 'gambol/heading',
			title: __( 'Heading', 'gambol-builder' ),
			icon: 'heading',
			description: __( 'Add a title or headline (H1-H6)', 'gambol-builder' ),
			keywords: ['heading', 'title', 'h1', 'h2', 'headline'],
			category: 'basic',
		},
		{
			name: 'gambol/text',
			title: __( 'Text Editor', 'gambol-builder' ),
			icon: 'text',
			description: __( 'Rich text paragraph editor', 'gambol-builder' ),
			keywords: ['text', 'paragraph', 'content', 'body'],
			category: 'basic',
		},
		{
			name: 'gambol/button',
			title: __( 'Button', 'gambol-builder' ),
			icon: 'button',
			description: __( 'Call-to-action button with link', 'gambol-builder' ),
			keywords: ['button', 'cta', 'link', 'action'],
			category: 'basic',
		},
		{
			name: 'gambol/divider',
			title: __( 'Divider', 'gambol-builder' ),
			icon: 'divider',
			description: __( 'Horizontal line separator', 'gambol-builder' ),
			keywords: ['divider', 'separator', 'line', 'hr'],
			category: 'basic',
		},
		{
			name: 'gambol/spacer',
			title: __( 'Spacer', 'gambol-builder' ),
			icon: 'spacer',
			description: __( 'Add vertical spacing', 'gambol-builder' ),
			keywords: ['spacer', 'space', 'gap', 'margin'],
			category: 'basic',
		},
		{
			name: 'gambol/icon',
			title: __( 'Icon', 'gambol-builder' ),
			icon: 'icon',
			description: __( 'Display an icon from library', 'gambol-builder' ),
			keywords: ['icon', 'symbol', 'glyph'],
			category: 'basic',
		},
		{
			name: 'gambol/alert',
			title: __( 'Alert', 'gambol-builder' ),
			icon: 'alert',
			description: __( 'Info, warning, success alerts', 'gambol-builder' ),
			keywords: ['alert', 'notice', 'warning', 'info'],
			category: 'basic',
		},
		{
			name: 'gambol/html',
			title: __( 'HTML', 'gambol-builder' ),
			icon: 'html',
			description: __( 'Custom HTML code block', 'gambol-builder' ),
			keywords: ['html', 'code', 'custom', 'embed'],
			category: 'basic',
		},
		{
			name: 'gambol/shortcode',
			title: __( 'Shortcode', 'gambol-builder' ),
			icon: 'shortcode',
			description: __( 'Insert WordPress shortcode', 'gambol-builder' ),
			keywords: ['shortcode', 'plugin', 'embed'],
			category: 'basic',
		},
		{
			name: 'gambol/menu-anchor',
			title: __( 'Menu Anchor', 'gambol-builder' ),
			icon: 'menu-anchor',
			description: __( 'Anchor point for scrolling', 'gambol-builder' ),
			keywords: ['anchor', 'link', 'jump', 'scroll'],
			category: 'basic',
		},
	],
	
	// =========================================================================
	// MEDIA BLOCKS
	// =========================================================================
	media: [
		{
			name: 'gambol/image',
			title: __( 'Image', 'gambol-builder' ),
			icon: 'image',
			description: __( 'Insert an image', 'gambol-builder' ),
			keywords: ['image', 'photo', 'picture'],
			category: 'media',
		},
		{
			name: 'gambol/video',
			title: __( 'Video', 'gambol-builder' ),
			icon: 'video',
			description: __( 'Embed video from URL', 'gambol-builder' ),
			keywords: ['video', 'youtube', 'vimeo'],
			category: 'media',
		},
		{
			name: 'gambol/gallery',
			title: __( 'Gallery', 'gambol-builder' ),
			icon: 'gallery',
			description: __( 'Image gallery grid', 'gambol-builder' ),
			keywords: ['gallery', 'images', 'photos', 'grid'],
			category: 'media',
		},
		{
			name: 'gambol/audio',
			title: __( 'Audio', 'gambol-builder' ),
			icon: 'audio',
			description: __( 'Audio player widget', 'gambol-builder' ),
			keywords: ['audio', 'music', 'sound', 'mp3'],
			category: 'media',
		},
		{
			name: 'gambol/image-carousel',
			title: __( 'Image Carousel', 'gambol-builder' ),
			icon: 'image-carousel',
			description: __( 'Slider carousel for images', 'gambol-builder' ),
			keywords: ['carousel', 'slider', 'images', 'slideshow'],
			category: 'media',
		},
		{
			name: 'gambol/media-carousel',
			title: __( 'Media Carousel', 'gambol-builder' ),
			icon: 'image-carousel',
			description: __( 'Carousel with mixed media', 'gambol-builder' ),
			keywords: ['media', 'carousel', 'slider'],
			category: 'media',
		},
		{
			name: 'gambol/video-popup',
			title: __( 'Video Popup', 'gambol-builder' ),
			icon: 'video-popup',
			description: __( 'Video in lightbox modal', 'gambol-builder' ),
			keywords: ['video', 'lightbox', 'popup', 'modal'],
			category: 'media',
		},
		{
			name: 'gambol/lottie',
			title: __( 'Lottie Animation', 'gambol-builder' ),
			icon: 'lottie',
			description: __( 'Lottie JSON animation', 'gambol-builder' ),
			keywords: ['lottie', 'animation', 'json'],
			category: 'media',
		},
	],
	
	// =========================================================================
	// CONTENT BLOCKS
	// =========================================================================
	content: [
		{
			name: 'gambol/icon-list',
			title: __( 'Icon List', 'gambol-builder' ),
			icon: 'icon-list',
			description: __( 'List with custom icons', 'gambol-builder' ),
			keywords: ['list', 'icons', 'bullets'],
			category: 'content',
		},
		{
			name: 'gambol/image-box',
			title: __( 'Image Box', 'gambol-builder' ),
			icon: 'image-box',
			description: __( 'Image with text content', 'gambol-builder' ),
			keywords: ['image', 'box', 'card'],
			category: 'content',
		},
		{
			name: 'gambol/icon-box',
			title: __( 'Icon Box', 'gambol-builder' ),
			icon: 'icon-box',
			description: __( 'Icon with heading and text', 'gambol-builder' ),
			keywords: ['icon', 'box', 'feature'],
			category: 'content',
		},
		{
			name: 'gambol/counter',
			title: __( 'Counter', 'gambol-builder' ),
			icon: 'counter',
			description: __( 'Animated number counter', 'gambol-builder' ),
			keywords: ['counter', 'number', 'stats'],
			category: 'content',
		},
		{
			name: 'gambol/testimonial',
			title: __( 'Testimonial', 'gambol-builder' ),
			icon: 'testimonial',
			description: __( 'Customer testimonial card', 'gambol-builder' ),
			keywords: ['testimonial', 'review', 'quote'],
			category: 'content',
		},
		{
			name: 'gambol/testimonial-carousel',
			title: __( 'Testimonial Carousel', 'gambol-builder' ),
			icon: 'testimonial',
			description: __( 'Sliding testimonials', 'gambol-builder' ),
			keywords: ['testimonial', 'slider', 'carousel'],
			category: 'content',
		},
		{
			name: 'gambol/star-rating',
			title: __( 'Star Rating', 'gambol-builder' ),
			icon: 'star-rating',
			description: __( 'Display star ratings', 'gambol-builder' ),
			keywords: ['rating', 'stars', 'review'],
			category: 'content',
		},
		{
			name: 'gambol/progress-bar',
			title: __( 'Progress Bar', 'gambol-builder' ),
			icon: 'progress-bar',
			description: __( 'Animated progress bar', 'gambol-builder' ),
			keywords: ['progress', 'bar', 'skill'],
			category: 'content',
		},
	],
	
	// =========================================================================
	// INTERACTIVE BLOCKS
	// =========================================================================
	interactive: [
		{
			name: 'gambol/tabs',
			title: __( 'Tabs', 'gambol-builder' ),
			icon: 'tabs',
			description: __( 'Tabbed content panels', 'gambol-builder' ),
			keywords: ['tabs', 'tabbed', 'panels'],
			category: 'interactive',
		},
		{
			name: 'gambol/accordion',
			title: __( 'Accordion', 'gambol-builder' ),
			icon: 'accordion',
			description: __( 'Collapsible content sections', 'gambol-builder' ),
			keywords: ['accordion', 'collapse', 'faq'],
			category: 'interactive',
		},
		{
			name: 'gambol/toggle',
			title: __( 'Toggle', 'gambol-builder' ),
			icon: 'toggle',
			description: __( 'Toggle switch content', 'gambol-builder' ),
			keywords: ['toggle', 'switch', 'show', 'hide'],
			category: 'interactive',
		},
		{
			name: 'gambol/popup',
			title: __( 'Popup', 'gambol-builder' ),
			icon: 'popup',
			description: __( 'Modal popup builder', 'gambol-builder' ),
			keywords: ['popup', 'modal', 'dialog', 'lightbox'],
			category: 'interactive',
		},
	],
	
	// =========================================================================
	// SOCIAL BLOCKS
	// =========================================================================
	social: [
		{
			name: 'gambol/social-icons',
			title: __( 'Social Icons', 'gambol-builder' ),
			icon: 'social-icons',
			description: __( 'Social media icon links', 'gambol-builder' ),
			keywords: ['social', 'icons', 'facebook', 'twitter'],
			category: 'social',
		},
		{
			name: 'gambol/share-buttons',
			title: __( 'Share Buttons', 'gambol-builder' ),
			icon: 'share-buttons',
			description: __( 'Social sharing buttons', 'gambol-builder' ),
			keywords: ['share', 'social', 'buttons'],
			category: 'social',
		},
	],
	
	// =========================================================================
	// THEME ELEMENTS
	// =========================================================================
	theme: [
		{
			name: 'gambol/site-logo',
			title: __( 'Site Logo', 'gambol-builder' ),
			icon: 'site-logo',
			description: __( 'Display site logo', 'gambol-builder' ),
			keywords: ['logo', 'site', 'brand'],
			category: 'theme',
		},
		{
			name: 'gambol/site-title',
			title: __( 'Site Title', 'gambol-builder' ),
			icon: 'site-title',
			description: __( 'Display site name', 'gambol-builder' ),
			keywords: ['title', 'site', 'name'],
			category: 'theme',
		},
		{
			name: 'gambol/page-title',
			title: __( 'Page Title', 'gambol-builder' ),
			icon: 'heading',
			description: __( 'Dynamic page/post title', 'gambol-builder' ),
			keywords: ['page', 'title', 'dynamic'],
			category: 'theme',
		},
		{
			name: 'gambol/nav-menu',
			title: __( 'Nav Menu', 'gambol-builder' ),
			icon: 'nav-menu',
			description: __( 'Navigation menu widget', 'gambol-builder' ),
			keywords: ['menu', 'nav', 'navigation'],
			category: 'theme',
		},
		{
			name: 'gambol/search-form',
			title: __( 'Search Form', 'gambol-builder' ),
			icon: 'search-form',
			description: __( 'Site search form', 'gambol-builder' ),
			keywords: ['search', 'form', 'find'],
			category: 'theme',
		},
		{
			name: 'gambol/breadcrumbs',
			title: __( 'Breadcrumbs', 'gambol-builder' ),
			icon: 'breadcrumbs',
			description: __( 'Navigation breadcrumbs', 'gambol-builder' ),
			keywords: ['breadcrumbs', 'navigation', 'path'],
			category: 'theme',
		},
		{
			name: 'gambol/author-box',
			title: __( 'Author Box', 'gambol-builder' ),
			icon: 'author-box',
			description: __( 'Post author information', 'gambol-builder' ),
			keywords: ['author', 'bio', 'profile'],
			category: 'theme',
		},
		{
			name: 'gambol/post-navigation',
			title: __( 'Post Navigation', 'gambol-builder' ),
			icon: 'breadcrumbs',
			description: __( 'Previous/next post links', 'gambol-builder' ),
			keywords: ['navigation', 'post', 'prev', 'next'],
			category: 'theme',
		},
		{
			name: 'gambol/comments',
			title: __( 'Comments', 'gambol-builder' ),
			icon: 'testimonial',
			description: __( 'Post comments section', 'gambol-builder' ),
			keywords: ['comments', 'discussion', 'replies'],
			category: 'theme',
		},
		{
			name: 'gambol/sitemap',
			title: __( 'Sitemap', 'gambol-builder' ),
			icon: 'sitemap',
			description: __( 'HTML sitemap page', 'gambol-builder' ),
			keywords: ['sitemap', 'pages', 'structure'],
			category: 'theme',
		},
	],
	
	// =========================================================================
	// POSTS & ARCHIVE BLOCKS
	// =========================================================================
	posts: [
		{
			name: 'gambol/posts',
			title: __( 'Posts', 'gambol-builder' ),
			icon: 'posts',
			description: __( 'Display blog posts grid', 'gambol-builder' ),
			keywords: ['posts', 'blog', 'articles'],
			category: 'posts',
		},
		{
			name: 'gambol/loop-grid',
			title: __( 'Loop Grid', 'gambol-builder' ),
			icon: 'loop-grid',
			description: __( 'Custom post type grid', 'gambol-builder' ),
			keywords: ['loop', 'grid', 'posts', 'cpt'],
			category: 'posts',
		},
		{
			name: 'gambol/loop-carousel',
			title: __( 'Loop Carousel', 'gambol-builder' ),
			icon: 'image-carousel',
			description: __( 'Posts in carousel slider', 'gambol-builder' ),
			keywords: ['loop', 'carousel', 'slider'],
			category: 'posts',
		},
		{
			name: 'gambol/post-title',
			title: __( 'Post Title', 'gambol-builder' ),
			icon: 'post-title',
			description: __( 'Dynamic post title', 'gambol-builder' ),
			keywords: ['post', 'title', 'dynamic'],
			category: 'posts',
		},
		{
			name: 'gambol/post-content',
			title: __( 'Post Content', 'gambol-builder' ),
			icon: 'text',
			description: __( 'Display post content', 'gambol-builder' ),
			keywords: ['post', 'content', 'body'],
			category: 'posts',
		},
		{
			name: 'gambol/post-excerpt',
			title: __( 'Post Excerpt', 'gambol-builder' ),
			icon: 'text',
			description: __( 'Post excerpt/summary', 'gambol-builder' ),
			keywords: ['excerpt', 'summary', 'teaser'],
			category: 'posts',
		},
		{
			name: 'gambol/featured-image',
			title: __( 'Featured Image', 'gambol-builder' ),
			icon: 'featured-image',
			description: __( 'Post featured image', 'gambol-builder' ),
			keywords: ['featured', 'image', 'thumbnail'],
			category: 'posts',
		},
		{
			name: 'gambol/portfolio',
			title: __( 'Portfolio', 'gambol-builder' ),
			icon: 'portfolio',
			description: __( 'Portfolio/project grid', 'gambol-builder' ),
			keywords: ['portfolio', 'projects', 'gallery'],
			category: 'posts',
		},
	],
	
	// =========================================================================
	// WOOCOMMERCE BLOCKS
	// =========================================================================
	woocommerce: [
		{
			name: 'gambol/products',
			title: __( 'Products', 'gambol-builder' ),
			icon: 'products',
			description: __( 'WooCommerce products grid', 'gambol-builder' ),
			keywords: ['products', 'shop', 'woocommerce'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/product-title',
			title: __( 'Product Title', 'gambol-builder' ),
			icon: 'heading',
			description: __( 'Single product title', 'gambol-builder' ),
			keywords: ['product', 'title', 'name'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/product-price',
			title: __( 'Product Price', 'gambol-builder' ),
			icon: 'counter',
			description: __( 'Product price display', 'gambol-builder' ),
			keywords: ['product', 'price', 'cost'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/product-image',
			title: __( 'Product Image', 'gambol-builder' ),
			icon: 'image',
			description: __( 'Product image gallery', 'gambol-builder' ),
			keywords: ['product', 'image', 'gallery'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/product-rating',
			title: __( 'Product Rating', 'gambol-builder' ),
			icon: 'star-rating',
			description: __( 'Product star rating', 'gambol-builder' ),
			keywords: ['product', 'rating', 'stars'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/add-to-cart',
			title: __( 'Add to Cart', 'gambol-builder' ),
			icon: 'add-to-cart',
			description: __( 'Add to cart button', 'gambol-builder' ),
			keywords: ['cart', 'add', 'buy'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/product-short-description',
			title: __( 'Short Description', 'gambol-builder' ),
			icon: 'text',
			description: __( 'Product short description', 'gambol-builder' ),
			keywords: ['product', 'description', 'short'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/product-meta',
			title: __( 'Product Meta', 'gambol-builder' ),
			icon: 'icon-list',
			description: __( 'SKU, categories, tags', 'gambol-builder' ),
			keywords: ['product', 'meta', 'sku'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/product-stock',
			title: __( 'Product Stock', 'gambol-builder' ),
			icon: 'alert',
			description: __( 'Stock availability status', 'gambol-builder' ),
			keywords: ['stock', 'availability', 'inventory'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/product-tabs',
			title: __( 'Product Tabs', 'gambol-builder' ),
			icon: 'tabs',
			description: __( 'Product description tabs', 'gambol-builder' ),
			keywords: ['product', 'tabs', 'description'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/product-related',
			title: __( 'Related Products', 'gambol-builder' ),
			icon: 'products',
			description: __( 'Related products grid', 'gambol-builder' ),
			keywords: ['related', 'products', 'similar'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/product-upsells',
			title: __( 'Upsell Products', 'gambol-builder' ),
			icon: 'products',
			description: __( 'Upsell products section', 'gambol-builder' ),
			keywords: ['upsell', 'products', 'upgrade'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/cart',
			title: __( 'Cart', 'gambol-builder' ),
			icon: 'cart',
			description: __( 'Shopping cart table', 'gambol-builder' ),
			keywords: ['cart', 'shopping', 'checkout'],
			category: 'woocommerce',
		},
		{
			name: 'gambol/mini-cart',
			title: __( 'Mini Cart', 'gambol-builder' ),
			icon: 'mini-cart',
			description: __( 'Compact cart widget', 'gambol-builder' ),
			keywords: ['cart', 'mini', 'widget'],
			category: 'woocommerce',
		},
	],
	
	// =========================================================================
	// MARKETING BLOCKS
	// =========================================================================
	marketing: [
		{
			name: 'gambol/form',
			title: __( 'Form', 'gambol-builder' ),
			icon: 'form',
			description: __( 'Contact form builder', 'gambol-builder' ),
			keywords: ['form', 'contact', 'input'],
			category: 'marketing',
		},
		{
			name: 'gambol/login',
			title: __( 'Login Form', 'gambol-builder' ),
			icon: 'login',
			description: __( 'User login form', 'gambol-builder' ),
			keywords: ['login', 'signin', 'user'],
			category: 'marketing',
		},
		{
			name: 'gambol/subscribe',
			title: __( 'Subscribe', 'gambol-builder' ),
			icon: 'form',
			description: __( 'Newsletter subscription', 'gambol-builder' ),
			keywords: ['subscribe', 'newsletter', 'email'],
			category: 'marketing',
		},
		{
			name: 'gambol/countdown',
			title: __( 'Countdown', 'gambol-builder' ),
			icon: 'countdown',
			description: __( 'Countdown timer', 'gambol-builder' ),
			keywords: ['countdown', 'timer', 'deadline'],
			category: 'marketing',
		},
		{
			name: 'gambol/call-to-action',
			title: __( 'Call to Action', 'gambol-builder' ),
			icon: 'call-to-action',
			description: __( 'CTA section with button', 'gambol-builder' ),
			keywords: ['cta', 'action', 'banner'],
			category: 'marketing',
		},
	],
	
	// =========================================================================
	// PRO / ADVANCED BLOCKS
	// =========================================================================
	pro: [
		{
			name: 'gambol/pricing-table',
			title: __( 'Pricing Table', 'gambol-builder' ),
			icon: 'pricing-table',
			description: __( 'Pricing comparison table', 'gambol-builder' ),
			keywords: ['pricing', 'table', 'plans'],
			category: 'pro',
		},
		{
			name: 'gambol/table',
			title: __( 'Table', 'gambol-builder' ),
			icon: 'table',
			description: __( 'Advanced data table', 'gambol-builder' ),
			keywords: ['table', 'data', 'grid'],
			category: 'pro',
		},
		{
			name: 'gambol/table-of-contents',
			title: __( 'Table of Contents', 'gambol-builder' ),
			icon: 'table-of-contents',
			description: __( 'Auto-generated TOC', 'gambol-builder' ),
			keywords: ['toc', 'contents', 'headings'],
			category: 'pro',
		},
	],
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get all blocks as a flat array for search.
 *
 * @return {Array} Flat array of all block definitions.
 */
export const getAllBlocks = () => {
	return Object.values( GAMBOL_BLOCKS ).flat();
};

/**
 * Get only enabled blocks (not disabled).
 *
 * @return {Array} Flat array of enabled block definitions.
 */
export const getEnabledBlocks = () => {
	return getAllBlocks().filter( ( block ) => ! block.disabled );
};

/**
 * Get block names only.
 *
 * @param {boolean} enabledOnly - Only return enabled blocks.
 * @return {Array} Array of block name strings.
 */
export const getBlockNames = ( enabledOnly = true ) => {
	const blocks = enabledOnly ? getEnabledBlocks() : getAllBlocks();
	return blocks.map( ( block ) => block.name );
};

/**
 * Search blocks by query string.
 * Matches against title, description, and keywords.
 *
 * @param {string} query - Search query.
 * @return {Object} Filtered blocks organized by category.
 */
export const searchBlocks = ( query ) => {
	if ( ! query || query.trim() === '' ) {
		return GAMBOL_BLOCKS;
	}

	const normalizedQuery = query.toLowerCase().trim();
	const results = {};

	Object.entries( GAMBOL_BLOCKS ).forEach( ( [ category, blocks ] ) => {
		const filtered = blocks.filter( ( block ) => {
			const titleMatch = block.title.toLowerCase().includes( normalizedQuery );
			const descMatch = block.description.toLowerCase().includes( normalizedQuery );
			const keywordMatch = block.keywords?.some( ( kw ) =>
				kw.toLowerCase().includes( normalizedQuery )
			);
			return titleMatch || descMatch || keywordMatch;
		} );

		if ( filtered.length > 0 ) {
			results[ category ] = filtered;
		}
	} );

	return results;
};

/**
 * Get block by name.
 *
 * @param {string} blockName - Block name (e.g., 'gambol/section').
 * @return {Object|null} Block definition or null.
 */
export const getBlockByName = ( blockName ) => {
	return getAllBlocks().find( ( block ) => block.name === blockName ) || null;
};

/**
 * Get blocks by category.
 *
 * @param {string} categoryId - Category ID.
 * @return {Array} Array of block definitions.
 */
export const getBlocksByCategory = ( categoryId ) => {
	return GAMBOL_BLOCKS[ categoryId ] || [];
};

/**
 * Get category by ID.
 *
 * @param {string} categoryId - Category ID.
 * @return {Object|null} Category definition or null.
 */
export const getCategoryById = ( categoryId ) => {
	return BLOCK_CATEGORIES.find( ( cat ) => cat.id === categoryId ) || null;
};

// =============================================================================
// PROGRAMMATIC BLOCK INSERTION API
// =============================================================================

/**
 * Insertion result object.
 * @typedef {Object} InsertionResult
 * @property {boolean} success - Whether insertion was successful.
 * @property {string|null} clientId - The client ID of the inserted block.
 * @property {string|null} error - Error message if insertion failed.
 */

/**
 * Check if a block type is registered.
 *
 * @param {string} blockName - Block name.
 * @return {boolean} True if registered.
 */
export const isBlockRegistered = ( blockName ) => {
	return !! getBlockType( blockName );
};

/**
 * Get the current block insertion point.
 *
 * @return {Object} Insertion point with index and rootClientId.
 */
export const getInsertionPoint = () => {
	const { getBlockInsertionPoint } = select( 'core/block-editor' );
	return getBlockInsertionPoint();
};

/**
 * Get the currently selected block.
 *
 * @return {Object|null} Selected block or null.
 */
export const getSelectedBlock = () => {
	const { getSelectedBlock: selectBlock } = select( 'core/block-editor' );
	return selectBlock();
};

/**
 * Insert a block by name at the current insertion point.
 *
 * @param {string} blockName - Block name (e.g., 'gambol/section').
 * @param {Object} attributes - Optional attributes to set.
 * @param {Object} options - Insertion options.
 * @param {number} options.index - Specific index to insert at.
 * @param {string} options.rootClientId - Parent block client ID.
 * @param {boolean} options.selectBlock - Whether to select the block after insertion.
 * @return {InsertionResult} Result object.
 */
export const insertBlock = ( blockName, attributes = {}, options = {} ) => {
	const {
		index = null,
		rootClientId = null,
		selectBlock: shouldSelect = true,
	} = options;

	// Check if block is registered
	if ( ! isBlockRegistered( blockName ) ) {
		return {
			success: false,
			clientId: null,
			error: `Block "${ blockName }" is not registered.`,
		};
	}

	// Get block definition for default attributes
	const blockDef = getBlockByName( blockName );
	const defaultAttrs = blockDef?.defaultAttributes || {};
	const mergedAttrs = { ...defaultAttrs, ...attributes };

	// Create the block
	const block = createBlock( blockName, mergedAttrs );

	// Determine insertion point
	const insertionPoint = getInsertionPoint();
	const insertIndex = index !== null ? index : insertionPoint.index;
	const insertRootId = rootClientId !== null ? rootClientId : insertionPoint.rootClientId;

	// Insert the block
	const { insertBlock: doInsert, selectBlock: doSelect } = dispatch( 'core/block-editor' );

	try {
		doInsert( block, insertIndex, insertRootId, shouldSelect );

		return {
			success: true,
			clientId: block.clientId,
			error: null,
		};
	} catch ( error ) {
		return {
			success: false,
			clientId: null,
			error: error.message || 'Failed to insert block.',
		};
	}
};

/**
 * Insert a block after the currently selected block.
 *
 * @param {string} blockName - Block name.
 * @param {Object} attributes - Optional attributes.
 * @return {InsertionResult} Result object.
 */
export const insertBlockAfterSelected = ( blockName, attributes = {} ) => {
	const { getSelectedBlockClientId, getBlockIndex, getBlockRootClientId } = select( 'core/block-editor' );
	
	const selectedId = getSelectedBlockClientId();
	
	if ( ! selectedId ) {
		// No selection, insert at end
		return insertBlock( blockName, attributes );
	}

	const index = getBlockIndex( selectedId );
	const rootClientId = getBlockRootClientId( selectedId );

	return insertBlock( blockName, attributes, {
		index: index + 1,
		rootClientId,
	} );
};

/**
 * Insert a block as a child of the selected block.
 *
 * @param {string} blockName - Block name.
 * @param {Object} attributes - Optional attributes.
 * @return {InsertionResult} Result object.
 */
export const insertBlockAsChild = ( blockName, attributes = {} ) => {
	const { getSelectedBlockClientId, getBlockOrder } = select( 'core/block-editor' );
	
	const selectedId = getSelectedBlockClientId();
	
	if ( ! selectedId ) {
		return {
			success: false,
			clientId: null,
			error: 'No block selected to insert into.',
		};
	}

	const childrenCount = getBlockOrder( selectedId ).length;

	return insertBlock( blockName, attributes, {
		index: childrenCount,
		rootClientId: selectedId,
	} );
};

/**
 * Insert multiple blocks at once.
 *
 * @param {Array} blocks - Array of block definitions { name, attributes }.
 * @param {Object} options - Insertion options.
 * @return {Array<InsertionResult>} Array of result objects.
 */
export const insertBlocks = ( blocks, options = {} ) => {
	return blocks.map( ( { name, attributes = {} } ) => {
		return insertBlock( name, attributes, options );
	} );
};

/**
 * Replace the selected block with a new block.
 *
 * @param {string} blockName - Block name.
 * @param {Object} attributes - Optional attributes.
 * @return {InsertionResult} Result object.
 */
export const replaceSelectedBlock = ( blockName, attributes = {} ) => {
	const { getSelectedBlockClientId } = select( 'core/block-editor' );
	const { replaceBlock } = dispatch( 'core/block-editor' );

	const selectedId = getSelectedBlockClientId();

	if ( ! selectedId ) {
		return {
			success: false,
			clientId: null,
			error: 'No block selected to replace.',
		};
	}

	if ( ! isBlockRegistered( blockName ) ) {
		return {
			success: false,
			clientId: null,
			error: `Block "${ blockName }" is not registered.`,
		};
	}

	const blockDef = getBlockByName( blockName );
	const defaultAttrs = blockDef?.defaultAttributes || {};
	const mergedAttrs = { ...defaultAttrs, ...attributes };

	const block = createBlock( blockName, mergedAttrs );

	try {
		replaceBlock( selectedId, block );

		return {
			success: true,
			clientId: block.clientId,
			error: null,
		};
	} catch ( error ) {
		return {
			success: false,
			clientId: null,
			error: error.message || 'Failed to replace block.',
		};
	}
};

/**
 * Select a block by client ID.
 *
 * @param {string} clientId - Block client ID.
 */
export const selectBlockById = ( clientId ) => {
	const { selectBlock: doSelect } = dispatch( 'core/block-editor' );
	doSelect( clientId );
};

/**
 * Remove a block by client ID.
 *
 * @param {string} clientId - Block client ID.
 */
export const removeBlock = ( clientId ) => {
	const { removeBlock: doRemove } = dispatch( 'core/block-editor' );
	doRemove( clientId );
};

/**
 * Duplicate the selected block.
 *
 * @return {InsertionResult} Result object.
 */
export const duplicateSelectedBlock = () => {
	const { getSelectedBlockClientId, getBlock, getBlockIndex, getBlockRootClientId } = select( 'core/block-editor' );
	const { insertBlock: doInsert } = dispatch( 'core/block-editor' );

	const selectedId = getSelectedBlockClientId();

	if ( ! selectedId ) {
		return {
			success: false,
			clientId: null,
			error: 'No block selected to duplicate.',
		};
	}

	const originalBlock = getBlock( selectedId );
	const duplicatedBlock = createBlock(
		originalBlock.name,
		{ ...originalBlock.attributes },
		originalBlock.innerBlocks.map( ( inner ) => 
			createBlock( inner.name, { ...inner.attributes }, inner.innerBlocks )
		)
	);

	const index = getBlockIndex( selectedId );
	const rootClientId = getBlockRootClientId( selectedId );

	try {
		doInsert( duplicatedBlock, index + 1, rootClientId, true );

		return {
			success: true,
			clientId: duplicatedBlock.clientId,
			error: null,
		};
	} catch ( error ) {
		return {
			success: false,
			clientId: null,
			error: error.message || 'Failed to duplicate block.',
		};
	}
};

// =============================================================================
// BLOCK PRESET TEMPLATES
// =============================================================================

/**
 * Preset block templates for quick insertion.
 */
export const BLOCK_PRESETS = {
	'hero-section': {
		name: __( 'Hero Section', 'gambol-builder' ),
		description: __( 'Full-width hero with heading and CTA', 'gambol-builder' ),
		blocks: [
			{
				name: 'gambol/section',
				innerBlocks: [
					{
						name: 'gambol/container',
						innerBlocks: [
							{ name: 'gambol/heading', attributes: { level: 1, content: 'Welcome to Our Site' } },
							{ name: 'gambol/text', attributes: { content: 'Discover amazing features and possibilities.' } },
							{ name: 'gambol/button', attributes: { text: 'Get Started', url: '#' } },
						],
					},
				],
			},
		],
	},
	'content-section': {
		name: __( 'Content Section', 'gambol-builder' ),
		description: __( 'Section with heading and text', 'gambol-builder' ),
		blocks: [
			{
				name: 'gambol/section',
				innerBlocks: [
					{
						name: 'gambol/container',
						innerBlocks: [
							{ name: 'gambol/heading', attributes: { level: 2 } },
							{ name: 'gambol/text' },
						],
					},
				],
			},
		],
	},
	'cta-section': {
		name: __( 'Call to Action', 'gambol-builder' ),
		description: __( 'Prominent CTA with button', 'gambol-builder' ),
		blocks: [
			{
				name: 'gambol/section',
				innerBlocks: [
					{
						name: 'gambol/container',
						innerBlocks: [
							{ name: 'gambol/heading', attributes: { level: 2, content: 'Ready to Get Started?' } },
							{ name: 'gambol/button', attributes: { text: 'Contact Us', url: '#contact' } },
						],
					},
				],
			},
		],
	},
};

/**
 * Insert a preset template.
 *
 * @param {string} presetId - Preset template ID.
 * @return {InsertionResult} Result object.
 */
export const insertPreset = ( presetId ) => {
	const preset = BLOCK_PRESETS[ presetId ];

	if ( ! preset ) {
		return {
			success: false,
			clientId: null,
			error: `Preset "${ presetId }" not found.`,
		};
	}

	const createBlockFromTemplate = ( template ) => {
		const innerBlocks = ( template.innerBlocks || [] ).map( createBlockFromTemplate );
		return createBlock( template.name, template.attributes || {}, innerBlocks );
	};

	const { insertBlocks: doInsertBlocks } = dispatch( 'core/block-editor' );
	const blocks = preset.blocks.map( createBlockFromTemplate );
	const insertionPoint = getInsertionPoint();

	try {
		doInsertBlocks( blocks, insertionPoint.index, insertionPoint.rootClientId, true );

		return {
			success: true,
			clientId: blocks[ 0 ]?.clientId || null,
			error: null,
		};
	} catch ( error ) {
		return {
			success: false,
			clientId: null,
			error: error.message || 'Failed to insert preset.',
		};
	}
};

export default GAMBOL_BLOCKS;
