# راه‌اندازی n8n برای اُکالا

## Credential
در n8n یک Header Auth credential بسازید:
- Name: `X-Okala-Import-Key`
- Value: secret تصادفی قوی
در نود Webhook همین credential را انتخاب کنید. secret فقط در credential manager نگهداری شود.

## نمونه تست
```bash
curl -X POST 'https://YOUR-N8N-DOMAIN/webhook/okala-products-excel' \
  -H 'Content-Type: application/json' \
  -H 'X-Okala-Import-Key: YOUR_SECRET' \
  -d '{"query":"شیر","lat":35.7219,"lon":51.3347,"limit":50}' \
  --output okala-products.xlsx
```

مختصات نمونه صرفاً برای شکل درخواست است؛ آن‌ها را با مختصات واقعی محدوده سرویس‌دهی مقصد جایگزین کنید.

## عیب‌یابی
- 400: ورودی query/category_slug یا مختصات نامعتبر است.
- 422: دسته‌ای پیدا نشده یا محصولی برنگشته است؛ category_slug دقیق‌تر بفرستید.
- 403/429/5xx از upstream: به معنی محدودیت یا اختلال سمت اُکالا است؛ retry تهاجمی یا bypass انجام ندهید.
