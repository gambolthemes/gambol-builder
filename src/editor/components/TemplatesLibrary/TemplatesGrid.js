/**
 * Templates Grid Component
 *
 * Renders a responsive grid of TemplateCard components.
 * Supports loading state and empty state messaging.
 *
 * @package GambolBuilder
 */

import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import TemplateCard from './TemplateCard';

/**
 * @param {Object}   props
 * @param {Array}    props.templates    List of template objects.
 * @param {boolean}  props.isLoading    Show loading spinner.
 * @param {Function} props.onInsert     Pass-through to TemplateCard.
 * @param {Function} props.onPreview    Pass-through to TemplateCard.
 * @param {string}   props.importingId  ID of template currently being inserted.
 */
const TemplatesGrid = ( { templates, isLoading, onInsert, onPreview, importingId } ) => {
	if ( isLoading ) {
		return (
			<div className="gambol-templates-loading">
				<Spinner />
				<p>{ __( 'Loading templates…', 'gambol-builder' ) }</p>
			</div>
		);
	}

	if ( ! templates || templates.length === 0 ) {
		return (
			<div className="gambol-templates-empty">
				<svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="32" cy="32" r="30" stroke="#333" strokeWidth="2"/>
					<path d="M20 32h24M32 20v24" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
				</svg>
				<p>{ __( 'No templates found.', 'gambol-builder' ) }</p>
				<span>{ __( 'Try a different search or category.', 'gambol-builder' ) }</span>
			</div>
		);
	}

	return (
		<div className="gambol-templates-grid">
			{ templates.map( ( template ) => (
				<TemplateCard
					key={ template.id }
					template={ template }
					onInsert={ onInsert }
					onPreview={ onPreview }
					isImporting={ importingId === template.id }
				/>
			) ) }
		</div>
	);
};

export default TemplatesGrid;
