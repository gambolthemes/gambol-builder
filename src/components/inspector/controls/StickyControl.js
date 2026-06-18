/**
 * Sticky Control
 *
 * Adds a sticky positioning panel to block inspectors.
 * When enabled, the block wrapper receives data-gambol-sticky attributes
 * consumed by src/frontend/sticky.js at runtime.
 *
 * @package GambolBuilder
 */

import { __ } from '@wordpress/i18n';
import { ToggleControl, SelectControl, RangeControl } from '@wordpress/components';

/**
 * StickyControl Component.
 *
 * @param {Object}   props           Component props.
 * @param {boolean}  props.enabled   Whether sticky is enabled.
 * @param {number}   props.offset    Top offset in px when sticky.
 * @param {string}   props.behavior  'always' | 'scroll-up' | 'scroll-down'
 * @param {Function} props.onChange  Called with { stickyEnabled, stickyOffset, stickyBehavior }.
 * @return {JSX.Element}
 */
export default function StickyControl( { enabled, offset, behavior, onChange } ) {
	return (
		<div className="gambol-sticky-control" style={ { padding: '12px 16px', borderTop: '1px solid #e0e0e0', marginTop: '8px' } }>
			<p style={ { margin: '0 0 12px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: '#757575' } }>
				{ __( 'Sticky', 'gambol-builder' ) }
			</p>

			<ToggleControl
				label={ __( 'Enable Sticky', 'gambol-builder' ) }
				help={ __( 'Block sticks to viewport while scrolling.', 'gambol-builder' ) }
				checked={ !! enabled }
				onChange={ ( val ) => onChange( { stickyEnabled: val } ) }
			/>

			{ enabled && (
				<>
					<RangeControl
						label={ __( 'Top Offset (px)', 'gambol-builder' ) }
						value={ offset || 0 }
						min={ 0 }
						max={ 200 }
						onChange={ ( val ) => onChange( { stickyOffset: val } ) }
					/>
					<SelectControl
						label={ __( 'Show When', 'gambol-builder' ) }
						value={ behavior || 'always' }
						options={ [
							{ label: __( 'Always',              'gambol-builder' ), value: 'always'      },
							{ label: __( 'Scrolling Up',        'gambol-builder' ), value: 'scroll-up'   },
							{ label: __( 'Scrolling Down',      'gambol-builder' ), value: 'scroll-down' },
						] }
						onChange={ ( val ) => onChange( { stickyBehavior: val } ) }
					/>
				</>
			) }
		</div>
	);
}
