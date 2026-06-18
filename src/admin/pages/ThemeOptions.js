/**
 * Theme Options Page Component
 *
 * Tabbed settings panel covering Header, Footer, Blog, Social, Custom Code,
 * and Performance — equivalent to Avada's Theme Options.
 *
 * @package GambolBuilder
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
	Button,
	Spinner,
	Notice,
	TabPanel,
	TextControl,
	TextareaControl,
	ToggleControl,
	SelectControl,
	RangeControl,
} from '@wordpress/components';

const REST_URL = window.gambolAdmin?.restUrl || '/wp-json/gambol-builder/v1/';

/**
 * Reusable section wrapper.
 */
function Section( { title, description, children } ) {
	return (
		<div className="gambol-settings-section">
			<h3 className="gambol-settings-section__title">{ title }</h3>
			{ description && (
				<p className="gambol-settings-section__description">{ description }</p>
			) }
			<div className="gambol-settings-section__body">{ children }</div>
		</div>
	);
}

/**
 * Header Tab.
 */
function HeaderTab( { options, onChange } ) {
	const h = options.header || {};
	const set = ( key, val ) => onChange( 'header', key, val );

	return (
		<div className="gambol-tab-content">
			<Section title={ __( 'Logo', 'gambol-builder' ) }>
				<TextControl
					label={ __( 'Logo Max Height', 'gambol-builder' ) }
					help={ __( 'e.g. 60px', 'gambol-builder' ) }
					value={ h.logo_max_height || '' }
					onChange={ ( v ) => set( 'logo_max_height', v ) }
				/>
			</Section>

			<Section title={ __( 'Sticky Header', 'gambol-builder' ) }>
				<ToggleControl
					label={ __( 'Enable Sticky Header', 'gambol-builder' ) }
					checked={ !! h.sticky }
					onChange={ ( v ) => set( 'sticky', v ) }
				/>
				{ h.sticky && (
					<>
						<ToggleControl
							label={ __( 'Shrink on Scroll', 'gambol-builder' ) }
							checked={ !! h.sticky_shrink }
							onChange={ ( v ) => set( 'sticky_shrink', v ) }
						/>
						<TextControl
							label={ __( 'Sticky Offset (px)', 'gambol-builder' ) }
							type="number"
							value={ h.sticky_offset || '0' }
							onChange={ ( v ) => set( 'sticky_offset', v ) }
						/>
					</>
				) }
			</Section>

			<Section title={ __( 'Navigation', 'gambol-builder' ) }>
				<SelectControl
					label={ __( 'Nav Alignment', 'gambol-builder' ) }
					value={ h.nav_alignment || 'right' }
					options={ [
						{ label: __( 'Left',   'gambol-builder' ), value: 'left'   },
						{ label: __( 'Center', 'gambol-builder' ), value: 'center' },
						{ label: __( 'Right',  'gambol-builder' ), value: 'right'  },
					] }
					onChange={ ( v ) => set( 'nav_alignment', v ) }
				/>
				<TextControl
					label={ __( 'Mobile Breakpoint (px)', 'gambol-builder' ) }
					type="number"
					value={ h.mobile_breakpoint || '768' }
					onChange={ ( v ) => set( 'mobile_breakpoint', v ) }
				/>
			</Section>
		</div>
	);
}

/**
 * Footer Tab.
 */
function FooterTab( { options, onChange } ) {
	const f = options.footer || {};
	const set = ( key, val ) => onChange( 'footer', key, val );

	return (
		<div className="gambol-tab-content">
			<Section title={ __( 'Footer Layout', 'gambol-builder' ) }>
				<SelectControl
					label={ __( 'Widget Columns', 'gambol-builder' ) }
					value={ f.columns || '4' }
					options={ [
						{ label: '1', value: '1' },
						{ label: '2', value: '2' },
						{ label: '3', value: '3' },
						{ label: '4', value: '4' },
					] }
					onChange={ ( v ) => set( 'columns', v ) }
				/>
			</Section>

			<Section title={ __( 'Copyright', 'gambol-builder' ) }>
				<TextControl
					label={ __( 'Copyright Text', 'gambol-builder' ) }
					help={ __( 'Use {site_name} for the site name.', 'gambol-builder' ) }
					value={ f.copyright_text || '' }
					onChange={ ( v ) => set( 'copyright_text', v ) }
				/>
			</Section>

			<Section title={ __( 'Back to Top', 'gambol-builder' ) }>
				<ToggleControl
					label={ __( 'Show Back to Top Button', 'gambol-builder' ) }
					checked={ !! f.back_to_top }
					onChange={ ( v ) => set( 'back_to_top', v ) }
				/>
			</Section>
		</div>
	);
}

/**
 * Blog Tab.
 */
function BlogTab( { options, onChange } ) {
	const b = options.blog || {};
	const set = ( key, val ) => onChange( 'blog', key, val );

	return (
		<div className="gambol-tab-content">
			<Section title={ __( 'Blog Archive', 'gambol-builder' ) }>
				<SelectControl
					label={ __( 'Layout', 'gambol-builder' ) }
					value={ b.layout || 'grid' }
					options={ [
						{ label: __( 'Grid',     'gambol-builder' ), value: 'grid'     },
						{ label: __( 'List',     'gambol-builder' ), value: 'list'     },
						{ label: __( 'Masonry',  'gambol-builder' ), value: 'masonry'  },
						{ label: __( 'Timeline', 'gambol-builder' ), value: 'timeline' },
					] }
					onChange={ ( v ) => set( 'layout', v ) }
				/>
				<RangeControl
					label={ __( 'Excerpt Length (words)', 'gambol-builder' ) }
					value={ parseInt( b.excerpt_length, 10 ) || 20 }
					min={ 5 }
					max={ 100 }
					onChange={ ( v ) => set( 'excerpt_length', String( v ) ) }
				/>
				<TextControl
					label={ __( 'Read More Text', 'gambol-builder' ) }
					value={ b.read_more_text || '' }
					onChange={ ( v ) => set( 'read_more_text', v ) }
				/>
			</Section>

			<Section title={ __( 'Post Meta', 'gambol-builder' ) }>
				<ToggleControl
					label={ __( 'Show Author', 'gambol-builder' ) }
					checked={ !! b.show_author }
					onChange={ ( v ) => set( 'show_author', v ) }
				/>
				<ToggleControl
					label={ __( 'Show Date', 'gambol-builder' ) }
					checked={ !! b.show_date }
					onChange={ ( v ) => set( 'show_date', v ) }
				/>
				<ToggleControl
					label={ __( 'Show Categories', 'gambol-builder' ) }
					checked={ !! b.show_categories }
					onChange={ ( v ) => set( 'show_categories', v ) }
				/>
				<TextControl
					label={ __( 'Date Format', 'gambol-builder' ) }
					help={ __( 'PHP date format, e.g. F j, Y', 'gambol-builder' ) }
					value={ b.date_format || '' }
					onChange={ ( v ) => set( 'date_format', v ) }
				/>
			</Section>
		</div>
	);
}

/**
 * Social Tab.
 */
function SocialTab( { options, onChange } ) {
	const s = options.social || {};
	const set = ( key, val ) => onChange( 'social', key, val );

	const NETWORKS = [
		{ key: 'facebook',  label: 'Facebook'  },
		{ key: 'twitter',   label: 'Twitter / X' },
		{ key: 'instagram', label: 'Instagram' },
		{ key: 'linkedin',  label: 'LinkedIn'  },
		{ key: 'youtube',   label: 'YouTube'   },
		{ key: 'github',    label: 'GitHub'    },
		{ key: 'pinterest', label: 'Pinterest' },
		{ key: 'tiktok',    label: 'TikTok'    },
	];

	return (
		<div className="gambol-tab-content">
			<Section
				title={ __( 'Social Media Links', 'gambol-builder' ) }
				description={ __( 'Add profile URLs. Leave blank to hide.', 'gambol-builder' ) }
			>
				{ NETWORKS.map( ( { key, label } ) => (
					<TextControl
						key={ key }
						label={ label }
						type="url"
						value={ s[ key ] || '' }
						onChange={ ( v ) => set( key, v ) }
					/>
				) ) }
			</Section>
		</div>
	);
}

/**
 * Custom Code Tab.
 */
function CodeTab( { options, onChange } ) {
	const c = options.code || {};
	const set = ( key, val ) => onChange( 'code', key, val );

	return (
		<div className="gambol-tab-content">
			<Section
				title={ __( 'Head Scripts', 'gambol-builder' ) }
				description={ __( 'Code added before </head>. Accepts <script>, <link>, <style>, <meta>.', 'gambol-builder' ) }
			>
				<TextareaControl
					label={ __( 'Header Code', 'gambol-builder' ) }
					value={ c.head_scripts || '' }
					rows={ 8 }
					onChange={ ( v ) => set( 'head_scripts', v ) }
					className="gambol-code-textarea"
				/>
			</Section>

			<Section
				title={ __( 'Footer Scripts', 'gambol-builder' ) }
				description={ __( 'Code added before </body>. Accepts <script>, <link>, <style>.', 'gambol-builder' ) }
			>
				<TextareaControl
					label={ __( 'Footer Code', 'gambol-builder' ) }
					value={ c.footer_scripts || '' }
					rows={ 8 }
					onChange={ ( v ) => set( 'footer_scripts', v ) }
					className="gambol-code-textarea"
				/>
			</Section>
		</div>
	);
}

/**
 * Performance Tab.
 */
function PerformanceTab( { options, onChange } ) {
	const p = options.performance || {};
	const set = ( key, val ) => onChange( 'performance', key, val );

	return (
		<div className="gambol-tab-content">
			<Section title={ __( 'Loading', 'gambol-builder' ) }>
				<ToggleControl
					label={ __( 'Lazy Load Images', 'gambol-builder' ) }
					help={ __( 'Adds loading="lazy" to images not in the initial viewport.', 'gambol-builder' ) }
					checked={ !! p.lazy_load_images }
					onChange={ ( v ) => set( 'lazy_load_images', v ) }
				/>
				<ToggleControl
					label={ __( 'Defer Non-Critical JS', 'gambol-builder' ) }
					help={ __( 'Adds defer attribute to non-essential scripts.', 'gambol-builder' ) }
					checked={ !! p.defer_js }
					onChange={ ( v ) => set( 'defer_js', v ) }
				/>
			</Section>

			<Section
				title={ __( 'Preconnect Origins', 'gambol-builder' ) }
				description={ __( 'Comma-separated list of origins to preconnect (e.g. https://fonts.googleapis.com).', 'gambol-builder' ) }
			>
				<TextareaControl
					label={ __( 'Origins', 'gambol-builder' ) }
					value={ p.preconnect_origins || '' }
					rows={ 3 }
					onChange={ ( v ) => set( 'preconnect_origins', v ) }
				/>
			</Section>
		</div>
	);
}

/**
 * ThemeOptions Page Component.
 *
 * @return {JSX.Element}
 */
export default function ThemeOptions() {
	const [ options, setOptions ]   = useState( null );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ notice, setNotice ]     = useState( null );

	useEffect( () => {
		apiFetch( { path: 'gambol-builder/v1/theme-options' } )
			.then( ( data ) => setOptions( data ) )
			.catch( () => setNotice( { type: 'error', message: __( 'Failed to load settings.', 'gambol-builder' ) } ) );
	}, [] );

	const handleChange = useCallback( ( section, key, value ) => {
		setOptions( ( prev ) => ( {
			...prev,
			[ section ]: {
				...( prev?.[ section ] || {} ),
				[ key ]: value,
			},
		} ) );
	}, [] );

	const handleSave = async () => {
		setIsSaving( true );
		setNotice( null );
		try {
			const updated = await apiFetch( {
				path:   'gambol-builder/v1/theme-options',
				method: 'POST',
				data:   options,
			} );
			setOptions( updated );
			setNotice( { type: 'success', message: __( 'Theme options saved.', 'gambol-builder' ) } );
		} catch ( err ) {
			setNotice( { type: 'error', message: __( 'Failed to save settings.', 'gambol-builder' ) } );
		} finally {
			setIsSaving( false );
			setTimeout( () => setNotice( null ), 4000 );
		}
	};

	const TABS = [
		{ name: 'header',      title: __( 'Header',      'gambol-builder' ), className: 'gambol-admin-tab' },
		{ name: 'footer',      title: __( 'Footer',      'gambol-builder' ), className: 'gambol-admin-tab' },
		{ name: 'blog',        title: __( 'Blog',        'gambol-builder' ), className: 'gambol-admin-tab' },
		{ name: 'social',      title: __( 'Social',      'gambol-builder' ), className: 'gambol-admin-tab' },
		{ name: 'code',        title: __( 'Custom Code', 'gambol-builder' ), className: 'gambol-admin-tab' },
		{ name: 'performance', title: __( 'Performance', 'gambol-builder' ), className: 'gambol-admin-tab' },
	];

	if ( ! options ) {
		return (
			<div className="gambol-admin-page">
				<div className="gambol-admin-page__loading">
					<Spinner />
					<span>{ __( 'Loading Theme Options…', 'gambol-builder' ) }</span>
				</div>
			</div>
		);
	}

	return (
		<div className="gambol-admin-page">
			<div className="gambol-admin-page__header">
				<h1 className="gambol-admin-page__title">
					{ __( 'Theme Options', 'gambol-builder' ) }
				</h1>
				<div className="gambol-admin-page__actions">
					{ notice && (
						<Notice
							status={ notice.type }
							isDismissible={ false }
						>
							{ notice.message }
						</Notice>
					) }
					<Button
						variant="primary"
						onClick={ handleSave }
						isBusy={ isSaving }
						disabled={ isSaving }
					>
						{ isSaving
							? __( 'Saving…', 'gambol-builder' )
							: __( 'Save Changes', 'gambol-builder' ) }
					</Button>
				</div>
			</div>

			<div className="gambol-admin-page__content">
				<TabPanel
					className="gambol-admin-tabs"
					activeClass="is-active"
					tabs={ TABS }
				>
					{ ( tab ) => {
						switch ( tab.name ) {
							case 'header':
								return <HeaderTab      options={ options } onChange={ handleChange } />;
							case 'footer':
								return <FooterTab      options={ options } onChange={ handleChange } />;
							case 'blog':
								return <BlogTab        options={ options } onChange={ handleChange } />;
							case 'social':
								return <SocialTab      options={ options } onChange={ handleChange } />;
							case 'code':
								return <CodeTab        options={ options } onChange={ handleChange } />;
							case 'performance':
								return <PerformanceTab options={ options } onChange={ handleChange } />;
							default:
								return null;
						}
					} }
				</TabPanel>
			</div>
		</div>
	);
}
