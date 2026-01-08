/**
 * Control Section
 *
 * Groups related controls with a title and optional icon.
 *
 * @package GambolBuilder
 */

/**
 * Section Component.
 *
 * @param {Object}      props          Component props.
 * @param {string}      props.title    Section title.
 * @param {JSX.Element} props.icon     Optional icon.
 * @param {JSX.Element} props.actions  Optional action buttons.
 * @param {JSX.Element} props.children Section content.
 * @return {JSX.Element} Section element.
 */
export default function Section( {
	title,
	icon = null,
	actions = null,
	children,
} ) {
	return (
		<div className="gambol-section">
			{ title && (
				<div className="gambol-section-header">
					<div className="gambol-section-title">
						{ icon }
						<span>{ title }</span>
					</div>
					{ actions && (
						<div className="gambol-section-actions">
							{ actions }
						</div>
					) }
				</div>
			) }
			{ children }
		</div>
	);
}
