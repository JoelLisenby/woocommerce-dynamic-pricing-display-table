<?php
/*
Plugin Name:  WooCommerce Dynamic Pricing Display Table
Plugin URI:   https://www.joellisenby.com/woocommerce-dynamic-pricing-display-table
Description:  Display a quantity discount pricing table and update price based on discounts when quantity adjusted on single product pages while using the official WooCommerce Dynamic Pricing plugin.
Version:      20170919
Author:       Joel Lisenby
Author URI:   https://www.joellisenby.com/
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  wcdpdt
*/

class WooCommerceDynamicPricingDisplayTable {

	private $version = 1;

	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_scripts' ) );
	}

	public function wp_enqueue_scripts() {
		if(is_product()) {
			wp_register_style( 'wcdpdt', plugin_dir_url( __FILE__ ) . '/woocommerce-dynamic-pricing-display-table.css', null, $this->version, false );
			wp_register_script( 'wcdpdt', plugin_dir_url( __FILE__ ) . '/woocommerce-dynamic-pricing-display-table.js', array( 'jquery' ), $this->version, true);
			wp_localize_script( 'wcdpdt', 'wcdpdt_wc_product_pricing', $this->get_product_pricing() );
			wp_enqueue_script( 'wcdpdt' );
			wp_enqueue_style( 'wcdpdt' );
		}
	}

	public function get_product_pricing() {
		$product = get_post_custom();
		$rules = unserialize( $product['_pricing_rules'][0] );
		$pricing_rules = array();
		foreach($rules as $rule) {
			$pricing_rules[] = $rule['rules'];
		}
		$pricing = array(
			'prices' => $product['_price'],
			'rules' => $pricing_rules
		);
		return $pricing;
	}
}

new WooCommerceDynamicPricingDisplayTable();

?>