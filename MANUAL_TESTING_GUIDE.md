# Manual Testing Guide - Ratimutsa Farm

## Prerequisites

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Ensure database is running** and seeded with test data

3. **Set environment variables** in `.env`:
   ```env
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

---

## Task 11: Order Tracking API

### Test 1: Valid Order Tracking
1. Go to `/track-order`
2. Enter a valid order ID from your database
3. Enter the matching phone number
4. Click "Track Order"
5. **Expected**: Order details display with status timeline

### Test 2: Invalid Order ID
1. Go to `/track-order`
2. Enter "INVALID123" as order ID
3. Enter any phone number
4. Click "Track Order"
5. **Expected**: Error message "Order not found. Please check your order ID and phone number."

### Test 3: Wrong Phone Number
1. Go to `/track-order`
2. Enter a valid order ID
3. Enter a different phone number (not matching the order)
4. Click "Track Order"
5. **Expected**: Error message "Order not found..." (security - doesn't reveal order exists)

### Test 4: Missing Fields
1. Go to `/track-order`
2. Leave order ID or phone empty
3. Try to submit
4. **Expected**: HTML5 validation prevents submission

### Test 5: Phone Number Normalization
1. Go to `/track-order`
2. Enter valid order ID
3. Try phone with different formats:
   - `+263 779 527 507`
   - `263779527507`
   - `+263-779-527-507`
4. **Expected**: All formats should work (normalization removes spaces/dashes)

---

## Task 13: Rate Limiting

### Test 6: Login Rate Limiting
1. Go to `/admin/login`
2. Enter wrong credentials 5 times quickly
3. **Expected**: First 5 attempts return "Invalid credentials"
4. Try 6th attempt
5. **Expected**: "Too many login attempts. Please try again later."
6. Check browser DevTools Network tab
7. **Expected**: 429 status code with rate limit headers:
   - `X-RateLimit-Limit: 5`
   - `X-RateLimit-Remaining: 0`
   - `X-RateLimit-Reset: [timestamp]`
   - `Retry-After: [seconds]`

### Test 7: Order Creation Rate Limiting
**Note**: This requires creating orders programmatically or very quickly

1. Create 10 orders rapidly (use API or checkout)
2. **Expected**: First 10 succeed
3. Try 11th order
4. **Expected**: 429 error "Too many order requests. Please try again later."

### Test 8: Rate Limit Reset
1. After hitting rate limit, wait 15 minutes (for login)
2. Try logging in again
3. **Expected**: Rate limit counter reset, login attempts work again

---

## Task 14: Order Filters in Admin

### Test 9: Search Filter
1. Login as admin
2. Go to `/admin/orders`
3. Type customer name in search box
4. **Expected**: Orders filter instantly to show matching customers
5. Try searching by:
   - Phone number
   - Email
   - Order ID (first 8 characters)
6. **Expected**: All search types work

### Test 10: Status Filter
1. Go to `/admin/orders`
2. Click "Filters" button
3. Select "PENDING" from Status dropdown
4. **Expected**: Only pending orders shown
5. Try other statuses
6. **Expected**: Filters update instantly

### Test 11: Customer Type Filter
1. Go to `/admin/orders`
2. Open filters
3. Select "B2C" from Customer Type
4. **Expected**: Only B2C orders shown
5. Select "B2B"
6. **Expected**: Only B2B orders shown

### Test 12: Date Range Filter
1. Go to `/admin/orders`
2. Open filters
3. Set "From Date" to 1 week ago
4. Set "To Date" to today
5. **Expected**: Only orders within date range shown

### Test 13: Combined Filters
1. Go to `/admin/orders`
2. Apply multiple filters:
   - Search: customer name
   - Status: CONFIRMED
   - Type: B2C
   - Date range: last month
3. **Expected**: All filters work together (AND logic)
4. Check active filters badges
5. **Expected**: All active filters shown as removable badges

### Test 14: Pagination
1. Go to `/admin/orders` (ensure you have 20+ orders)
2. **Expected**: Only 20 orders per page
3. Click page numbers at bottom
4. **Expected**: Navigate between pages
5. Apply a filter
6. **Expected**: Pagination resets to page 1

### Test 15: CSV Export
1. Go to `/admin/orders`
2. Apply some filters (optional)
3. Click "Export CSV" button
4. **Expected**: CSV file downloads with filtered orders
5. Open CSV file
6. **Expected**: Contains columns: Order ID, Customer Name, Phone, Email, Type, Status, Total, Date, Items

### Test 16: Clear Filters
1. Go to `/admin/orders`
2. Apply multiple filters
3. Click "Clear All" button
4. **Expected**: All filters reset, all orders shown

---

## Task 15: Product Duplication

### Test 17: Duplicate Product
1. Login as admin
2. Go to `/admin/products`
3. Find any product
4. Click "Duplicate" button next to it
5. **Expected**: Confirmation dialog appears
6. Click "OK"
7. **Expected**: 
   - Loading state shows "Duplicating..."
   - Redirects to edit page of new product
8. Check new product details:
   - Name has "(Copy)" appended
   - Slug has timestamp suffix
   - Status is "DRAFT"
   - Availability is "Unavailable"
   - All variants are duplicated
   - Variant SKUs have timestamp suffix

### Test 18: Duplicate Product with Variants
1. Go to `/admin/products`
2. Find a product with multiple variants
3. Click "Duplicate"
4. Confirm
5. **Expected**: New product created with all variants
6. Check variant SKUs
7. **Expected**: All SKUs are unique (have timestamp suffix)

### Test 19: Cancel Duplication
1. Go to `/admin/products`
2. Click "Duplicate" on any product
3. Click "Cancel" in confirmation dialog
4. **Expected**: No duplication occurs, stays on products page

---

## Task 16: SEO Optimization

### Test 20: Global Metadata
1. Go to homepage `/`
2. View page source (Ctrl+U or Cmd+U)
3. Check `<head>` section
4. **Expected**: Find these tags:
   - `<title>Ratimutsa Farm — Premium Agricultural Marketplace</title>`
   - `<meta name="description" content="Experience the finest farm-fresh produce...">`
   - `<meta property="og:title" content="...">`
   - `<meta property="og:image" content="/images/hero-farm.png">`
   - `<meta name="twitter:card" content="summary_large_image">`
   - `<link rel="canonical" href="...">`

### Test 21: Product Page Metadata
1. Go to any product page (e.g., `/products/eggs`)
2. View page source
3. **Expected**: Find:
   - `<title>Eggs — Poultry | Ratimutsa Farm</title>`
   - Product-specific description
   - Product image in Open Graph tags
   - Canonical URL for this product

### Test 22: Structured Data (JSON-LD)
1. Go to any product page
2. View page source
3. Search for `application/ld+json`
4. **Expected**: Find JSON-LD script with:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Product",
     "name": "Product Name",
     "description": "...",
     "brand": { "@type": "Brand", "name": "Ratimutsa Farm" },
     "offers": {
       "@type": "Offer",
       "price": ...,
       "priceCurrency": "USD",
       "availability": "InStock" or "OutOfStock"
     }
   }
   ```

### Test 23: Sitemap
1. Go to `/sitemap.xml`
2. **Expected**: XML sitemap displays with:
   - Homepage
   - Products page
   - About page
   - Contact page
   - All published products
   - All category pages
3. Check a product entry
4. **Expected**: Has `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`

### Test 24: Robots.txt
1. Go to `/robots.txt`
2. **Expected**: See:
   ```
   User-Agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /api/
   Disallow: /checkout/
   Disallow: /_next/
   Disallow: /order-success/
   
   Sitemap: http://localhost:3000/sitemap.xml
   ```

### Test 25: Social Media Preview
1. Use Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
2. Enter your product page URL
3. **Expected**: Preview shows:
   - Product name as title
   - Product description
   - Product image
   - Site name: Ratimutsa Farm

4. Use Twitter Card Validator: https://cards-dev.twitter.com/validator
5. Enter your product page URL
6. **Expected**: Preview shows product card with image

### Test 26: Google Rich Results Test
1. Go to: https://search.google.com/test/rich-results
2. Enter your product page URL
3. **Expected**: Detects "Product" structured data
4. Shows no errors
5. Preview displays product information

---

## Task 12: Enhanced Analytics Dashboard

### Test 27: Analytics Access Control
1. Login as REGULAR_ADMIN
2. Try to go to `/admin/analytics`
3. **Expected**: Redirected to `/admin` (access denied)
4. Logout and login as SENIOR_ADMIN
5. Go to `/admin/analytics`
6. **Expected**: Dashboard loads successfully

### Test 28: Key Metrics Cards
1. Go to `/admin/analytics` (as SENIOR_ADMIN)
2. **Expected**: See 4 metric cards:
   - Total Revenue (green, with $ amount)
   - Total Orders (with B2C/B2B split)
   - Avg. Order Value
   - Customer Split (B2C % / B2B %)
3. Check if numbers match your database

### Test 29: Revenue Trend Chart
1. Scroll to "Revenue Trend" section
2. **Expected**: See bar chart showing last 6 months
3. Hover over bars
4. **Expected**: See month and revenue amount
5. Check if bars scale correctly (highest revenue = longest bar)

### Test 30: Customer Demographics Pie Chart
1. Scroll to "Customer Demographics" section
2. **Expected**: See circular pie chart with:
   - Green segment for B2C
   - Brown segment for B2B
   - Total orders in center
3. Check legend below
4. **Expected**: Shows percentages and order counts

### Test 31: Top Products Display
1. Scroll to "Top Selling Products" section
2. **Expected**: See 5 product cards with:
   - Ranking number (1-5)
   - Product name
   - Number of orders
   - Units sold
3. Check if products are sorted by units sold (descending)

### Test 32: Inventory Turnover Table
1. Scroll to "Inventory Turnover" section
2. **Expected**: See table with:
   - Product/Variant name
   - Current stock
   - Total ordered
   - Turnover rate (colored)
   - Performance bar
3. Check color coding:
   - Green: rate > 1x (high turnover)
   - Amber: rate > 0.5x (medium)
   - Gray: rate < 0.5x (low)

### Test 33: CSV Export
1. Click "Export CSV" button at top
2. **Expected**: CSV file downloads
3. Open CSV file
4. **Expected**: Contains:
   - Total Revenue
   - Total Orders
   - B2C/B2B counts
   - Average Order Value
   - Top Products with details

### Test 34: Date Range Filter (UI Only)
1. Click date range dropdown at top
2. **Expected**: See options:
   - Last 7 Days
   - Last 30 Days
   - Last 90 Days
   - All Time
3. Select different options
4. **Note**: Data doesn't change (backend not implemented yet)
5. **Expected**: UI updates to show selection

### Test 35: Empty State
1. Test with empty database (no orders)
2. Go to `/admin/analytics`
3. **Expected**: See empty state messages:
   - "No order data yet"
   - "No sales data yet"
   - "No inventory data yet"

### Test 36: Responsive Design
1. Open `/admin/analytics`
2. Resize browser window to mobile size
3. **Expected**: 
   - Metrics cards stack vertically
   - Charts remain readable
   - Table scrolls horizontally
   - All content accessible

---

## Cross-Feature Tests

### Test 37: Order Tracking → Admin Orders
1. Create an order as customer
2. Note the order ID
3. Track order on `/track-order`
4. Login as admin
5. Go to `/admin/orders`
6. Search for the same order ID
7. **Expected**: Order appears in both places with same details

### Test 38: Product Duplication → SEO
1. Duplicate a product
2. Edit the duplicated product
3. Publish it (set to available)
4. Go to `/sitemap.xml`
5. **Expected**: New product appears in sitemap
6. Go to product page
7. **Expected**: Has proper metadata and structured data

### Test 39: Rate Limiting → Order Tracking
1. Hit rate limit on order creation (10 orders)
2. Try to track an order
3. **Expected**: Order tracking still works (different endpoint)

### Test 40: Analytics → Order Filters
1. Note analytics numbers (total orders, B2C/B2B split)
2. Go to `/admin/orders`
3. Filter by B2C
4. Count orders
5. **Expected**: Count matches B2C number in analytics
6. Repeat for B2B

---

## Performance Tests

### Test 41: Order Filters Performance
1. Go to `/admin/orders` with 100+ orders
2. Type in search box
3. **Expected**: Results filter instantly (< 100ms)
4. Change filters rapidly
5. **Expected**: No lag or freezing

### Test 42: Analytics Load Time
1. Clear browser cache
2. Go to `/admin/analytics`
3. Measure page load time
4. **Expected**: Loads in < 3 seconds (with reasonable data)

### Test 43: Sitemap Generation
1. Add 100+ products to database
2. Go to `/sitemap.xml`
3. **Expected**: Generates within 5 seconds
4. Check file size
5. **Expected**: Reasonable size (< 1MB for 100 products)

---

## Error Handling Tests

### Test 44: API Error Handling
1. Stop database
2. Try to track an order
3. **Expected**: User-friendly error message (not database error)
4. Try to load admin orders
5. **Expected**: Graceful error handling

### Test 45: Invalid Product Duplication
1. Try to duplicate non-existent product (use API directly)
2. **Expected**: 404 error with message "Product not found"

### Test 46: Unauthorized Access
1. Logout
2. Try to access `/admin/analytics` directly
3. **Expected**: Redirected to login or access denied

---

## Browser Compatibility Tests

### Test 47: Chrome/Edge
1. Open site in Chrome or Edge
2. Test all features
3. **Expected**: Everything works perfectly

### Test 48: Firefox
1. Open site in Firefox
2. Test key features (order tracking, filters, analytics)
3. **Expected**: All features work correctly

### Test 49: Safari
1. Open site in Safari (Mac/iOS)
2. Test key features
3. **Expected**: All features work correctly

### Test 50: Mobile Browser
1. Open site on mobile device
2. Test:
   - Order tracking
   - Admin orders (if screen size allows)
   - Analytics dashboard
3. **Expected**: Responsive design works, all features accessible

---

## Security Tests

### Test 51: SQL Injection
1. Try SQL injection in order tracking:
   - Order ID: `' OR '1'='1`
   - Phone: `' OR '1'='1`
2. **Expected**: No SQL injection (Prisma protects)

### Test 52: XSS Prevention
1. Create order with name: `<script>alert('XSS')</script>`
2. View order in admin
3. **Expected**: Script doesn't execute (React escapes)

### Test 53: CSRF Protection
1. Try to duplicate product from external site
2. **Expected**: Fails (Next.js CSRF protection)

---

## Accessibility Tests

### Test 54: Keyboard Navigation
1. Use only keyboard (Tab, Enter, Space)
2. Navigate through:
   - Order tracking form
   - Admin order filters
   - Analytics dashboard
3. **Expected**: All interactive elements accessible

### Test 55: Screen Reader
1. Use screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate order tracking page
3. **Expected**: All content announced correctly
4. Test admin orders page
5. **Expected**: Table structure announced

### Test 56: Color Contrast
1. Use browser DevTools Accessibility panel
2. Check color contrast on:
   - Buttons
   - Text
   - Status badges
3. **Expected**: All meet WCAG AA standards (4.5:1 for text)

---

## Final Integration Test

### Test 57: Complete User Journey
1. **Customer Flow**:
   - Browse products
   - Add to cart
   - Checkout (create order)
   - Track order
   - **Expected**: Smooth flow, order trackable

2. **Admin Flow**:
   - Login
   - View orders (with filters)
   - Update order status
   - View analytics
   - Duplicate a product
   - **Expected**: All admin features work together

3. **SEO Flow**:
   - View sitemap
   - Check product metadata
   - Verify structured data
   - **Expected**: All SEO elements present

---

## Test Completion Checklist

After completing all tests, verify:

- [ ] All 57 tests completed
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] Security measures working
- [ ] Accessibility standards met
- [ ] SEO elements present
- [ ] Cross-browser compatible
- [ ] Mobile responsive
- [ ] Error handling graceful
- [ ] Documentation accurate

---

## Reporting Issues

If you find any issues during testing:

1. **Note the test number** (e.g., Test 23)
2. **Describe the issue**:
   - What you did
   - What you expected
   - What actually happened
3. **Include**:
   - Browser and version
   - Screenshots if applicable
   - Console errors if any
4. **Severity**:
   - Critical: Feature doesn't work
   - High: Major functionality impaired
   - Medium: Minor issue, workaround exists
   - Low: Cosmetic or edge case

---

## Success Criteria

All features are considered **PASSED** if:

✅ No critical or high severity bugs
✅ All core functionality works as expected
✅ Performance is acceptable (< 3s page loads)
✅ Security measures prevent common attacks
✅ Accessible to keyboard and screen reader users
✅ Works in Chrome, Firefox, Safari
✅ Responsive on mobile devices
✅ SEO elements properly implemented

---

**Happy Testing! 🧪**

For questions or issues, refer to:
- `IMPLEMENTATION_SUMMARY.md` - Feature details
- `TEST_RESULTS.md` - Static analysis results
- Code comments in implementation files
