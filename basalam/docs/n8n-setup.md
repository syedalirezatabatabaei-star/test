# راه‌اندازی n8n برای باسلام

## Import
1. در n8n به Workflows → Import from File بروید.
2. فایل `workflows/basalam-products-excel.json` را Import کنید.
3. در نود **Basalam Products Webhook** مقدار Authentication روی `None` است.
4. Workflow را ذخیره و Active کنید.

## تست
```bash
curl -X POST 'https://YOUR-N8N-DOMAIN/webhook/basalam-products-excel' \
  -H 'Content-Type: application/json' \
  -d '{"query":"عسل طبیعی","limit":30,"page":1,"sort":"relevance"}' \
  --output basalam-products.xlsx
```

فیلتر قیمت (مقادیر تومان):
```json
{
  "query": "زعفران",
  "min_price": 100000,
  "max_price": 1000000,
  "free_shipping": true,
  "has_discount": true,
  "limit": 30,
  "page": 1
}
```

## عیب‌یابی
- 400: ورودی یا فیلترها نامعتبر است.
- 422: نتیجه‌ای برنگشته؛ عبارت یا صفحه را عوض کنید.
- 403: درخواست از سمت باسلام مسدود شده است؛ تکرار تهاجمی یا bypass انجام ندهید.
- 429: محدودیت نرخ؛ مدتی صبر کنید.
- 5xx: اختلال سمت سرویس باسلام؛ بعداً دوباره امتحان کنید.
- اگر پاسخ JSON به‌جای فایل دریافت شد، متن پاسخ را بررسی کنید؛ معمولاً خطای اعتبارسنجی یا upstream است.

Authentication=None برای تست ساده است، اما URL وبهوک را محرمانه نگه دارید. برای استفاده دائمی احراز هویت را در n8n فعال کنید.