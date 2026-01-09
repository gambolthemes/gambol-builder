<?php
/**
 * Demo Importer Admin Page.
 *
 * Handles the admin interface for demo importing.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\DemoImporter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Admin_Page
 *
 * Manages the admin page for demo imports.
 */
class Admin_Page {

	/**
	 * Singleton instance.
	 *
	 * @var Admin_Page|null
	 */
	private static $instance = null;

	/**
	 * Page hook suffix.
	 *
	 * @var string
	 */
	private $page_hook = '';

	/**
	 * Get singleton instance.
	 *
	 * @return Admin_Page
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		add_action( 'admin_menu', array( $this, 'add_menu_page' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Add menu page.
	 *
	 * @return void
	 */
	public function add_menu_page() {
		$this->page_hook = add_submenu_page(
			'gambol-builder',
			__( 'Demo Importer', 'gambol-builder' ),
			__( 'Demo Importer', 'gambol-builder' ),
			'manage_options',
			'gambol-demo-importer',
			array( $this, 'render_page' )
		);
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @param string $hook Current admin page hook.
	 * @return void
	 */
	public function enqueue_assets( $hook ) {
		if ( $hook !== $this->page_hook ) {
			return;
		}

		// Enqueue inline styles.
		wp_register_style( 'gambol-demo-importer', false, array(), GAMBOL_BUILDER_VERSION );
		wp_enqueue_style( 'gambol-demo-importer' );
		wp_add_inline_style( 'gambol-demo-importer', $this->get_inline_styles() );

		// Enqueue inline script.
		wp_register_script( 'gambol-demo-importer', false, array(), GAMBOL_BUILDER_VERSION, true );
		wp_enqueue_script( 'gambol-demo-importer' );
		wp_add_inline_script( 'gambol-demo-importer', $this->get_inline_script() );

		// Localize script.
		wp_localize_script(
			'gambol-demo-importer',
			'gambolDemoImporter',
			array(
				'apiUrl'   => rest_url( 'gambol-builder/v1/demos' ),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
				'strings'  => array(
					'importing'      => __( 'Importing...', 'gambol-builder' ),
					'imported'       => __( 'Imported!', 'gambol-builder' ),
					'error'          => __( 'Error!', 'gambol-builder' ),
					'confirmImport'  => __( 'Are you sure you want to import this demo?', 'gambol-builder' ),
					'confirmReset'   => __( 'Are you sure you want to delete all imported demo content? This cannot be undone.', 'gambol-builder' ),
					'confirmRollback' => __( 'Are you sure you want to rollback the last import?', 'gambol-builder' ),
					'stepBackup'     => __( 'Creating backup...', 'gambol-builder' ),
					'stepPages'      => __( 'Importing pages...', 'gambol-builder' ),
					'stepHeaders'    => __( 'Importing headers...', 'gambol-builder' ),
					'stepFooters'    => __( 'Importing footers...', 'gambol-builder' ),
					'stepStyles'     => __( 'Importing global styles...', 'gambol-builder' ),
					'complete'       => __( 'Import complete!', 'gambol-builder' ),
					'rollbackDone'   => __( 'Rollback complete!', 'gambol-builder' ),
					'resetDone'      => __( 'Reset complete!', 'gambol-builder' ),
				),
			)
		);
	}

	/**
	 * Render admin page.
	 *
	 * @return void
	 */
	public function render_page() {
		$demo_manager = Demo_Manager::get_instance();
		$demos = $demo_manager->get_demos();
		$importer = Importer::get_instance();
		$can_rollback = $importer->can_rollback();
		$last_import = $importer->get_last_import();
		?>
		<div class="wrap gambol-demo-importer">
			<h1><?php esc_html_e( 'Demo Importer', 'gambol-builder' ); ?></h1>

			<div class="gambol-demo-actions">
				<?php if ( $can_rollback && $last_import ) : ?>
					<div class="gambol-last-import">
						<span><?php printf( esc_html__( 'Last import: %s', 'gambol-builder' ), esc_html( $last_import['demo_name'] ) ); ?></span>
						<button type="button" class="button" id="gambol-rollback-btn">
							<?php esc_html_e( 'Rollback Last Import', 'gambol-builder' ); ?>
						</button>
					</div>
				<?php endif; ?>
				<button type="button" class="button button-link-delete" id="gambol-reset-btn">
					<?php esc_html_e( 'Reset All Demo Content', 'gambol-builder' ); ?>
				</button>
			</div>

			<?php if ( empty( $demos ) ) : ?>
				<div class="gambol-no-demos">
					<p><?php esc_html_e( 'No demos available. Add demo packages to the demos folder or use the gambol_register_demos filter.', 'gambol-builder' ); ?></p>
				</div>
			<?php else : ?>
				<div class="gambol-demo-grid">
					<?php foreach ( $demos as $demo ) : ?>
						<?php $this->render_demo_card( $demo ); ?>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<!-- Import Modal -->
			<div id="gambol-import-modal" class="gambol-modal" style="display: none;">
				<div class="gambol-modal-overlay"></div>
				<div class="gambol-modal-content">
					<div class="gambol-modal-header">
						<h2 id="gambol-modal-title"><?php esc_html_e( 'Import Demo', 'gambol-builder' ); ?></h2>
						<button type="button" class="gambol-modal-close">&times;</button>
					</div>
					<div class="gambol-modal-body">
						<div class="gambol-import-options">
							<h3><?php esc_html_e( 'Select what to import:', 'gambol-builder' ); ?></h3>
							<label>
								<input type="checkbox" name="import_pages" value="1" checked />
								<?php esc_html_e( 'Pages', 'gambol-builder' ); ?>
							</label>
							<label>
								<input type="checkbox" name="import_headers" value="1" checked />
								<?php esc_html_e( 'Headers', 'gambol-builder' ); ?>
							</label>
							<label>
								<input type="checkbox" name="import_footers" value="1" checked />
								<?php esc_html_e( 'Footers', 'gambol-builder' ); ?>
							</label>
							<label>
								<input type="checkbox" name="import_global_styles" value="1" checked />
								<?php esc_html_e( 'Global Styles', 'gambol-builder' ); ?>
							</label>
							<label>
								<input type="checkbox" name="create_backup" value="1" checked />
								<?php esc_html_e( 'Create backup before import', 'gambol-builder' ); ?>
							</label>
						</div>
						<div class="gambol-import-progress" style="display: none;">
							<div class="gambol-progress-bar">
								<div class="gambol-progress-fill"></div>
							</div>
							<p class="gambol-progress-status"></p>
						</div>
						<div class="gambol-import-result" style="display: none;"></div>
					</div>
					<div class="gambol-modal-footer">
						<button type="button" class="button" id="gambol-cancel-import"><?php esc_html_e( 'Cancel', 'gambol-builder' ); ?></button>
						<button type="button" class="button button-primary" id="gambol-start-import"><?php esc_html_e( 'Import', 'gambol-builder' ); ?></button>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render demo card.
	 *
	 * @param array $demo Demo configuration.
	 * @return void
	 */
	private function render_demo_card( $demo ) {
		$demo_manager = Demo_Manager::get_instance();
		$thumbnail = $demo_manager->get_demo_thumbnail( $demo['id'] );
		?>
		<div class="gambol-demo-card" data-demo-id="<?php echo esc_attr( $demo['id'] ); ?>">
			<div class="gambol-demo-thumbnail">
				<?php if ( $thumbnail ) : ?>
					<img src="<?php echo esc_url( $thumbnail ); ?>" alt="<?php echo esc_attr( $demo['name'] ); ?>" loading="lazy" />
				<?php else : ?>
					<div class="gambol-demo-placeholder">
						<span class="dashicons dashicons-format-image"></span>
					</div>
				<?php endif; ?>
			</div>
			<div class="gambol-demo-info">
				<h3><?php echo esc_html( $demo['name'] ); ?></h3>
				<?php if ( ! empty( $demo['description'] ) ) : ?>
					<p><?php echo esc_html( $demo['description'] ); ?></p>
				<?php endif; ?>
				<?php if ( ! empty( $demo['categories'] ) ) : ?>
					<div class="gambol-demo-categories">
						<?php foreach ( $demo['categories'] as $category ) : ?>
							<span class="gambol-demo-category"><?php echo esc_html( ucfirst( $category ) ); ?></span>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>
			</div>
			<div class="gambol-demo-actions-card">
				<?php if ( ! empty( $demo['preview_url'] ) ) : ?>
					<a href="<?php echo esc_url( $demo['preview_url'] ); ?>" target="_blank" class="button">
						<?php esc_html_e( 'Preview', 'gambol-builder' ); ?>
					</a>
				<?php endif; ?>
				<button type="button" class="button button-primary gambol-import-btn">
					<?php esc_html_e( 'Import', 'gambol-builder' ); ?>
				</button>
			</div>
		</div>
		<?php
	}

	/**
	 * Get inline styles.
	 *
	 * @return string CSS styles.
	 */
	private function get_inline_styles() {
		return '
			.gambol-demo-importer { max-width: 1400px; }
			.gambol-demo-actions { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
			.gambol-last-import { display: flex; align-items: center; gap: 15px; }
			.gambol-last-import span { color: #666; }
			.gambol-demo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
			.gambol-demo-card { background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; transition: box-shadow 0.2s; }
			.gambol-demo-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
			.gambol-demo-thumbnail { height: 200px; background: #f5f5f5; overflow: hidden; }
			.gambol-demo-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
			.gambol-demo-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; }
			.gambol-demo-placeholder .dashicons { font-size: 48px; width: 48px; height: 48px; color: #ccc; }
			.gambol-demo-info { padding: 16px; }
			.gambol-demo-info h3 { margin: 0 0 8px; font-size: 16px; }
			.gambol-demo-info p { margin: 0 0 12px; color: #666; font-size: 13px; }
			.gambol-demo-categories { display: flex; flex-wrap: wrap; gap: 6px; }
			.gambol-demo-category { background: #f0f0f0; padding: 2px 8px; border-radius: 3px; font-size: 11px; color: #666; }
			.gambol-demo-actions-card { padding: 16px; border-top: 1px solid #eee; display: flex; gap: 10px; justify-content: flex-end; }
			.gambol-no-demos { background: #fff; border: 1px solid #ddd; padding: 40px; text-align: center; border-radius: 8px; }
			
			/* Modal */
			.gambol-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 100000; display: flex; align-items: center; justify-content: center; }
			.gambol-modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); }
			.gambol-modal-content { position: relative; background: #fff; border-radius: 8px; width: 100%; max-width: 500px; max-height: 90vh; overflow: auto; }
			.gambol-modal-header { padding: 16px 20px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; }
			.gambol-modal-header h2 { margin: 0; font-size: 18px; }
			.gambol-modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 0; line-height: 1; }
			.gambol-modal-close:hover { color: #000; }
			.gambol-modal-body { padding: 20px; }
			.gambol-modal-footer { padding: 16px 20px; border-top: 1px solid #ddd; display: flex; gap: 10px; justify-content: flex-end; }
			.gambol-import-options label { display: block; margin-bottom: 10px; cursor: pointer; }
			.gambol-import-options h3 { margin-top: 0; margin-bottom: 15px; font-size: 14px; }
			
			/* Progress */
			.gambol-progress-bar { height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden; margin-bottom: 15px; }
			.gambol-progress-fill { height: 100%; background: #0073aa; width: 0%; transition: width 0.3s; }
			.gambol-progress-status { margin: 0; color: #666; font-style: italic; }
			
			/* Result */
			.gambol-import-result { padding: 15px; border-radius: 4px; }
			.gambol-import-result.success { background: #d4edda; color: #155724; }
			.gambol-import-result.error { background: #f8d7da; color: #721c24; }
		';
	}

	/**
	 * Get inline script.
	 *
	 * @return string JavaScript code.
	 */
	private function get_inline_script() {
		return "
			(function() {
				'use strict';

				var config = window.gambolDemoImporter || {};
				var modal = document.getElementById('gambol-import-modal');
				var currentDemoId = null;

				// Import button click.
				document.querySelectorAll('.gambol-import-btn').forEach(function(btn) {
					btn.addEventListener('click', function() {
						var card = this.closest('.gambol-demo-card');
						currentDemoId = card.dataset.demoId;
						var demoName = card.querySelector('h3').textContent;
						document.getElementById('gambol-modal-title').textContent = config.strings.importing.replace('...', ': ' + demoName);
						openModal();
					});
				});

				// Modal controls.
				document.querySelector('.gambol-modal-close').addEventListener('click', closeModal);
				document.querySelector('.gambol-modal-overlay').addEventListener('click', closeModal);
				document.getElementById('gambol-cancel-import').addEventListener('click', closeModal);

				// Start import.
				document.getElementById('gambol-start-import').addEventListener('click', startImport);

				// Rollback.
				var rollbackBtn = document.getElementById('gambol-rollback-btn');
				if (rollbackBtn) {
					rollbackBtn.addEventListener('click', function() {
						if (confirm(config.strings.confirmRollback)) {
							performRollback();
						}
					});
				}

				// Reset.
				document.getElementById('gambol-reset-btn').addEventListener('click', function() {
					if (confirm(config.strings.confirmReset)) {
						performReset();
					}
				});

				function openModal() {
					modal.style.display = 'flex';
					resetModalState();
				}

				function closeModal() {
					modal.style.display = 'none';
					currentDemoId = null;
				}

				function resetModalState() {
					document.querySelector('.gambol-import-options').style.display = '';
					document.querySelector('.gambol-import-progress').style.display = 'none';
					document.querySelector('.gambol-import-result').style.display = 'none';
					document.getElementById('gambol-start-import').disabled = false;
					document.getElementById('gambol-cancel-import').disabled = false;
					document.querySelector('.gambol-progress-fill').style.width = '0%';
				}

				function startImport() {
					if (!currentDemoId) return;

					var options = {
						pages: document.querySelector('[name=\"import_pages\"]').checked,
						headers: document.querySelector('[name=\"import_headers\"]').checked,
						footers: document.querySelector('[name=\"import_footers\"]').checked,
						global_styles: document.querySelector('[name=\"import_global_styles\"]').checked,
						create_backup: document.querySelector('[name=\"create_backup\"]').checked
					};

					// Hide options, show progress.
					document.querySelector('.gambol-import-options').style.display = 'none';
					document.querySelector('.gambol-import-progress').style.display = '';
					document.getElementById('gambol-start-import').disabled = true;
					document.getElementById('gambol-cancel-import').disabled = true;

					// Calculate steps.
					var steps = [];
					if (options.create_backup) steps.push({ key: 'backup', label: config.strings.stepBackup });
					if (options.pages) steps.push({ key: 'pages', label: config.strings.stepPages });
					if (options.headers) steps.push({ key: 'headers', label: config.strings.stepHeaders });
					if (options.footers) steps.push({ key: 'footers', label: config.strings.stepFooters });
					if (options.global_styles) steps.push({ key: 'global_styles', label: config.strings.stepStyles });

					runImportSteps(steps, 0);
				}

				function runImportSteps(steps, index) {
					if (index >= steps.length) {
						showResult(true, config.strings.complete);
						return;
					}

					var step = steps[index];
					var progress = ((index + 1) / steps.length) * 100;

					document.querySelector('.gambol-progress-fill').style.width = progress + '%';
					document.querySelector('.gambol-progress-status').textContent = step.label;

					fetch(config.apiUrl + '/' + currentDemoId + '/import-step', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-WP-Nonce': config.nonce
						},
						body: JSON.stringify({ step: step.key })
					})
					.then(function(response) {
						return response.json();
					})
					.then(function(data) {
						if (data.success) {
							runImportSteps(steps, index + 1);
						} else {
							var errorMsg = data.message || config.strings.error;
							showResult(false, errorMsg);
						}
					})
					.catch(function(err) {
						showResult(false, config.strings.error + ' ' + err.message);
					});
				}

				function showResult(success, message) {
					document.querySelector('.gambol-import-progress').style.display = 'none';
					var resultDiv = document.querySelector('.gambol-import-result');
					resultDiv.style.display = '';
					resultDiv.className = 'gambol-import-result ' + (success ? 'success' : 'error');
					resultDiv.textContent = message;
					document.getElementById('gambol-cancel-import').disabled = false;
					document.getElementById('gambol-cancel-import').textContent = 'Close';
					
					if (success) {
						setTimeout(function() {
							window.location.reload();
						}, 1500);
					}
				}

				function performRollback() {
					fetch(config.apiUrl + '/rollback', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-WP-Nonce': config.nonce
						}
					})
					.then(function(response) {
						return response.json();
					})
					.then(function(data) {
						if (data.success) {
							alert(config.strings.rollbackDone);
							window.location.reload();
						} else {
							alert(data.message || config.strings.error);
						}
					})
					.catch(function(err) {
						alert(config.strings.error + ' ' + err.message);
					});
				}

				function performReset() {
					fetch(config.apiUrl + '/reset', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-WP-Nonce': config.nonce
						}
					})
					.then(function(response) {
						return response.json();
					})
					.then(function(data) {
						if (data.success) {
							alert(config.strings.resetDone);
							window.location.reload();
						} else {
							alert(data.message || config.strings.error);
						}
					})
					.catch(function(err) {
						alert(config.strings.error + ' ' + err.message);
					});
				}
			})();
		";
	}
}
