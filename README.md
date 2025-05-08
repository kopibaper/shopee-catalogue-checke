# Shopee Catalogue Checker

A Node.js package to check Shopee catalogue items by URL.

## Installation

```bash
npm install shopee-catalogue-checker
```

## Usage

```typescript
import { ShopeeCatalogueChecker } from 'shopee-catalogue-checker';

// Initialize with your cookies and URLs
const checker = new ShopeeCatalogueChecker({
    cookies: 'your-cookies-string',
    urls: [
        'https://shopee.co.id/product/123456/789012',
        'https://shopee.co.id/i.123456.789012'
    ],
    batchSize: 100 // optional, defaults to 100
});

// Check the items
checker.check()
    .then(items => {
        console.log('Found items:', items);
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

## API

### ShopeeCatalogueChecker

#### Constructor

```typescript
new ShopeeCatalogueChecker(options: ShopeeCatalogueCheckerOptions)
```

Options:
- `cookies`: string - Your Shopee cookies
- `urls`: string[] - Array of Shopee product URLs
- `batchSize`: number (optional) - Number of URLs to process in each batch (default: 100)

#### Methods

##### check()

```typescript
check(): Promise<CatalogueInfoItem[]>
```

Returns a promise that resolves to an array of catalogue items.

## License

MIT 