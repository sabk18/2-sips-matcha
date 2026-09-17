/**
 * Shopify Buy Button embed — product lives in the "2 Sips Matcha" Shopify
 * store, checkout/payments/shipping/customer accounts are all handled by
 * Shopify. The storefrontAccessToken below is a public Storefront API
 * token — it's designed to be exposed client-side, not a secret.
 *
 * To swap the product later (new tin size, new SKU, etc.), update
 * PRODUCT_ID below with the new product's numeric id from a fresh Buy
 * Button embed code in Shopify admin (Sales channels -> Buy Button).
 */
(function () {
  var SHOP_DOMAIN = "vipfpy-dt.myshopify.com";
  var STOREFRONT_TOKEN = "ed6659c4406d721bc38aa327bddee9ed";
  var PRODUCT_ID = "10178061664499";
  var NODE_ID = "product-component-1789609571788";

  var scriptURL = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      shopifyBuyInit();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }

  function loadScript() {
    var script = document.createElement("script");
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(script);
    script.onload = shopifyBuyInit;
  }

  function shopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: SHOP_DOMAIN,
      storefrontAccessToken: STOREFRONT_TOKEN,
    });

    var brandButton = {
      "background-color": "#2a3f32",
      ":hover": { "background-color": "#4d6b52" },
      ":focus": { "background-color": "#4d6b52" },
      "border-radius": "999px",
      "padding-left": "2rem",
      "padding-right": "2rem",
      "padding-top": "0.85rem",
      "padding-bottom": "0.85rem",
      "font-family": "Outfit, system-ui, sans-serif",
      "font-size": "0.9rem",
      "font-weight": "500",
      "box-shadow": "none",
    };

    var node = document.getElementById(NODE_ID);
    if (!node) return;

    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent("product", {
        id: PRODUCT_ID,
        node: node,
        moneyFormat: "%24%7B%7Bamount%7D%7D",
        options: {
          product: {
            googleFonts: ["Outfit:400,500,600", "Cormorant Garamond:400,600"],
            contents: {
              img: true,
              title: true,
              price: true,
              options: true,
              button: false,
              buttonWithQuantity: true,
            },
            styles: {
              product: {
                "@media (min-width: 601px)": {
                  "max-width": "100%",
                  "margin-left": "0",
                  "margin-bottom": "0",
                },
                "text-align": "left",
              },
              title: {
                "font-family": "'Cormorant Garamond', Georgia, serif",
                "font-weight": "600",
                "font-size": "1.75rem",
                color: "#2a3f32",
              },
              price: {
                "font-family": "Outfit, system-ui, sans-serif",
                "font-size": "1.1rem",
                "font-weight": "500",
                color: "#1c2a22",
              },
              button: brandButton,
              quantityInput: {
                "border-radius": "8px",
                "border": "1px solid rgba(42, 63, 50, 0.2)",
              },
            },
            text: {
              button: "Add to cart",
            },
          },
          productSet: {
            styles: {
              products: {
                "@media (min-width: 601px)": { "margin-left": "0" },
              },
            },
          },
          modalProduct: {
            contents: {
              img: false,
              imgWithCarousel: true,
              button: false,
              buttonWithQuantity: true,
            },
            styles: {
              product: {
                "@media (min-width: 601px)": {
                  "max-width": "100%",
                  "margin-left": "0",
                  "margin-bottom": "0",
                },
              },
              button: brandButton,
            },
            text: { button: "Add to cart" },
          },
          option: {},
          cart: {
            styles: {
              button: brandButton,
            },
            text: {
              total: "Subtotal",
              button: "Checkout",
            },
          },
          toggle: {
            styles: {
              toggle: {
                "background-color": "#2a3f32",
                ":hover": { "background-color": "#4d6b52" },
                ":focus": { "background-color": "#4d6b52" },
              },
            },
          },
        },
      });
    });
  }
})();
