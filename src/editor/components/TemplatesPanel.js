/**
 * Gambol Builder - Templates Panel Component
 * 
 * Pre-built templates and patterns for quick page building.
 *
 * @package GambolBuilder
 */

import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Template Categories
 */
const TEMPLATE_CATEGORIES = [
	{ id: 'all', label: __( 'All', 'gambol-builder' ) },
	{ id: 'hero', label: __( 'Hero', 'gambol-builder' ) },
	{ id: 'features', label: __( 'Features', 'gambol-builder' ) },
	{ id: 'content', label: __( 'Content', 'gambol-builder' ) },
	{ id: 'cta', label: __( 'CTA', 'gambol-builder' ) },
	{ id: 'footer', label: __( 'Footer', 'gambol-builder' ) },
];

/**
 * Pre-built Templates
 */
const TEMPLATES = [
	{
		id: 'hero-centered',
		name: __( 'Centered Hero', 'gambol-builder' ),
		category: 'hero',
		thumbnail: '🎯',
		blocks: [
			{
				name: 'gambol/section',
				attributes: { backgroundColor: '#f8f9fa', paddingTop: '100px', paddingBottom: '100px' },
				innerBlocks: [
					{
						name: 'gambol/container',
						attributes: { textAlign: 'center', maxWidth: '800px' },
						innerBlocks: [
							{ name: 'gambol/heading', attributes: { level: 1, content: 'Welcome to Your Website' } },
							{ name: 'gambol/text', attributes: { content: 'Create stunning web pages with Gambol Builder. Drag, drop, and design your perfect site.' } },
							{ name: 'gambol/spacer', attributes: { height: '30px' } },
							{ name: 'gambol/button', attributes: { text: 'Get Started', size: 'large' } },
						],
					},
				],
			},
		],
	},
	{
		id: 'hero-split',
		name: __( 'Split Hero', 'gambol-builder' ),
		category: 'hero',
		thumbnail: '⬛',
		blocks: [
			{
				name: 'gambol/section',
				attributes: {},
				innerBlocks: [
					{
						name: 'gambol/grid',
						attributes: { columns: 2, gap: '40px' },
						innerBlocks: [
							{
								name: 'gambol/container',
								innerBlocks: [
									{ name: 'gambol/heading', attributes: { level: 1, content: 'Build Amazing Websites' } },
									{ name: 'gambol/text', attributes: { content: 'The most powerful page builder for WordPress.' } },
									{ name: 'gambol/button', attributes: { text: 'Learn More' } },
								],
							},
							{
								name: 'gambol/container',
								innerBlocks: [
									{ name: 'gambol/image', attributes: { url: '', alt: 'Hero Image' } },
								],
							},
						],
					},
				],
			},
		],
	},
	{
		id: 'features-grid',
		name: __( 'Features Grid', 'gambol-builder' ),
		category: 'features',
		thumbnail: '🔲',
		blocks: [
			{
				name: 'gambol/section',
				attributes: { paddingTop: '80px', paddingBottom: '80px' },
				innerBlocks: [
					{
						name: 'gambol/container',
						attributes: { textAlign: 'center', marginBottom: '50px' },
						innerBlocks: [
							{ name: 'gambol/heading', attributes: { level: 2, content: 'Our Features' } },
							{ name: 'gambol/text', attributes: { content: 'Everything you need to build beautiful websites.' } },
						],
					},
					{
						name: 'gambol/grid',
						attributes: { columns: 3, gap: '30px' },
						innerBlocks: [
							{
								name: 'gambol/icon-box',
								attributes: { icon: 'star', title: 'Feature One', description: 'Description of this amazing feature.' },
							},
							{
								name: 'gambol/icon-box',
								attributes: { icon: 'heart', title: 'Feature Two', description: 'Description of this amazing feature.' },
							},
							{
								name: 'gambol/icon-box',
								attributes: { icon: 'check', title: 'Feature Three', description: 'Description of this amazing feature.' },
							},
						],
					},
				],
			},
		],
	},
	{
		id: 'testimonials-slider',
		name: __( 'Testimonials', 'gambol-builder' ),
		category: 'content',
		thumbnail: '💬',
		blocks: [
			{
				name: 'gambol/section',
				attributes: { backgroundColor: '#1a1a1a', paddingTop: '80px', paddingBottom: '80px' },
				innerBlocks: [
					{
						name: 'gambol/container',
						attributes: { textAlign: 'center', maxWidth: '800px' },
						innerBlocks: [
							{ name: 'gambol/heading', attributes: { level: 2, content: 'What Our Clients Say', color: '#ffffff' } },
							{ name: 'gambol/spacer', attributes: { height: '40px' } },
							{ name: 'gambol/testimonial-carousel', attributes: {} },
						],
					},
				],
			},
		],
	},
	{
		id: 'cta-simple',
		name: __( 'Simple CTA', 'gambol-builder' ),
		category: 'cta',
		thumbnail: '📢',
		blocks: [
			{
				name: 'gambol/call-to-action',
				attributes: {
					title: 'Ready to Get Started?',
					description: 'Join thousands of happy customers using Gambol Builder.',
					buttonText: 'Start Free Trial',
					backgroundColor: '#00d4aa',
				},
			},
		],
	},
	{
		id: 'pricing-table',
		name: __( 'Pricing Table', 'gambol-builder' ),
		category: 'content',
		thumbnail: '💰',
		blocks: [
			{
				name: 'gambol/section',
				attributes: { paddingTop: '80px', paddingBottom: '80px' },
				innerBlocks: [
					{
						name: 'gambol/container',
						attributes: { textAlign: 'center', marginBottom: '50px' },
						innerBlocks: [
							{ name: 'gambol/heading', attributes: { level: 2, content: 'Choose Your Plan' } },
						],
					},
					{
						name: 'gambol/grid',
						attributes: { columns: 3, gap: '30px' },
						innerBlocks: [
							{ name: 'gambol/pricing-table', attributes: { planName: 'Basic', price: '$9', period: '/month' } },
							{ name: 'gambol/pricing-table', attributes: { planName: 'Pro', price: '$29', period: '/month', isFeatured: true } },
							{ name: 'gambol/pricing-table', attributes: { planName: 'Enterprise', price: '$99', period: '/month' } },
						],
					},
				],
			},
		],
	},
	{
		id: 'contact-section',
		name: __( 'Contact Section', 'gambol-builder' ),
		category: 'content',
		thumbnail: '📧',
		blocks: [
			{
				name: 'gambol/section',
				attributes: { paddingTop: '80px', paddingBottom: '80px' },
				innerBlocks: [
					{
						name: 'gambol/grid',
						attributes: { columns: 2, gap: '50px' },
						innerBlocks: [
							{
								name: 'gambol/container',
								innerBlocks: [
									{ name: 'gambol/heading', attributes: { level: 2, content: 'Get In Touch' } },
									{ name: 'gambol/text', attributes: { content: 'We would love to hear from you. Send us a message!' } },
									{ name: 'gambol/icon-list', attributes: {} },
								],
							},
							{
								name: 'gambol/container',
								innerBlocks: [
									{ name: 'gambol/form', attributes: {} },
								],
							},
						],
					},
				],
			},
		],
	},
	{
		id: 'footer-simple',
		name: __( 'Simple Footer', 'gambol-builder' ),
		category: 'footer',
		thumbnail: '📋',
		blocks: [
			{
				name: 'gambol/section',
				attributes: { backgroundColor: '#1a1a1a', paddingTop: '60px', paddingBottom: '40px' },
				innerBlocks: [
					{
						name: 'gambol/grid',
						attributes: { columns: 4, gap: '30px' },
						innerBlocks: [
							{
								name: 'gambol/container',
								innerBlocks: [
									{ name: 'gambol/site-logo', attributes: {} },
									{ name: 'gambol/text', attributes: { content: 'Building the future of web design.', color: '#999' } },
								],
							},
							{
								name: 'gambol/container',
								innerBlocks: [
									{ name: 'gambol/heading', attributes: { level: 4, content: 'Quick Links', color: '#fff' } },
									{ name: 'gambol/nav-menu', attributes: { orientation: 'vertical' } },
								],
							},
							{
								name: 'gambol/container',
								innerBlocks: [
									{ name: 'gambol/heading', attributes: { level: 4, content: 'Resources', color: '#fff' } },
									{ name: 'gambol/nav-menu', attributes: { orientation: 'vertical' } },
								],
							},
							{
								name: 'gambol/container',
								innerBlocks: [
									{ name: 'gambol/heading', attributes: { level: 4, content: 'Follow Us', color: '#fff' } },
									{ name: 'gambol/social-icons', attributes: {} },
								],
							},
						],
					},
					{ name: 'gambol/divider', attributes: { color: '#333', marginTop: '40px', marginBottom: '20px' } },
					{
						name: 'gambol/container',
						attributes: { textAlign: 'center' },
						innerBlocks: [
							{ name: 'gambol/text', attributes: { content: '© 2026 Your Company. All rights reserved.', color: '#666' } },
						],
					},
				],
			},
		],
	},
];

/**
 * TemplatesPanel Component
 */
const TemplatesPanel = ( { onClose } ) => {
	const [ activeCategory, setActiveCategory ] = useState( 'all' );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const { insertBlocks } = useDispatch( 'core/block-editor' );

	/**
	 * Create blocks recursively from template definition
	 */
	const createBlockFromTemplate = useCallback( ( template ) => {
		const innerBlocks = ( template.innerBlocks || [] ).map( createBlockFromTemplate );
		return createBlock( template.name, template.attributes || {}, innerBlocks );
	}, [] );

	/**
	 * Insert template blocks
	 */
	const handleInsertTemplate = useCallback( ( template ) => {
		const blocks = template.blocks.map( createBlockFromTemplate );
		insertBlocks( blocks );
		
		if ( onClose ) {
			onClose();
		}
	}, [ createBlockFromTemplate, insertBlocks, onClose ] );

	/**
	 * Filter templates by category and search
	 */
	const filteredTemplates = TEMPLATES.filter( ( template ) => {
		const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
		const matchesSearch = ! searchQuery || 
			template.name.toLowerCase().includes( searchQuery.toLowerCase() );
		return matchesCategory && matchesSearch;
	} );

	return (
		<div className="gambol-templates-panel">
			{/* Header */}
			<div className="gambol-templates__header">
				<h2 className="gambol-templates__title">
					{ __( 'Templates', 'gambol-builder' ) }
				</h2>
				{ onClose && (
					<button className="gambol-templates__close" onClick={ onClose }>
						<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				) }
			</div>

			{/* Search */}
			<div className="gambol-templates__search">
				<input
					type="text"
					placeholder={ __( 'Search templates...', 'gambol-builder' ) }
					value={ searchQuery }
					onChange={ ( e ) => setSearchQuery( e.target.value ) }
				/>
			</div>

			{/* Categories */}
			<div className="gambol-templates__categories">
				{ TEMPLATE_CATEGORIES.map( ( category ) => (
					<button
						key={ category.id }
						className={ `gambol-templates__category ${ activeCategory === category.id ? 'is-active' : '' }` }
						onClick={ () => setActiveCategory( category.id ) }
					>
						{ category.label }
					</button>
				) ) }
			</div>

			{/* Templates Grid */}
			<div className="gambol-templates__grid">
				{ filteredTemplates.map( ( template ) => (
					<button
						key={ template.id }
						className="gambol-templates__item"
						onClick={ () => handleInsertTemplate( template ) }
					>
						<div className="gambol-templates__thumbnail">
							<span className="gambol-templates__emoji">{ template.thumbnail }</span>
						</div>
						<span className="gambol-templates__name">{ template.name }</span>
					</button>
				) ) }

				{ filteredTemplates.length === 0 && (
					<div className="gambol-templates__empty">
						{ __( 'No templates found.', 'gambol-builder' ) }
					</div>
				) }
			</div>
		</div>
	);
};

export default TemplatesPanel;
