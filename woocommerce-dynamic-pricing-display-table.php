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
			wp_localize_script( 'wcdpdt', 'wcdpdt_wc_price_num_decimals', get_option( 'woocommerce_price_num_decimals' ) );
			wp_enqueue_script( 'wcdpdt' );
			wp_enqueue_style( 'wcdpdt' );
		}
	}

	public function get_product_pricing() {
		$has_rules = false;
		$pricing_rules = array();
		$product = get_post_custom();
		
		// Product pricing rules
		$rules = unserialize( $product['_pricing_rules'][0] );
		
		// Global pricing rules
		if(empty($rules)) {
			$product_cats = get_the_terms( $post->ID, 'product_cat' );
			$product_cats_ids = array();
			foreach($product_cats as $cat) {
				$product_cats_ids[] = $cat->term_id;
			}
			
			$rules = get_option( '_a_category_pricing_rules' );
			foreach($rules as $rule) {
				switch($rule['collector']['type']) {
					case 'cat_product':
					case 'cat':
					foreach($rule['collector']['args']['cats'] as $arg) {
						if(in_array($arg, $product_cats_ids)) {
							$has_rules = true;
						}
					}
					break;
				}
			}
		} else {
			$has_rules = true;
		}
		
		if($has_rules) {
			foreach($rules as $rule) {
				$pricing_rules[] = $rule['rules'];
			}
			$pricing = array(
				'prices' => $product['_price'],
				'rules' => $pricing_rules
			);
			return $pricing;
		} else {
			return $global_rules;
		}
	}
}

new WooCommerceDynamicPricingDisplayTable();

?>