<?php
/**
 * Template Library Module Loader.
 *
 * @package GambolBuilder
 */

namespace GambolBuilder\TemplateLibrary;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Load classes.
require_once __DIR__ . '/class-template-manager.php';
require_once __DIR__ . '/class-template-cpt.php';
require_once __DIR__ . '/class-rest-api.php';

// Initialize.
Template_CPT::get_instance();
Rest_API::get_instance();
