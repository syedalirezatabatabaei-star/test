# باسلام — استخراج محصولات و قیمت به Excel

این پوشه یک ورک‌فلو مستقل n8n برای جستجوی عمومی محصولات باسلام و دریافت خروجی Excel است.

## منابع بررسی‌شده
- [مستندات رسمی Basalam Open API](https://github.com/basalam/openapi-docs)
- [SDK رسمی پایتون باسلام](https://github.com/basalam/python-sdk): سرویس Search در مسیر `POST /v1/products/search` با `require_auth=False` تعریف شده است.
- [basalam-mcp](https://github.com/sepehr071/basalam-mcp): پیاده‌سازی عمومی و فقط‌خواندنی که endpoint جستجوی وب `https://services.basalam.com/web/v1/search/product/search` و پارامترهای آن را استفاده می‌کند.
- [Basalam Product Scrapper](https://github.com/SiRMHS/Basalam-product-scrapper): نمونه استخراج جزئیات محصولات و ساخت Excel.

## روش کار
1. Webhook درخواست POST را می‌گیرد.
2. عبارت جستجو، صفحه، محدودیت و فیلترها اعتبارسنجی می‌شوند.
3. endpoint جستجوی عمومی وب باسلام فراخوانی می‌شود.
4. قیمت ریالی به تومان تبدیل و محصولات بر اساس شناسه یکتا می‌شوند.
5. فایل `basalam-products.xlsx` به درخواست‌کننده برگردانده می‌شود.

## Webhook
`POST /webhook/basalam-products-excel`
Authentication روی `None` است تا با تنظیم فعلی n8n شما سازگار باشد. URL را عمومی منتشر نکنید؛ هر دارنده URL می‌تواند آن را فراخوانی کند.

نمونه Body:
```json
{
  "query": "عسل طبیعی",
  "limit": 30,
  "page": 1,
  "sort": "relevance"
}
```

فیلدهای اختیاری:
- `sort`: یکی از `relevance`, `bestselling`, `cheapest`, `expensive`, `newest`
- `min_price`, `max_price`: تومان
- `category_id`: شناسه دسته‌بندی باسلام
- `free_shipping`, `has_discount`, `top_vendors`, `installments`: مقدار true/false
- `limit`: حداکثر 30 محصول در هر صفحه
- `page`: صفحه 1 تا 200

## نکات جغرافیایی
برخلاف اُکالا، جستجوی عمومی باسلام در این endpoint بر اساس مختصات یا شهر اصفهان فیلتر نمی‌شود. نتایج در سطح بازار باسلام هستند؛ نباید آن را فقط فروشندگان اصفهان تلقی کرد. فیلتر same-city در SDK رسمی وجود دارد، اما فیلتر صریح شهر اصفهان در قرارداد جستجوی این ورک‌فلو تأیید نشده و عمداً جعل نشده است.

## محدودیت‌ها
- endpoint وب `services.basalam.com/web/v1/search/product/search` یک endpoint عمومی وب‌سایت است، نه قرارداد تضمین‌شده برای مصرف تجاری؛ ممکن است تغییر کند.
- پروژه basalam-mcp نیز غیررسمی است و endpoint وب را بدون ورود استفاده می‌کند.
- حداکثر 30 محصول در هر درخواست پشتیبانی می‌شود؛ برای صفحه‌های بعدی مقدار `page` را افزایش دهید.
- در صورت دریافت 403 یا 429، درخواست را متوقف کنید و بعداً با نرخ کمتر تست کنید؛ این ورک‌فلو محدودیت دسترسی را دور نمی‌زند.
- خروجی قیمت‌ها تومان است. قیمت اصلی و تخفیف بر اساس فیلدهای پاسخ جستجو محاسبه می‌شوند؛ بعضی محصولات ممکن است اطلاعات ناقص داشته باشند.
- فایل در این commit به n8n شما یا API زنده باسلام اجرا و اعتبارسنجی نشده است؛ پس از Import باید اجرای واقعی را بررسی کنید.