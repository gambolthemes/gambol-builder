/**
 * Animation Control Component
 *
 * Controls for scroll-triggered entrance animations on Gambol blocks.
 * Works via IntersectionObserver in frontend/index.js.
 *
 * @package GambolBuilder
 */

import { SelectControl, RangeControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Available entrance animations.
 */
const ANIMATION_OPTIONS = [
	{ label: __( 'None', 'gambol-builder' ),            value: '' },
	{ label: __( 'Fade In', 'gambol-builder' ),         value: 'fadeIn' },
	{ label: __( 'Fade In Up', 'gambol-builder' ),      value: 'fadeInUp' },
	{ label: __( 'Fade In Down', 'gambol-builder' ),    value: 'fadeInDown' },
	{ label: __( 'Fade In Left', 'gambol-builder' ),    value: 'fadeInLeft' },
	{ label: __( 'Fade In Right', 'gambol-builder' ),   value: 'fadeInRight' },
	{ label: __( 'Zoom In', 'gambol-builder' ),         value: 'zoomIn' },
	{ label: __( 'Zoom Out', 'gambol-builder' ),        value: 'zoomOut' },
	{ label: __( 'Bounce In', 'gambol-builder' ),       value: 'bounceIn' },
	{ label: __( 'Slide In Up', 'gambol-builder' ),     value: 'slideInUp' },
	{ label: __( 'Slide In Down', 'gambol-builder' ),   value: 'slideInDown' },
	{ label: __( 'Slide In Left', 'gambol-builder' ),   value: 'slideInLeft' },
	{ label: __( 'Slide In Right', 'gambol-builder' ),  value: 'slideInRight' },
	{ label: __( 'Flip In X', 'gambol-builder' ),       value: 'flipInX' },
	{ label: __( 'Flip In Y', 'gambol-builder' ),       value: 'flipInY' },
	{ label: __( 'Rotate In', 'gambol-builder' ),       value: 'rotateIn' },
	{ label: __( 'Light Speed In', 'gambol-builder' ),  value: 'lightSpeedIn' },
	{ label: __( 'Roll In', 'gambol-builder' ),         value: 'rollIn' },
	{ label: __( 'Jack In The Box', 'gambol-builder' ), value: 'jackInTheBox' },
];

/**
 * Animation Control Component
 *
 * @param {Object}   props                   Component props.
 * @param {string}   props.animationName     Selected animation name.
 * @param {number}   props.animationDelay    Delay in ms before animation starts.
 * @param {number}   props.animationDuration Duration of animation in ms.
 * @param {Function} props.onChange          Callback with {animationName, animationDelay, animationDuration}.
 * @return {JSX.Element} Animation control panel.
 */
const AnimationControl = ( {
	animationName = '',
	animationDelay = 0,
	animationDuration = 600,
	onChange,
} ) => {
	return (
		<PanelBody
			title={ __( 'Animation', 'gambol-builder' ) }
			initialOpen={ false }
			className="gambol-animation-panel"
		>
			<SelectControl
				label={ __( 'Entrance Animation', 'gambol-builder' ) }
				value={ animationName }
				options={ ANIMATION_OPTIONS }
				onChange={ ( value ) => onChange( { animationName: value } ) }
			/>

			{ animationName && (
				<>
					<RangeControl
						label={ __( 'Delay (ms)', 'gambol-builder' ) }
						value={ animationDelay }
						min={ 0 }
						max={ 2000 }
						step={ 50 }
						onChange={ ( value ) => onChange( { animationDelay: value } ) }
					/>
					<RangeControl
						label={ __( 'Duration (ms)', 'gambol-builder' ) }
						value={ animationDuration }
						min={ 100 }
						max={ 3000 }
						step={ 50 }
						onChange={ ( value ) => onChange( { animationDuration: value } ) }
					/>
				</>
			) }
		</PanelBody>
	);
};

export default AnimationControl;
