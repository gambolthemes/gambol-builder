/**
 * Template Card Component
 *
 * Individual template card with thumbnail, name, category badge,
 * and hover overlay with Preview + Insert actions.
 *
 * @package GambolBuilder
 */

import { __ } from '@wordpress/i18n';

/**
 * @param {Object}   props
 * @param {Object}   props.template   Template data object.
 * @param {Function} props.onInsert   Called when user clicks Insert.
 * @param {Function} props.onPreview  Called when user clicks Preview.
 * @param {boolean}  props.isImporting Whether this template is currently being inserted.
 */
const TemplateCard = ( { template, onInsert, onPreview, isImporting } ) => {
	const hasThumbnail = !! template.thumbnail;

	return (
		<div className="gambol-template-card">
			<div className="gambol-template-card__thumb">
				{ hasThumbnail ? (
					<img
						src={ template.thumbnail }
						alt={ template.title }
						loading="lazy"
					/>
				) : (
					<div className="gambol-template-card__placeholder">
						<svg viewBox="0 0 48 48" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect width="48" height="48" rx="4" fill="#1e1e1e"/>
							<rect x="8" y="8" width="32" height="4" rx="2" fill="#333"/>
							<rect x="8" y="16" width="24" height="3" rx="1.5" fill="#2a2a2a"/>
							<rect x="8" y="22" width="28" height="3" rx="1.5" fill="#2a2a2a"/>
							<rect x="8" y="32" width="12" height="8" rx="2" fill="#00d4aa"/>
							<rect x="22" y="32" width="12" height="8" rx="2" fill="#333"/>
						</svg>
					</div>
				) }

				{/* Hover overlay */}
				<div className="gambol-template-card__overlay">
					<button
						type="button"
						className="gambol-template-card__btn gambol-template-card__btn--preview"
						onClick={ () => onPreview && onPreview( template ) }
					>
						{ __( 'Preview', 'gambol-builder' ) }
					</button>
					<button
						type="button"
						className={ `gambol-template-card__btn gambol-template-card__btn--insert ${ isImporting ? 'is-loading' : '' }` }
						onClick={ () => ! isImporting && onInsert && onInsert( template ) }
						disabled={ isImporting }
					>
						{ isImporting ? __( 'Inserting…', 'gambol-builder' ) : __( 'Insert', 'gambol-builder' ) }
					</button>
				</div>
			</div>

			<div className="gambol-template-card__meta">
				<span className="gambol-template-card__title">{ template.title }</span>
				{ template.source === 'local' && (
					<span className="gambol-template-card__badge gambol-template-card__badge--local">
						{ __( 'My Template', 'gambol-builder' ) }
					</span>
				) }
			</div>
		</div>
	);
};

export default TemplateCard;
