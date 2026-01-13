/**
 * Global Styles Page Component
 *
 * Settings page for managing global design tokens.
 *
 * @package GambolBuilder
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Button,
	Spinner,
	Notice,
	TabPanel,
	TextControl,
	RangeControl,
	ColorPicker,
	ColorIndicator,
	Popover,
} from '@wordpress/components';

/**
 * Color Control with picker popover.
 */
function ColorControl( { label, value, onChange } ) {
	const [ isOpen, setIsOpen ] = useState( false );

	return (
		<div className="gambol-color-control">
			<label className="gambol-color-control__label">{ label }</label>
			<div className="gambol-color-control__picker">
				<button
					type="button"
					className="gambol-color-control__button"
					onClick={ () => setIsOpen( ! isOpen ) }
				>
					<ColorIndicator colorValue={ value } />
					<span className="gambol-color-control__value">{ value }</span>
				</button>
				{ isOpen && (
					<Popover
						placement="bottom-start"
						onClose={ () => setIsOpen( false ) }
						className="gambol-color-popover"
					>
						<ColorPicker
							color={ value }
							onChange={ onChange }
							enableAlpha={ false }
						/>
					</Popover>
				) }
			</div>
		</div>
	);
}

/**
 * Section wrapper component.
 */
function SettingsSection( { title, children } ) {
	return (
		<div className="gambol-settings-section">
			<h3 className="gambol-settings-section__title">{ title }</h3>
			<div className="gambol-settings-section__content">
				{ children }
			</div>
		</div>
	);
}

/**
 * Global Styles page component.
 */
export default function GlobalStyles() {
	const [ styles, setStyles ] = useState( null );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ notice, setNotice ] = useState( null );

	const restUrl = window.gambolAdmin?.restUrl || '/wp-json/gambol-builder/v1/';
	const nonce = window.gambolAdmin?.nonce || '';

	/**
	 * Fetch styles from REST API.
	 */
	const fetchStyles = useCallback( async () => {
		try {
			const response = await fetch( `${ restUrl }global-styles`, {
				headers: {
					'X-WP-Nonce': nonce,
				},
			} );
			const data = await response.json();
			setStyles( data );
		} catch ( error ) {
			setNotice( {
				type: 'error',
				message: __( 'Failed to load styles.', 'gambol-builder' ),
			} );
		} finally {
			setIsLoading( false );
		}
	}, [ restUrl, nonce ] );

	/**
	 * Save styles to REST API.
	 */
	const saveStyles = async () => {
		setIsSaving( true );
		setNotice( null );

		try {
			const response = await fetch( `${ restUrl }global-styles`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': nonce,
				},
				body: JSON.stringify( styles ),
			} );

			if ( ! response.ok ) {
				throw new Error( 'Save failed' );
			}

			setNotice( {
				type: 'success',
				message: __( 'Styles saved successfully!', 'gambol-builder' ),
			} );
		} catch ( error ) {
			setNotice( {
				type: 'error',
				message: __( 'Failed to save styles.', 'gambol-builder' ),
			} );
		} finally {
			setIsSaving( false );
		}
	};

	/**
	 * Update a style value.
	 */
	const updateStyle = ( category, key, value ) => {
		setStyles( ( prev ) => ( {
			...prev,
			[ category ]: {
				...prev[ category ],
				[ key ]: value,
			},
		} ) );
	};

	// Load styles on mount.
	useEffect( () => {
		fetchStyles();
	}, [ fetchStyles ] );

	// Show loading state.
	if ( isLoading ) {
		return (
			<div className="gambol-admin-page gambol-global-styles">
				<div className="gambol-loading">
					<Spinner />
					<p>{ __( 'Loading styles...', 'gambol-builder' ) }</p>
				</div>
			</div>
		);
	}

	// Tab definitions.
	const tabs = [
		{
			name: 'colors',
			title: __( 'Colors', 'gambol-builder' ),
			className: 'gambol-tab-colors',
		},
		{
			name: 'typography',
			title: __( 'Typography', 'gambol-builder' ),
			className: 'gambol-tab-typography',
		},
		{
			name: 'spacing',
			title: __( 'Spacing', 'gambol-builder' ),
			className: 'gambol-tab-spacing',
		},
		{
			name: 'buttons',
			title: __( 'Buttons', 'gambol-builder' ),
			className: 'gambol-tab-buttons',
		},
	];

	/**
	 * Render tab content.
	 */
	const renderTabContent = ( tab ) => {
		switch ( tab.name ) {
			case 'colors':
				return <ColorsTab styles={ styles } updateStyle={ updateStyle } />;
			case 'typography':
				return <TypographyTab styles={ styles } updateStyle={ updateStyle } />;
			case 'spacing':
				return <SpacingTab styles={ styles } updateStyle={ updateStyle } />;
			case 'buttons':
				return <ButtonsTab styles={ styles } updateStyle={ updateStyle } />;
			default:
				return null;
		}
	};

	return (
		<div className="gambol-admin-page gambol-global-styles">
			{/* Header */}
			<div className="gambol-admin-header">
				<div className="gambol-admin-header__logo">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
					</svg>
					<h1>{ __( 'Global Styles', 'gambol-builder' ) }</h1>
				</div>
				<div className="gambol-admin-header__actions">
					<Button
						variant="primary"
						onClick={ saveStyles }
						disabled={ isSaving }
					>
						{ isSaving ? __( 'Saving...', 'gambol-builder' ) : __( 'Save Changes', 'gambol-builder' ) }
					</Button>
				</div>
			</div>

			{/* Notice */}
			{ notice && (
				<Notice
					status={ notice.type }
					onRemove={ () => setNotice( null ) }
					className="gambol-notice"
				>
					{ notice.message }
				</Notice>
			) }

			{/* Description */}
			<p className="gambol-page-description">
				{ __( 'Configure global design tokens that apply to all Gambol blocks. Changes are saved as CSS variables and applied automatically.', 'gambol-builder' ) }
			</p>

			{/* Tabs */}
			<div className="gambol-settings-tabs">
				<TabPanel
					tabs={ tabs }
					className="gambol-tab-panel"
				>
					{ ( tab ) => (
						<div className="gambol-tab-content">
							{ renderTabContent( tab ) }
						</div>
					) }
				</TabPanel>
			</div>
		</div>
	);
}

/**
 * Colors Tab Component
 */
function ColorsTab( { styles, updateStyle } ) {
	const colors = styles?.colors || {};

	return (
		<>
			<SettingsSection title={ __( 'Brand Colors', 'gambol-builder' ) }>
				<div className="gambol-controls-grid">
					<ColorControl
						label={ __( 'Primary Color', 'gambol-builder' ) }
						value={ colors.primary || '#00d4aa' }
						onChange={ ( value ) => updateStyle( 'colors', 'primary', value ) }
					/>
					<ColorControl
						label={ __( 'Secondary Color', 'gambol-builder' ) }
						value={ colors.secondary || '#6366f1' }
						onChange={ ( value ) => updateStyle( 'colors', 'secondary', value ) }
					/>
				</div>
			</SettingsSection>

			<SettingsSection title={ __( 'Text Colors', 'gambol-builder' ) }>
				<div className="gambol-controls-grid">
					<ColorControl
						label={ __( 'Heading Color', 'gambol-builder' ) }
						value={ colors.heading || '#1a1a1a' }
						onChange={ ( value ) => updateStyle( 'colors', 'heading', value ) }
					/>
					<ColorControl
						label={ __( 'Text Color', 'gambol-builder' ) }
						value={ colors.text || '#4a4a4a' }
						onChange={ ( value ) => updateStyle( 'colors', 'text', value ) }
					/>
					<ColorControl
						label={ __( 'Light Text', 'gambol-builder' ) }
						value={ colors[ 'text-light' ] || '#757575' }
						onChange={ ( value ) => updateStyle( 'colors', 'text-light', value ) }
					/>
				</div>
			</SettingsSection>

			<SettingsSection title={ __( 'Background Colors', 'gambol-builder' ) }>
				<div className="gambol-controls-grid">
					<ColorControl
						label={ __( 'Background', 'gambol-builder' ) }
						value={ colors.background || '#ffffff' }
						onChange={ ( value ) => updateStyle( 'colors', 'background', value ) }
					/>
					<ColorControl
						label={ __( 'Surface', 'gambol-builder' ) }
						value={ colors.surface || '#f8f9fa' }
						onChange={ ( value ) => updateStyle( 'colors', 'surface', value ) }
					/>
					<ColorControl
						label={ __( 'Border', 'gambol-builder' ) }
						value={ colors.border || '#e0e0e0' }
						onChange={ ( value ) => updateStyle( 'colors', 'border', value ) }
					/>
				</div>
			</SettingsSection>

			<SettingsSection title={ __( 'Status Colors', 'gambol-builder' ) }>
				<div className="gambol-controls-grid">
					<ColorControl
						label={ __( 'Success', 'gambol-builder' ) }
						value={ colors.success || '#10b981' }
						onChange={ ( value ) => updateStyle( 'colors', 'success', value ) }
					/>
					<ColorControl
						label={ __( 'Warning', 'gambol-builder' ) }
						value={ colors.warning || '#f59e0b' }
						onChange={ ( value ) => updateStyle( 'colors', 'warning', value ) }
					/>
					<ColorControl
						label={ __( 'Error', 'gambol-builder' ) }
						value={ colors.error || '#ef4444' }
						onChange={ ( value ) => updateStyle( 'colors', 'error', value ) }
					/>
				</div>
			</SettingsSection>
		</>
	);
}

/**
 * Typography Tab Component
 */
function TypographyTab( { styles, updateStyle } ) {
	const typography = styles?.typography || {};

	const fontOptions = [
		{ label: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
		{ label: 'Georgia', value: 'Georgia, "Times New Roman", Times, serif' },
		{ label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
		{ label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
		{ label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
	];

	return (
		<>
			<SettingsSection title={ __( 'Font Families', 'gambol-builder' ) }>
				<TextControl
					label={ __( 'Base Font Family', 'gambol-builder' ) }
					value={ typography[ 'font-family-base' ] || '' }
					onChange={ ( value ) => updateStyle( 'typography', 'font-family-base', value ) }
					help={ __( 'Font stack for body text.', 'gambol-builder' ) }
				/>
				<TextControl
					label={ __( 'Heading Font Family', 'gambol-builder' ) }
					value={ typography[ 'font-family-heading' ] || '' }
					onChange={ ( value ) => updateStyle( 'typography', 'font-family-heading', value ) }
					help={ __( 'Font stack for headings.', 'gambol-builder' ) }
				/>
			</SettingsSection>

			<SettingsSection title={ __( 'Base Font Size', 'gambol-builder' ) }>
				<div className="gambol-controls-grid">
					<TextControl
						label={ __( 'Base Size', 'gambol-builder' ) }
						value={ typography[ 'font-size-base' ] || '16px' }
						onChange={ ( value ) => updateStyle( 'typography', 'font-size-base', value ) }
					/>
					<TextControl
						label={ __( 'Small Size', 'gambol-builder' ) }
						value={ typography[ 'font-size-sm' ] || '14px' }
						onChange={ ( value ) => updateStyle( 'typography', 'font-size-sm', value ) }
					/>
					<TextControl
						label={ __( 'Large Size', 'gambol-builder' ) }
						value={ typography[ 'font-size-lg' ] || '18px' }
						onChange={ ( value ) => updateStyle( 'typography', 'font-size-lg', value ) }
					/>
				</div>
			</SettingsSection>

			<SettingsSection title={ __( 'Heading Scale', 'gambol-builder' ) }>
				<p className="gambol-help-text">
					{ __( 'Heading sizes are calculated by multiplying the base font size by these scale values.', 'gambol-builder' ) }
				</p>
				<div className="gambol-controls-grid gambol-controls-grid--3">
					<TextControl
						label="H1"
						type="number"
						step="0.1"
						value={ typography[ 'heading-scale-h1' ] || '2.5' }
						onChange={ ( value ) => updateStyle( 'typography', 'heading-scale-h1', value ) }
					/>
					<TextControl
						label="H2"
						type="number"
						step="0.1"
						value={ typography[ 'heading-scale-h2' ] || '2' }
						onChange={ ( value ) => updateStyle( 'typography', 'heading-scale-h2', value ) }
					/>
					<TextControl
						label="H3"
						type="number"
						step="0.1"
						value={ typography[ 'heading-scale-h3' ] || '1.75' }
						onChange={ ( value ) => updateStyle( 'typography', 'heading-scale-h3', value ) }
					/>
					<TextControl
						label="H4"
						type="number"
						step="0.1"
						value={ typography[ 'heading-scale-h4' ] || '1.5' }
						onChange={ ( value ) => updateStyle( 'typography', 'heading-scale-h4', value ) }
					/>
					<TextControl
						label="H5"
						type="number"
						step="0.1"
						value={ typography[ 'heading-scale-h5' ] || '1.25' }
						onChange={ ( value ) => updateStyle( 'typography', 'heading-scale-h5', value ) }
					/>
					<TextControl
						label="H6"
						type="number"
						step="0.1"
						value={ typography[ 'heading-scale-h6' ] || '1' }
						onChange={ ( value ) => updateStyle( 'typography', 'heading-scale-h6', value ) }
					/>
				</div>
			</SettingsSection>

			<SettingsSection title={ __( 'Line Height', 'gambol-builder' ) }>
				<div className="gambol-controls-grid">
					<TextControl
						label={ __( 'Base Line Height', 'gambol-builder' ) }
						type="number"
						step="0.1"
						value={ typography[ 'line-height-base' ] || '1.6' }
						onChange={ ( value ) => updateStyle( 'typography', 'line-height-base', value ) }
					/>
					<TextControl
						label={ __( 'Heading Line Height', 'gambol-builder' ) }
						type="number"
						step="0.1"
						value={ typography[ 'line-height-heading' ] || '1.3' }
						onChange={ ( value ) => updateStyle( 'typography', 'line-height-heading', value ) }
					/>
				</div>
			</SettingsSection>
		</>
	);
}

/**
 * Spacing Tab Component
 */
function SpacingTab( { styles, updateStyle } ) {
	const spacing = styles?.spacing || {};

	const spacingKeys = [
		{ key: 'xs', label: 'XS (Extra Small)' },
		{ key: 'sm', label: 'SM (Small)' },
		{ key: 'md', label: 'MD (Medium)' },
		{ key: 'lg', label: 'LG (Large)' },
		{ key: 'xl', label: 'XL (Extra Large)' },
		{ key: '2xl', label: '2XL' },
		{ key: '3xl', label: '3XL' },
	];

	return (
		<>
			<SettingsSection title={ __( 'Spacing Scale', 'gambol-builder' ) }>
				<p className="gambol-help-text">
					{ __( 'Define your spacing scale used throughout the builder. Values can be in px, rem, or em.', 'gambol-builder' ) }
				</p>
				<div className="gambol-controls-grid gambol-controls-grid--2">
					{ spacingKeys.map( ( { key, label } ) => (
						<TextControl
							key={ key }
							label={ label }
							value={ spacing[ key ] || '' }
							onChange={ ( value ) => updateStyle( 'spacing', key, value ) }
						/>
					) ) }
				</div>
			</SettingsSection>

			<SettingsSection title={ __( 'Container', 'gambol-builder' ) }>
				<div className="gambol-controls-grid">
					<TextControl
						label={ __( 'Max Width', 'gambol-builder' ) }
						value={ styles?.container?.[ 'max-width' ] || '1200px' }
						onChange={ ( value ) => updateStyle( 'container', 'max-width', value ) }
						help={ __( 'Maximum width of the content container.', 'gambol-builder' ) }
					/>
					<TextControl
						label={ __( 'Container Padding', 'gambol-builder' ) }
						value={ styles?.container?.padding || '16px' }
						onChange={ ( value ) => updateStyle( 'container', 'padding', value ) }
						help={ __( 'Horizontal padding for containers.', 'gambol-builder' ) }
					/>
				</div>
			</SettingsSection>
		</>
	);
}

/**
 * Buttons Tab Component
 */
function ButtonsTab( { styles, updateStyle } ) {
	const buttons = styles?.buttons || {};

	return (
		<>
			<SettingsSection title={ __( 'Button Shape', 'gambol-builder' ) }>
				<div className="gambol-controls-grid">
					<TextControl
						label={ __( 'Border Radius', 'gambol-builder' ) }
						value={ buttons[ 'border-radius' ] || '6px' }
						onChange={ ( value ) => updateStyle( 'buttons', 'border-radius', value ) }
					/>
					<TextControl
						label={ __( 'Horizontal Padding', 'gambol-builder' ) }
						value={ buttons[ 'padding-x' ] || '24px' }
						onChange={ ( value ) => updateStyle( 'buttons', 'padding-x', value ) }
					/>
					<TextControl
						label={ __( 'Vertical Padding', 'gambol-builder' ) }
						value={ buttons[ 'padding-y' ] || '12px' }
						onChange={ ( value ) => updateStyle( 'buttons', 'padding-y', value ) }
					/>
				</div>
			</SettingsSection>

			<SettingsSection title={ __( 'Button Typography', 'gambol-builder' ) }>
				<div className="gambol-controls-grid">
					<TextControl
						label={ __( 'Font Size', 'gambol-builder' ) }
						value={ buttons[ 'font-size' ] || '15px' }
						onChange={ ( value ) => updateStyle( 'buttons', 'font-size', value ) }
					/>
					<TextControl
						label={ __( 'Font Weight', 'gambol-builder' ) }
						value={ buttons[ 'font-weight' ] || '500' }
						onChange={ ( value ) => updateStyle( 'buttons', 'font-weight', value ) }
					/>
				</div>
			</SettingsSection>

			<SettingsSection title={ __( 'Default State', 'gambol-builder' ) }>
				<div className="gambol-controls-grid">
					<ColorControl
						label={ __( 'Background Color', 'gambol-builder' ) }
						value={ buttons[ 'bg-color' ] || '#00d4aa' }
						onChange={ ( value ) => updateStyle( 'buttons', 'bg-color', value ) }
					/>
					<ColorControl
						label={ __( 'Text Color', 'gambol-builder' ) }
						value={ buttons[ 'text-color' ] || '#ffffff' }
						onChange={ ( value ) => updateStyle( 'buttons', 'text-color', value ) }
					/>
				</div>
			</SettingsSection>

			<SettingsSection title={ __( 'Hover State', 'gambol-builder' ) }>
				<div className="gambol-controls-grid">
					<ColorControl
						label={ __( 'Hover Background', 'gambol-builder' ) }
						value={ buttons[ 'hover-bg-color' ] || '#00b894' }
						onChange={ ( value ) => updateStyle( 'buttons', 'hover-bg-color', value ) }
					/>
					<ColorControl
						label={ __( 'Hover Text Color', 'gambol-builder' ) }
						value={ buttons[ 'hover-text-color' ] || '#ffffff' }
						onChange={ ( value ) => updateStyle( 'buttons', 'hover-text-color', value ) }
					/>
				</div>
			</SettingsSection>

			{/* Preview */}
			<SettingsSection title={ __( 'Preview', 'gambol-builder' ) }>
				<div className="gambol-button-preview">
					<button
						type="button"
						className="gambol-preview-button"
						style={ {
							backgroundColor: buttons[ 'bg-color' ] || '#00d4aa',
							color: buttons[ 'text-color' ] || '#ffffff',
							borderRadius: buttons[ 'border-radius' ] || '6px',
							padding: `${ buttons[ 'padding-y' ] || '12px' } ${ buttons[ 'padding-x' ] || '24px' }`,
							fontSize: buttons[ 'font-size' ] || '15px',
							fontWeight: buttons[ 'font-weight' ] || '500',
							border: 'none',
							cursor: 'pointer',
							transition: 'all 0.2s ease',
						} }
					>
						{ __( 'Button Preview', 'gambol-builder' ) }
					</button>
				</div>
			</SettingsSection>
		</>
	);
}
