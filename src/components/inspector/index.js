/**
 * Gambol Builder Inspector Components
 *
 * Modern, dark-themed inspector UI system for the block editor.
 * Uses native WordPress components with custom styling.
 *
 * @package GambolBuilder
 */

// Styles
import './styles/sidebar.scss';

// Main Components
export { default as InspectorSidebar } from './InspectorSidebar';
export { default as Section } from './Section';

// Controls
export { default as ButtonGroup } from './controls/ButtonGroup';
export { default as RangeSlider } from './controls/RangeSlider';
export { default as Toggle } from './controls/Toggle';
export { default as Dropdown } from './controls/Dropdown';
export { default as GambolColorPicker } from './controls/GambolColorPicker';
export { default as SpacingBox } from './controls/SpacingBox';
export { default as ShadowPresets } from './controls/ShadowPresets';
export { default as VisibilityControl } from './controls/VisibilityControl';
export { default as TextInput } from './controls/TextInput';

// Legacy exports (for backward compatibility)
export { default as GambolInspector } from './GambolInspector';
export { default as ControlGroup } from './ControlGroup';
export { default as SliderControl } from './controls/SliderControl';
export { default as ToggleControl } from './controls/ToggleControl';
export { default as ColorControl } from './controls/ColorControl';
export { default as SpacingControl } from './controls/SpacingControl';
export { default as SelectControl } from './controls/SelectControl';
export { default as ResponsiveControl } from './controls/ResponsiveControl';
export { default as BoxShadowControl } from './controls/BoxShadowControl';
export { default as BorderControl } from './controls/BorderControl';
