# Torob Browser Import → Excel

Reads only Torob product cards already rendered in the active tab. Scroll manually to load more cards.

## Safe CAPTCHA / challenge handling

Before scanning the DOM, the content script checks for common CAPTCHA/challenge indicators in the page title, visible page text and common challenge elements. If a challenge is detected, it returns a `TOROB_CHALLENGE` status and does not send any product data to n8n. It does not inspect or solve CAPTCHA answers, automate verification, spoof browser fingerprints, or bypass access controls.

To continue: complete the site's verification manually in the same Torob tab, then reopen the extension and click **بررسی و خروجی** again. This is an explicit fresh scan, not an automatic retry. If the page remains challenged, scanning stays stopped. Detection is heuristic and may not recognize every challenge page or may flag a page that mentions CAPTCHA in unrelated text.

HTTP errors from the n8n request are shown to the user; the extension does not automatically retry requests.

## Chrome install

1. Open `chrome://extensions` and enable Developer mode.
2. Load unpacked and select `extensions/torob-browser-import`.
3. Open a Torob search page, scroll to load the desired cards, open the extension popup.
4. Enter the production n8n webhook URL, Header Auth secret and search query; click **بررسی و خروجی**.
5. If a challenge appears, complete it manually in the same tab and click the button again.

## n8n

1. Import `workflows/torob-browser-import-excel.json`.
2. Create Header Auth credential: header name `X-Torob-Import-Key`, value a long random secret (32+ chars).
3. Select that credential on Browser Import Webhook after import (credential ID is a placeholder).
4. Activate workflow and use `/webhook/torob-browser-import-excel`.
5. Configure reverse-proxy CORS to allow the Chrome extension origin and headers `Content-Type, X-Torob-Import-Key`.

## Excel fields

`query, product_id, product_title, price_display, price_toman, store_count, condition, product_kind, is_ad, product_url, source_url, captured_at`.

Persian/Arabic digits are normalized; raw price text is retained. Product ID from `/p/{id}` is the dedupe key, canonical URL fallback. Unknown values remain null/نامشخص. No seller-level names or prices are collected. Stop on Torob access restrictions; never bypass CAPTCHA, 403 or 429.

Live execution in n8n has not been verified by repository creation alone.
