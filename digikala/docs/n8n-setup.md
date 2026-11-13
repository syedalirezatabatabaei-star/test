# راه‌اندازی n8n برای دیجی‌کالا

## Import
1. در n8n به Workflows → Import from File بروید.
2. فایل `workflows/digikala-products-excel.json` را Import کنید.
3. در نود **Digikala Products Webhook** مقدار Authentication روی `None` است.
4. Workflow را ذخیره و Active کنید.

## تست
```bash
curl -X POST 'https://YOUR-N8N-DOMAIN/webhook/digikala-products-excel' \
  -H 'Content-Type: application/json' \
  -d '{"query":"گوشی سامسونگ","limit":20,"page":1,"sort":"relevance"}' \
  --output digikala-products.xlsx
```

فیلتر قیمت به تومان:
```json
{
  "query": "هدفون بلوتوثی",
  "min_price": 1000000,
  "max_price": 5000000,
  "in_stock_only": true,
  "limit": 20,
  "page": 1
}
```

## عیب‌یابی
- 400: ورودی نامعتبر است؛ sort و بازه قیمت را بررسی کنید.
- 422: نتیجه‌ای برنگشته؛ عبارت یا صفحه را تغییر دهید.
- 403: درخواست از سمت دیجی‌کالا مسدود شده است؛ تکرار تهاجمی یا bypass انجام ندهید.
- 429: محدودیت نرخ؛ مدتی صبر کنید.
- 5xx: اختلال سمت دیجی‌کالا؛ بعداً دوباره امتحان کنید.
- 502: ساختار پاسخ با انتظار ورک‌فلو متفاوت است؛ خروجی نود HTTP و Normalize را بررسی کنید.

Authentication=None برای تست ساده است، اما URL وبهوک را محرمانه نگه دارید. برای استفاده دائمی احراز هویت را در n8n فعال کنید.