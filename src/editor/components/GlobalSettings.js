/**
 * Gambol Builder - Global Settings
 * 
 * Panel for accessing global styles and settings.
 */

import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { settings, typography, color, aspectRatio } from '@wordpress/icons';

const GlobalSettings = () => {
    const settingsItems = [
        {
            icon: color,
            title: __('Global Colors', 'gambol-builder'),
            description: __('Manage your color palette', 'gambol-builder'),
            link: 'admin.php?page=gambol-global-styles#colors',
        },
        {
            icon: typography,
            title: __('Typography', 'gambol-builder'),
            description: __('Configure fonts and text styles', 'gambol-builder'),
            link: 'admin.php?page=gambol-global-styles#typography',
        },
        {
            icon: aspectRatio,
            title: __('Spacing', 'gambol-builder'),
            description: __('Set spacing scale and defaults', 'gambol-builder'),
            link: 'admin.php?page=gambol-global-styles#spacing',
        },
        {
            icon: settings,
            title: __('Site Settings', 'gambol-builder'),
            description: __('Global layout and content settings', 'gambol-builder'),
            link: 'admin.php?page=gambol-builder',
        },
    ];

    return (
        <div className="gambol-global-settings">
            <div className="gambol-settings-intro">
                <p>{__('Access your site-wide design settings and styles.', 'gambol-builder')}</p>
            </div>

            <div className="gambol-settings-list">
                {settingsItems.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        className="gambol-settings-item"
                    >
                        <span className="gambol-settings-icon">
                            <Button icon={item.icon} />
                        </span>
                        <div className="gambol-settings-info">
                            <span className="gambol-settings-title">{item.title}</span>
                            <span className="gambol-settings-description">{item.description}</span>
                        </div>
                    </a>
                ))}
            </div>

            <div className="gambol-settings-footer">
                <Button
                    variant="primary"
                    href="admin.php?page=gambol-global-styles"
                    className="gambol-open-settings-btn"
                >
                    {__('Open Global Styles', 'gambol-builder')}
                </Button>
            </div>
        </div>
    );
};

export default GlobalSettings;
