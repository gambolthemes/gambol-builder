/**
 * Table of Contents Block - Edit Component
 *
 * @package GambolBuilder
 */

import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	InspectorSidebar,
	Section,
	ButtonGroup,
	Toggle,
	GambolColorPicker,
	RangeSlider,
} from '../../components/inspector';

/**
 * Table of Contents Edit Component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		title,
		showTitle,
		headingLevels,
		listStyle,
		collapsible,
		collapsed,
		showToggle,
		smoothScroll,
		highlightActive,
		bgColor,
		textColor,
		linkColor,
		linkHoverColor,
		borderColor,
		borderRadius,
		padding,
	} = attributes;

	// Get headings from the current post
	const headings = useSelect( ( select ) => {
		const { getBlocks } = select( 'core/block-editor' );
		const blocks = getBlocks();
		const foundHeadings = [];

		const findHeadings = ( blocksToSearch ) => {
			blocksToSearch.forEach( ( block ) => {
				if ( block.name === 'core/heading' && headingLevels.includes( block.attributes.level ) ) {
					foundHeadings.push( {
						level: block.attributes.level,
						content: block.attributes.content,
						anchor: block.attributes.anchor || `heading-${ foundHeadings.length }`,
					} );
				}
				if ( block.innerBlocks && block.innerBlocks.length ) {
					findHeadings( block.innerBlocks );
				}
			} );
		};

		findHeadings( blocks );
		return foundHeadings;
	}, [ headingLevels ] );

	const toggleHeadingLevel = ( level ) => {
		if ( headingLevels.includes( level ) ) {
			setAttributes( { headingLevels: headingLevels.filter( ( l ) => l !== level ) } );
		} else {
			setAttributes( { headingLevels: [ ...headingLevels, level ].sort() } );
		}
	};

	const blockProps = useBlockProps( {
		className: `wp-block-gambol-table-of-contents list-${ listStyle } ${ collapsible ? 'is-collapsible' : '' }`,
		style: {
			backgroundColor: bgColor || undefined,
			borderColor: borderColor || undefined,
			borderRadius: `${ borderRadius }px`,
			padding: `${ padding }px`,
			color: textColor || undefined,
		},
	} );

	const linkStyle = {
		color: linkColor || undefined,
	};

	// Sample headings for preview
	const sampleHeadings = [
		{ level: 2, content: 'Introduction', anchor: 'intro' },
		{ level: 3, content: 'Getting Started', anchor: 'getting-started' },
		{ level: 3, content: 'Installation', anchor: 'installation' },
		{ level: 2, content: 'Features', anchor: 'features' },
		{ level: 3, content: 'Core Features', anchor: 'core-features' },
		{ level: 4, content: 'Advanced Options', anchor: 'advanced' },
	];

	const displayHeadings = headings.length > 0 ? headings : sampleHeadings.filter( h => headingLevels.includes( h.level ) );

	const renderHeadingList = () => {
		const minLevel = Math.min( ...displayHeadings.map( h => h.level ) );
		
		return (
			<ul className="toc-list">
				{ displayHeadings.map( ( heading, index ) => (
					<li
						key={ index }
						className={ `toc-item toc-level-${ heading.level }` }
						style={ { marginLeft: `${ ( heading.level - minLevel ) * 16 }px` } }
					>
						<a href={ `#${ heading.anchor }` } style={ linkStyle }>
							{ heading.content || __( 'Untitled Heading', 'gambol-builder' ) }
						</a>
					</li>
				) ) }
			</ul>
		);
	};

	return (
		<>
			<InspectorControls>
				<InspectorSidebar
					blockTitle={ __( 'Table of Contents', 'gambol-builder' ) }
					blockIcon={
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
							<path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h12v2H3v-2zm0 4h12v2H3v-2zm16-4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
						</svg>
					}
					layoutTab={
						<>
							<Section title={ __( 'Title', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Show Title', 'gambol-builder' ) }
									checked={ showTitle }
									onChange={ ( value ) => setAttributes( { showTitle: value } ) }
								/>
							</Section>

							<Section title={ __( 'Heading Levels', 'gambol-builder' ) }>
								{ [ 1, 2, 3, 4, 5, 6 ].map( ( level ) => (
									<Toggle
										key={ level }
										label={ `H${ level }` }
										checked={ headingLevels.includes( level ) }
										onChange={ () => toggleHeadingLevel( level ) }
									/>
								) ) }
							</Section>

							<Section title={ __( 'List Style', 'gambol-builder' ) }>
								<ButtonGroup
									label={ __( 'Style', 'gambol-builder' ) }
									value={ listStyle }
									onChange={ ( value ) => setAttributes( { listStyle: value } ) }
									options={ [
										{ value: 'numbered', label: 'Numbered' },
										{ value: 'bullets', label: 'Bullets' },
										{ value: 'none', label: 'None' },
									] }
								/>
							</Section>

							<Section title={ __( 'Behavior', 'gambol-builder' ) }>
								<Toggle
									label={ __( 'Collapsible', 'gambol-builder' ) }
									checked={ collapsible }
									onChange={ ( value ) => setAttributes( { collapsible: value } ) }
								/>
								{ collapsible && (
									<>
										<Toggle
											label={ __( 'Start Collapsed', 'gambol-builder' ) }
											checked={ collapsed }
											onChange={ ( value ) => setAttributes( { collapsed: value } ) }
										/>
										<Toggle
											label={ __( 'Show Toggle Button', 'gambol-builder' ) }
											checked={ showToggle }
											onChange={ ( value ) => setAttributes( { showToggle: value } ) }
										/>
									</>
								) }
								<Toggle
									label={ __( 'Smooth Scroll', 'gambol-builder' ) }
									checked={ smoothScroll }
									onChange={ ( value ) => setAttributes( { smoothScroll: value } ) }
								/>
								<Toggle
									label={ __( 'Highlight Active', 'gambol-builder' ) }
									checked={ highlightActive }
									onChange={ ( value ) => setAttributes( { highlightActive: value } ) }
								/>
							</Section>
						</>
					}
					styleTab={
						<>
							<Section title={ __( 'Box', 'gambol-builder' ) }>
								<RangeSlider
									label={ __( 'Padding', 'gambol-builder' ) }
									value={ padding }
									onChange={ ( value ) => setAttributes( { padding: value } ) }
									min={ 0 }
									max={ 40 }
								/>
								<RangeSlider
									label={ __( 'Border Radius', 'gambol-builder' ) }
									value={ borderRadius }
									onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
									min={ 0 }
									max={ 20 }
								/>
								<GambolColorPicker
									label={ __( 'Background', 'gambol-builder' ) }
									value={ bgColor }
									onChange={ ( value ) => setAttributes( { bgColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Border Color', 'gambol-builder' ) }
									value={ borderColor }
									onChange={ ( value ) => setAttributes( { borderColor: value } ) }
								/>
							</Section>

							<Section title={ __( 'Typography', 'gambol-builder' ) }>
								<GambolColorPicker
									label={ __( 'Text Color', 'gambol-builder' ) }
									value={ textColor }
									onChange={ ( value ) => setAttributes( { textColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Link Color', 'gambol-builder' ) }
									value={ linkColor }
									onChange={ ( value ) => setAttributes( { linkColor: value } ) }
								/>
								<GambolColorPicker
									label={ __( 'Link Hover Color', 'gambol-builder' ) }
									value={ linkHoverColor }
									onChange={ ( value ) => setAttributes( { linkHoverColor: value } ) }
								/>
							</Section>
						</>
					}
				/>
			</InspectorControls>

			<nav { ...blockProps }>
				{ showTitle && (
					<div className="toc-header">
						<RichText
							tagName="h4"
							className="toc-title"
							value={ title }
							onChange={ ( value ) => setAttributes( { title: value } ) }
							placeholder={ __( 'Table of Contents', 'gambol-builder' ) }
						/>
						{ collapsible && showToggle && (
							<button className="toc-toggle" type="button">
								<span className="toggle-icon">▼</span>
							</button>
						) }
					</div>
				) }
				
				<div className="toc-content">
					{ displayHeadings.length > 0 ? (
						renderHeadingList()
					) : (
						<p className="toc-empty">
							{ __( 'No headings found. Add some headings to your content.', 'gambol-builder' ) }
						</p>
					) }
				</div>
			</nav>
		</>
	);
}
