/**
 * Starter content generator and block validation tests.
 *
 * Builds the starter demo and the bundled section templates from the real
 * Gambol block registrations, then parses the markup back and fails if any
 * block would show as invalid in the editor. Also proves that markup saved by
 * older block versions still validates through the blocks' deprecations.
 *
 * Run: npm run build:library
 */
import fs from 'fs';
import path from 'path';
import { createBlock, serialize, parse, getBlockType, getSaveContent } from '@wordpress/blocks';
import '../../../src/index.js';

const ROOT = path.resolve( __dirname, '../../..' );

const writeJson = ( rel, data ) =>
	fs.writeFileSync( path.join( ROOT, rel ), JSON.stringify( data, null, '\t' ) + '\n' );

/** Collect invalid block names (recursively) from parsed markup. */
const invalidBlocks = ( html ) => {
	const invalid = [];
	const walk = ( list ) =>
		list.forEach( ( blk ) => {
			if ( blk.name && ! blk.isValid ) {
				invalid.push( blk.name );
			}
			walk( blk.innerBlocks || [] );
		} );
	walk( parse( html ) );
	return invalid;
};

const toMarkup = ( blocks, label ) => {
	const html = serialize( blocks );
	const invalid = invalidBlocks( html );
	if ( invalid.length ) {
		throw new Error( `${ label }: invalid blocks after round-trip: ${ invalid.join( ', ' ) }` );
	}
	return html;
};

const b = ( name, attrs = {}, inner = [] ) => createBlock( `gambol/${ name }`, attrs, inner );

/** Markup as an older version of a block saved it. */
const legacyMarkup = ( name, attributes, innerHtml = '' ) => {
	const type = getBlockType( name );
	const old = { ...type, save: type.deprecated[ 0 ].save };
	const full = createBlock( name, attributes ).attributes;
	const body = getSaveContent( old, full, [] );
	const withInner = innerHtml ? body.replace( /(<div class="wp-block-gambol-section__inner"[^>]*>)/, `$1${ innerHtml }` ) : body;
	const json = Object.keys( attributes ).length ? ` ${ JSON.stringify( attributes ) }` : '';
	return `<!-- wp:${ name.replace( 'core/', '' ) }${ json } -->\n${ withInner }\n<!-- /wp:${ name.replace( 'core/', '' ) } -->`;
};

// ---------------------------------------------------------------------------
// Content.
// ---------------------------------------------------------------------------
const page = ( title, text ) =>
	toMarkup(
		[
			b( 'section', {}, [
				b( 'heading', { level: 1, content: title } ),
				b( 'text', { content: text } ),
				b( 'button', { text: 'Contact us', url: '/contact/', textAlign: 'left' } ),
			] ),
		],
		title
	);

const TEMPLATES = {
	'hero-simple': {
		title: 'Simple Hero Section',
		categories: [ 'hero', 'general' ],
		tags: [ 'hero', 'banner', 'heading', 'button' ],
		blocks: () => [
			b( 'section', { backgroundType: 'color', backgroundColor: '#f8f9fa', padding: { top: 96, right: 20, bottom: 96, left: 20 } }, [
				b( 'heading', { level: 1, textAlign: 'center', content: 'Say what you do in one line' } ),
				b( 'text', { textAlign: 'center', content: 'One sentence on who it is for and why it is different.' } ),
				b( 'button', { text: 'Get in touch', url: '#contact', textAlign: 'center' } ),
			] ),
		],
	},
	'features-grid': {
		title: 'Features Grid',
		categories: [ 'features', 'general' ],
		tags: [ 'features', 'icons', 'grid', 'services' ],
		blocks: () => [
			b( 'section', { padding: { top: 80, right: 20, bottom: 80, left: 20 } }, [
				b( 'heading', { level: 2, textAlign: 'center', content: 'What you get' } ),
				b( 'grid', { columns: 3 }, [
					b( 'icon-box', { title: 'First feature', description: 'Describe what it does for the customer.' } ),
					b( 'icon-box', { title: 'Second feature', description: 'Describe what it does for the customer.' } ),
					b( 'icon-box', { title: 'Third feature', description: 'Describe what it does for the customer.' } ),
				] ),
			] ),
		],
	},
	testimonials: {
		title: 'Testimonial',
		categories: [ 'testimonials', 'general' ],
		tags: [ 'testimonials', 'social proof', 'reviews' ],
		blocks: () => [
			b( 'section', { backgroundType: 'color', backgroundColor: '#f8f9fa', padding: { top: 80, right: 20, bottom: 80, left: 20 } }, [
				b( 'heading', { level: 2, textAlign: 'center', content: 'In their words' } ),
				// Placeholder text only: replace with a real customer's words and name.
				b( 'testimonial', { content: 'Paste a real quote from a customer here.', authorName: 'Customer name', authorTitle: 'Role, company' } ),
			] ),
		],
	},
};

test( 'build the starter demo and bundled templates', () => {
	writeJson( 'includes/demo-importer/demos/starter/pages.json', [
		{ title: 'Home', content: page( 'Welcome', 'Edit this page with Gambol Builder blocks.' ), excerpt: 'Homepage.', menu_order: 0, meta: { _wp_page_template: 'gambol-full-width.php' } },
		{ title: 'About Us', content: page( 'About us', 'Tell visitors who you are and what you make.' ), excerpt: 'About page.', menu_order: 1, meta: { _wp_page_template: 'gambol-full-width.php' } },
		{ title: 'Contact', content: page( 'Contact', 'Add your email, phone and address here.' ), excerpt: 'Contact page.', menu_order: 2, meta: { _wp_page_template: 'gambol-full-width.php' } },
	] );

	writeJson( 'includes/demo-importer/demos/starter/headers.json', [
		{
			title: 'Main Header',
			content: toMarkup(
				[
					b( 'section', { tagName: 'div', padding: { top: 16, right: 20, bottom: 16, left: 20 } }, [
						b( 'inner-section', { columns: 2, verticalAlign: 'center' }, [
							b( 'column', {}, [ b( 'site-title' ) ] ),
							b( 'column', { horizontalAlign: 'flex-end' }, [ b( 'nav-menu' ) ] ),
						] ),
					] ),
				],
				'starter header'
			),
			meta: { _gambol_hf_type: 'header', _gambol_hf_active: '1', _gambol_hf_sticky: '1', _gambol_hf_sticky_offset: '0', _gambol_hf_display_on: 'global', _gambol_hf_visibility: 'all' },
		},
	] );

	writeJson( 'includes/demo-importer/demos/starter/footers.json', [
		{
			title: 'Main Footer',
			content: toMarkup(
				[
					b( 'section', { tagName: 'div', backgroundType: 'color', backgroundColor: '#1e1e1e', padding: { top: 40, right: 20, bottom: 40, left: 20 } }, [
						b( 'text', { textAlign: 'center', content: '<span style="color:#e6e6e6">© {{current_year}} {{site_name}}</span>' } ),
					] ),
				],
				'starter footer'
			),
			meta: { _gambol_hf_type: 'footer', _gambol_hf_active: '1', _gambol_hf_display_on: 'global', _gambol_hf_visibility: 'all' },
		},
	] );

	Object.entries( TEMPLATES ).forEach( ( [ slug, tpl ] ) => {
		writeJson( `includes/template-library/templates/${ slug }.json`, {
			id: `bundled-${ slug }`,
			title: tpl.title,
			type: 'section',
			categories: tpl.categories,
			thumbnail: '',
			tags: tpl.tags,
			content: toMarkup( tpl.blocks(), slug ),
		} );
	} );
} );

// ---------------------------------------------------------------------------
// Deprecations: content saved before this release must keep working.
// ---------------------------------------------------------------------------
test( 'sections saved by v1 still validate', () => {
	const html = legacyMarkup( 'gambol/section', { backgroundType: 'color', backgroundColor: '#111111' } );
	expect( invalidBlocks( html ) ).toEqual( [] );
} );

test( 'accordions saved by v1 validate and migrate their items to inner blocks', () => {
	const items = [
		{ id: 'item-a', title: 'First question', isOpen: true },
		{ id: 'item-b', title: 'Second question', isOpen: false },
	];
	const html = legacyMarkup( 'gambol/accordion', { items } );
	const [ block ] = parse( html );
	expect( block.isValid ).toBe( true );
	expect( block.innerBlocks.map( ( inner ) => inner.name ) ).toEqual( [ 'gambol/accordion-item', 'gambol/accordion-item' ] );
	expect( block.innerBlocks[ 0 ].attributes.title ).toBe( 'First question' );
} );

test( 'new accordions save their item content', () => {
	const html = toMarkup(
		[
			b( 'accordion', {}, [
				b( 'accordion-item', { itemId: 'q1', title: 'Shipping?' }, [ b( 'text', { content: 'Two days.' } ) ] ),
			] ),
		],
		'accordion'
	);
	expect( html ).toContain( 'Two days.' );
	expect( html ).toContain( 'aria-controls="content-q1"' );
} );

test( 'sections write their design settings to the frontend', () => {
	const html = toMarkup(
		[
			b( 'section', {
				backgroundType: 'color',
				backgroundColor: '#123456',
				overlayEnabled: true,
				overlayOpacity: 40,
				minHeight: 80,
				minHeightUnit: 'vh',
				borderRadius: 8,
				hideOnMobile: true,
			} ),
		],
		'section design'
	);
	expect( html ).toContain( 'background-color:#123456' );
	expect( html ).toContain( 'min-height:80vh' );
	expect( html ).toContain( 'wp-block-gambol-section__overlay' );
	expect( html ).toContain( 'gambol-hide-mobile' );
} );
