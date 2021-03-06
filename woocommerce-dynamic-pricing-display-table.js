var WooCommerceDynamicPricingDisplayTable = function() {
	var dt = this;
	dt.variation = null;
	dt.prices = [];

	dt.init = function() {

		;(function ( $, window, document, undefined ) {
			
			$variation_form = $( '.variations_form' );
			$variation_form.on( 'show_variation', function( event, variation ) {
				dt.updatePricingTable(variation);
			} );

			$quantity_field = $( '.input-text.qty' );
			$quantity_field.on( 'input', dt.updateDisplayPrice );

		})( jQuery, window, document );

	};

	dt.updateDisplayPrice = function() {
		var qty = parseInt( $quantity_field[0].value );
		if(qty) {
			for( var key in dt.prices ) {
				if( qty >= dt.prices[key].from && qty <= dt.prices[key].to ) {
					var discounted_price = dt.prices[key].price;
				} else if( qty >= dt.prices[key].from && dt.prices[key].to === null ) {
					var discounted_price = dt.prices[key].price;
				}
			}
			if(discounted_price) {
				jQuery( 'ins .woocommerce-Price-amount.amount' ).html( '<span class="woocommerce-Price-currencySymbol">$</span>'+ discounted_price +' each');
			}
		}
	};
	
	dt.updatePricingTable = function( variation ) {
		dt.variation = variation;
		var pricing = wcdpdt_wc_product_pricing;
		var target = document.querySelector( 'p.price' );
		target.innerHTML = '';
		var element = document.getElementById( 'pricebreaks' );
		var appendElement = false;

		if(!element) {
			element = document.createElement( 'div' );
			element.id = 'pricebreaks';
			element.className = 'pricebreaks';
			appendElement = true;
		}

		dt.prices.push( { 'from': 1, 'to': 1, 'price': variation.display_price.toFixed( wcdpdt_wc_price_num_decimals ) } );

		var html = '<div class="pricebreak"><div class="heading">Qty</div><div class="heading">Price</div><div class="heading">Sale</div></div></div>';
		html += '<div class="pricebreak"><div class="qty">1</div><div class="price">$'+ variation.display_regular_price.toFixed( wcdpdt_wc_price_num_decimals ) +'</div><div class="sale_price">$'+ variation.display_price.toFixed( wcdpdt_wc_price_num_decimals ) +'</div></div>';
		if(pricing.rules) {
			for( var key in pricing.rules[0] ) {
				var rule = pricing.rules[0][key];
				var from = rule.from ? parseInt( rule.from ) : null;
				var to = rule.to ? parseInt( rule.to ) : null;
				var amount = rule.amount ? parseFloat( rule.amount ) : null;
				var price = 0;
				switch(rule.type) {
					case 'percentage_discount':
					price = dt.ceil(variation.display_price - ( variation.display_price * ( amount / 100 ) ), -2 );
					sale_price = dt.ceil(variation.display_regular_price - ( variation.display_regular_price * ( amount / 100 ) ), -2 );
					break;
					case 'price_discount':
					price = ( variation.display_price - amount );
					sale_price = ( variation.display_regular_price - amount );
					break;
					case 'fixed_price':
					price = amount;
					sale_price = amount;
					break;
				}

				price = price.toFixed( wcdpdt_wc_price_num_decimals );
				sale_price = sale_price.toFixed( wcdpdt_wc_price_num_decimals );
				if(price > 0 && rule.from > 0) {
					html += '<div class="pricebreak"><div class="qty">'+ rule.from +'</div><div class="price">$'+ sale_price +'</div><div class="sale_price">$'+ price +'</div></div>';
					dt.prices.push( { 'from': from, 'to': to, 'price': price, 'sale_price': sale_price } );
				}
			}
			element.innerHTML = html;
			
			if( appendElement ) {
				target.appendChild( element );
			}

			dt.updateDisplayPrice();
		}

	};

	dt.ceil = function( value, exp ) {
    if ( typeof exp === 'undefined' || +exp === 0 ) {
      return Math['ceil']( value );
    }
    value = +value;
    exp = +exp;
    if (isNaN( value ) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    value = value.toString().split('e');
    value = Math['ceil']( + ( value[0] + 'e' + ( value[1] ? ( +value[1] - exp ) : - exp ) ) );
    value = value.toString().split( 'e' );
    return + ( value[0] + 'e' + ( value[1] ? ( + value[1] + exp ) : exp ) );
  };

  dt.init();
}

new WooCommerceDynamicPricingDisplayTable();