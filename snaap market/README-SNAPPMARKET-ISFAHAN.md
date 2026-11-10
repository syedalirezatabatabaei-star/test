# SnappMarket Isfahan price collector — workflow notes

Workflow: `My workflow 2.json`

## What changed

- Generates a 10×10 grid (100 search points) over a configurable Isfahan coordinate envelope.
- Runs up to three product-search variants per point: exact query, same product without size, and a brandless/category query for other brands.
- Keeps closed stores and stores that do not deliver; status is recorded, not used as a filter.
- Keeps separate offers when the same store/product is observed at different prices.
- Produces seven workbook sheets: summary, exact products, similar brands, other sizes, nearest six matches, stores, and point coverage.
- Embeds product images when a supported image URL is actually present in the API response; also retains the image URL.

## Important geographic limitation

The default bounds in the workflow are an **operational rectangle**, not an official Isfahan municipal boundary:

- latitude: 32.50 to 32.78
- longitude: 51.43 to 51.88

The 100 grid points cover that rectangle. They do not prove complete coverage of the official municipal area, and some points may be outside the city. Replace these defaults with a verified municipal GeoJSON/polygon and generate points inside that polygon before claiming official city-wide coverage.

The webhook can override bounds through `location.min_lat`, `location.max_lat`, `location.min_long`, and `location.max_long`.

## Example webhook body

```json
{
  "product_name": "رب گوجه فرنگی اصالت 400 گرمی",
  "city": "اصفهان",
  "location": {
    "min_lat": 32.50,
    "max_lat": 32.78,
    "min_long": 51.43,
    "max_long": 51.88
  },
  "page_size": 36,
  "max_pages": 50
}
```

Optional `brand` may be supplied explicitly if automatic brand inference from the product phrase is ambiguous.

## n8n requirement for workbook generation

The `Build Multi-sheet XLSX` Code node uses the `exceljs` package to create a workbook with multiple sheets and embedded images. On a self-hosted n8n installation:

1. Install `exceljs` in the n8n runtime environment (not just on a separate host).
2. Allow the module in the Code node environment, for example with `NODE_FUNCTION_ALLOW_EXTERNAL=exceljs`.
3. Restart n8n after changing the environment.

If n8n runs in Docker, the package must exist inside the n8n image/container. Do not enable the workflow in production until this dependency is installed and a full test execution succeeds.

## Pagination and completeness

The HTTP Request node is configured for page-based pagination with a cap of 50 pages per query. This is a safety ceiling, not proof that all API results were returned. Check the `پوشش نقاط` sheet and compare each point/query's returned pages with API pagination/total fields. If the API changes its pagination contract, adjust the node and test it against live responses.

Each request currently fans out to up to 300 point/query combinations (100 points × 3 search variants), each potentially paginated. This may take time and can trigger API throttling. Keep request rates reasonable; consider batching points if the API starts returning 429/5xx.

## Image availability

The current observed SnappMarket search fixture and product-detail fixture do not show a guaranteed product-image field. The workflow checks common image keys, embeds images only when a valid image URL exists, and otherwise leaves the image cell blank while preserving any image URL. Do not infer or substitute an image from another product. If live responses do not contain product imagery, a separate verified image source or a product-detail endpoint with image metadata will be needed.

## Safety

- Workflow remains inactive (`active: false`).
- The Webhook node currently has no authentication configured. Add an authentication mechanism or put it behind a trusted gateway before enabling it publicly.
- This workflow only collects and exports data; it does not place orders.
