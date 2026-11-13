# Torob Browser Import → Excel

Reads only Torob product cards already rendered in the active tab. It does not access cookies, sessions, CAPTCHA contents, or automate challenge solving. Scroll manually to load more cards.

## Chrome install
1. Open chrome://extensions and enable Developer mode.
2. Load unpacked and select extensions/torob-browser-import.
3. Open a Torob search page, scroll to load the desired cards, open the extension popup.
4. Enter the production n8n webhook URL, Header Auth secret and search query; click Export.

## n8n
1. Import workflows/torob-browser-import-excel.json.
2. Create Header Auth credential: header name X-Torob-Import-Key, value a long random secret (32+ chars).
3. Select that credential on Browser Import Webhook after import (credential ID is a placeholder).
4. Activate workflow and use /webhook/torob-browser-import-excel.
5. Configure reverse-proxy CORS to allow the Chrome extension origin and headers Content-Type, X-Torob-Import-Key.

## Excel fields
query, product_id, product_title, price_display, price_toman, store_count, condition, product_kind, is_ad, product_url, source_url, captured_at.

Persian/Arabic digits are normalized; raw price text is retained. Product ID from /p/{id} is the dedupe key, canonical URL fallback. Unknown values remain null/نامشخص. No seller-level names or prices are collected. Stop on Torob access restrictions; never bypass CAPTCHA, 403 or 429.

Live execution in n8n has not been verified by repository creation alone.