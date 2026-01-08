/**
 * Dashboard Page Component
 *
 * Welcome page for Gambol Builder admin.
 *
 * @package GambolBuilder
 */

import { __ } from '@wordpress/i18n';
import { Card, CardHeader, CardBody, Icon } from '@wordpress/components';
import { settings, brush, layout, plugins } from '@wordpress/icons';

/**
 * Quick link card component.
 */
function QuickLink( { icon, title, description, href } ) {
	return (
		<a href={ href } className="gambol-quick-link">
			<div className="gambol-quick-link__icon">
				<Icon icon={ icon } size={ 24 } />
			</div>
			<div className="gambol-quick-link__content">
				<h3>{ title }</h3>
				<p>{ description }</p>
			</div>
		</a>
	);
}

/**
 * Dashboard page component.
 */
export default function Dashboard() {
	const adminUrl = window.gambolAdmin?.adminUrl || '/wp-admin/';
	const version = window.gambolAdmin?.version || '1.0.0';

	return (
		<div className="gambol-admin-page gambol-dashboard">
			{/* Header */}
			<div className="gambol-admin-header">
				<div className="gambol-admin-header__logo">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
					</svg>
					<h1>{ __( 'Gambol Builder', 'gambol-builder' ) }</h1>
				</div>
				<div className="gambol-admin-header__version">
					{ __( 'Version', 'gambol-builder' ) } { version }
				</div>
			</div>

			{/* Welcome Card */}
			<Card className="gambol-welcome-card">
				<CardBody>
					<h2>{ __( 'Welcome to Gambol Builder', 'gambol-builder' ) }</h2>
					<p>
						{ __( 'A performance-first visual builder for WordPress. Create stunning pages with our intuitive block-based editor.', 'gambol-builder' ) }
					</p>
				</CardBody>
			</Card>

			{/* Quick Links */}
			<div className="gambol-quick-links">
				<h2>{ __( 'Quick Links', 'gambol-builder' ) }</h2>
				<div className="gambol-quick-links__grid">
					<QuickLink
						icon={ brush }
						title={ __( 'Global Styles', 'gambol-builder' ) }
						description={ __( 'Configure colors, typography, and spacing.', 'gambol-builder' ) }
						href={ `${ adminUrl }admin.php?page=gambol-global-styles` }
					/>
					<QuickLink
						icon={ layout }
						title={ __( 'Create Page', 'gambol-builder' ) }
						description={ __( 'Start building a new page with blocks.', 'gambol-builder' ) }
						href={ `${ adminUrl }post-new.php?post_type=page` }
					/>
					<QuickLink
						icon={ plugins }
						title={ __( 'Header & Footer', 'gambol-builder' ) }
						description={ __( 'Design custom headers and footers.', 'gambol-builder' ) }
						href={ `${ adminUrl }edit.php?post_type=gambol_header_footer` }
					/>
					<QuickLink
						icon={ settings }
						title={ __( 'Settings', 'gambol-builder' ) }
						description={ __( 'Configure plugin options.', 'gambol-builder' ) }
						href={ `${ adminUrl }options-general.php` }
					/>
				</div>
			</div>

			{/* Features */}
			<div className="gambol-features">
				<h2>{ __( 'Features', 'gambol-builder' ) }</h2>
				<div className="gambol-features__grid">
					<div className="gambol-feature">
						<h3>{ __( 'Performance First', 'gambol-builder' ) }</h3>
						<p>{ __( 'Optimized for speed with minimal CSS and JavaScript output.', 'gambol-builder' ) }</p>
					</div>
					<div className="gambol-feature">
						<h3>{ __( 'Native Gutenberg', 'gambol-builder' ) }</h3>
						<p>{ __( 'Built on WordPress core blocks for maximum compatibility.', 'gambol-builder' ) }</p>
					</div>
					<div className="gambol-feature">
						<h3>{ __( 'Global Styles', 'gambol-builder' ) }</h3>
						<p>{ __( 'Centralized design tokens for consistent branding.', 'gambol-builder' ) }</p>
					</div>
					<div className="gambol-feature">
						<h3>{ __( 'Theme Agnostic', 'gambol-builder' ) }</h3>
						<p>{ __( 'Works with any WordPress theme out of the box.', 'gambol-builder' ) }</p>
					</div>
				</div>
			</div>
		</div>
	);
}
