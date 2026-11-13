# راه‌اندازی n8n برای اُکالا

## Authentication
در تنظیم فعلی، Authentication نود Webhook روی `None` است. URL وبهوک را عمومی منتشر نکنید؛ هر دارنده URL می‌تواند درخواست بفرستد. برای استفاده دائمی، Header Auth را فعال کنید.

## نمونه تست
```bash
curl -X POST 'https://YOUR-N8N-DOMAIN/webhook/okala-products-excel' \
  -H 'Content-Type: application/json' \
  -H 'X-Okala-Import-Key: YOUR_SECRET' \
  -d '{"query":"شیر","lat":32.6546,"lon":51.6680,"limit":50}' \
  --output okala-products.xlsx
```

اگر مختصات را نفرستید، ورک‌فلو از مرکز شهر اصفهان (32.6546, 51.6680) استفاده می‌کند. مختصات نمونه برای مرکز شهر است؛ برای محدوده دقیق سرویس‌دهی، مختصات همان محله را ارسال کنید.

## عیب‌یابی
- 400: ورودی query/category_slug یا مختصات نامعتبر است.
- 422: دسته‌ای پیدا نشده یا محصولی برنگشته است؛ category_slug دقیق‌تر بفرستید.
- 403/429/5xx از upstream: به معنی محدودیت یا اختلال سمت اُکالا است؛ retry تهاجمی یا bypass انجام ندهید.
