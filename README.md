# Scared Read

A GitHub Pages-ready ecommerce website built with plain HTML, CSS and JavaScript.

## Files

- `index.html` — homepage
- `shop.html` — product listing, filters, search and sorting
- `product.html` — product details
- `login.html` — login
- `register.html` — registration
- `account.html` — account/logout
- `cart.html` — shopping cart
- `checkout.html` — shipping + payment + purchase flow
- `order-success.html` — purchase confirmation
- `css/style.css` — all styling
- `js/app.js` — products, cart, auth, ecommerce events and UI logic

## GitHub Pages

1. Create a GitHub repository.
2. Upload all files/folders while preserving the structure.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and `/ (root)`.
6. Save and open the GitHub Pages URL.

No Node.js, npm or build process is required.

## GTM

The supplied Google Tag Manager container is included at the beginning of `<head>` and the noscript iframe is at the beginning of `<body>` on every page.

Container: `GTM-M3XV9357`

## Ecommerce events

The JavaScript pushes ecommerce events to `dataLayer` for:

- `view_item_list` (listing can be wired to this event in GTM)
- `view_item`
- `add_to_wishlist`
- `add_to_cart`
- `remove_from_cart`
- `begin_checkout`
- `add_shipping_info`
- `add_payment_info`
- `purchase`
- `purchase_error`
- `login`
- `sign_up`
- `logout`
- `newsletter_subscribe`

The purchase flow has a small simulated payment-failure probability so the error state can be tested. This is a frontend demo: it does not process real money.

## Amplitude user_id behavior

The code intentionally does **not** convert `undefined` or `null` to strings.

- Guest / not logged in: `user_id` is JavaScript `undefined`.
- Logged in: a generated ID such as `SRU-...` is used.
- Logout: the logout tracking payload uses JavaScript `null`.

The demo stores account/cart data in `localStorage`, so it works on static hosting. For production, authentication, customer data and payment processing should be moved to a secure backend/payment provider.
