var WoocommerceDynamicPricingDisplayTable = function() {
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
		for( var key in dt.prices ) {
			if( qty >= dt.prices[key].from && qty <= dt.prices[key].to ) {
				var discounted_price = dt.prices[key].price;
			} else if( qty >= dt.prices[key].from && dt.prices[key].to === null ) {
				var discounted_price = dt.prices[key].price;
			}
		}
		jQuery( 'ins .woocommerce-Price-amount.amount' ).html( '<span class="woocommerce-Price-currencySymbol">$</span>'+ discounted_price );
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

		dt.prices.push( { 'from':1, 'to':1, 'price':variation.display_price.toFixed( 2 ) } );

		var html = '<div class="pricebreak"><div class="qty">1</div><div class="price">$'+ variation.display_price.toFixed( 2 ) +'</div></div>';
		for( var key in pricing.rules[0] ) {
			var rule = pricing.rules[0][key];
			var from = rule.from ? parseInt( rule.from ) : null;
			var to = rule.to ? parseInt( rule.to ) : null;
			var amount = rule.amount ? parseFloat( rule.amount ) : null;
			var price = 0;
			switch(rule.type) {
				case 'percentage_discount':
				price = dt.ceil(variation.display_price - ( variation.display_price * ( amount / 100 ) ), -2 ).toFixed( 2 );
				break;
				case 'price_discount':
				price = ( variation.display_price - amount ).toFixed( 2 );
				break;
				case 'fixed_price':
				price = amount.toFixed( 2 );
				break;
			}
			html += '<div class="pricebreak"><div class="qty">'+ rule.from +'</div><div class="price">$'+ price +'</div></div>';
			dt.prices.push( { 'from': from, 'to': to, 'price': price } );
		}
		element.innerHTML = html;
		
		if( appendElement ) {
			target.appendChild( element );
		}

		dt.updateDisplayPrice();

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

new WoocommerceDynamicPricingDisplayTable();