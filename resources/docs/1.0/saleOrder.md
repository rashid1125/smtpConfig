# Sale Order Routes Documentation

This document outlines the API routes for managing sale orders within the application, detailing the actions, methods, endpoints, and controllers involved.

## Base URL Prefix

All routes under sale order management are prefixed with `/saleOrder`.

## Routes Overview

### List Sale Orders

-   **Method:** GET
-   **Endpoint:** `/`
-   **Action:** Lists all sale orders.
-   **Controller:** `SaleOrderController@index`

### Save Sale Order

-   **Method:** POST
-   **Endpoint:** `/save`
-   **Action:** Saves a new sale order or updates an existing one.
-   **Controller:** `SaleOrderController@save`
-   **Save Sale Order Detail** [Save Sale Order Api](#save-sale-order-api)

### Get Sale Order By ID

-   **Method:** GET
-   **Endpoint:** `/getSaleOrderById`
-   **Action:** Retrieves a sale order by its ID.
-   **Controller:** `SaleOrderController@getSaleOrderById`

### Get Sale Orders for DataTable

-   **Method:** GET
-   **Endpoint:** `/getSaleOrderDataTable`
-   **Action:** Retrieves sale orders formatted for a DataTable.
-   **Controller:** `SaleOrderController@getSaleOrderDataTable`

### Delete Sale Order

-   **Method:** DELETE
-   **Endpoint:** `/delete`
-   **Action:** Deletes a specified sale order.
-   **Controller:** `SaleOrderController@delete`

## Detailed Endpoint Documentation

### Save Sale Order Api

#### Request Body Parameters

The request body must include a JSON object with the following structure:

## Sale Order Structure

-   `id`: Unique identifier for the sale order. _(integer)_
-   `vrdate`: Date of the sale order creation. _(date format: dd-mm-yyyy)_
-   `due_date`: Due date for the sale order. _(date format: dd-mm-yyyy)_
-   `chk_date`: Date of check. _(date format: dd-mm-yyyy)_
-   `party_id`: Identifier for the party involved in the sale. _(integer)_
-   `sale_officer_id`: Identifier for the sale officer. _(integer, nullable)_
-   `supplier_name`: Name of the supplier. _(string)_
-   `supplier_mobile`: Mobile number of the supplier. _(string)_
-   `prepared_by`: Name of the person who prepared the order. _(string)_
-   `discount_percentage`: Discount percentage applied to the order. _(decimal)_
-   `discount_amount`: Total discount amount in the order. _(decimal)_
-   `expense_percentage`: Percentage of additional expenses. _(decimal)_
-   `expense_amount`: Total amount of additional expenses. _(decimal)_
-   `further_tax_percentage`: Percentage of further tax applied. _(decimal)_
-   `further_tax_amount`: Amount of further tax applied. _(decimal)_
-   `net_amount`: Net amount after all calculations. _(decimal)_

## Sale Order Detail Structure

Each item in the `saleOrderDetail` array contains:

-   `item_id`: Unique identifier for the item. _(integer, required)_
-   `detail_remarks`: Any remarks for the item. _(string)_
-   `stock_keeping_method_id`: Identifier for the stock keeping method. _(integer, required)_
-   `rate_type_id`: Identifier for the rate type. _(integer, required)_
-   `item_price_list_id`: Identifier for the item price list. _(integer, required)_
-   `calculation_on`: Base for calculations. _(decimal, required)_
-   `division_factor`: Factor used for division in calculations. _(decimal, required)_
-   `qty`: Quantity of the item. _(decimal, varies based on stock keeping method)_
-   `weight`: Weight of the item. _(decimal, varies based on stock keeping method)_
-   `rate`: Rate of the item. _(decimal, required)_
-   `rate_per_kg`: Rate per kilogram if applicable. _(decimal)_
-   `gross_amount`: Gross amount for the item. _(decimal, required)_
-   `discount_percentage`: Discount percentage for the item. _(decimal)_
-   `discount_per_unit`: Discount per unit for the item. _(decimal)_
-   `discount_amount`: Total discount amount for the item. _(decimal)_
-   `rate_per_unit`: Rate per unit for the item. _(decimal)_
-   `amount_excl_tax`: Amount excluding tax. _(decimal, required)_
-   `tax_percentage`: Tax percentage applied. _(decimal)_
-   `tax_amount`: Tax amount applied. _(decimal)_
-   `amount_incl_tax`: Amount including tax. _(decimal, required)_

## Example Data

## Sale Order Example

```json
{
    "saleOrder": {
        "id": "integer|null", // Optional, will use default value from database if not provided
        "vrdate": "required|date", // Required, must be a date
        "due_date": "date|null", // Optional
        "chk_date": "date|null", // Optional
        "party_id": "required|integer", // Required, must be an integer
        "sale_officer_id": "integer|null", // Optional
        "supplier_name": "string|null", // Optional
        "supplier_mobile": "string|null", // Optional
        "prepared_by": "string|null", // Optional
        "discount_percentage": "decimal|null", // Optional
        "discount_amount": "decimal|null", // Optional
        "expense_percentage": "decimal|null", // Optional
        "expense_amount": "decimal|null", // Optional
        "further_tax_percentage": "decimal|null", // Optional
        "further_tax_amount": "decimal|null", // Optional
        "net_amount": "decimal|integer" // Required, can be decimal or integer
    },
    "saleOrderDetail": [
        {
            "item_id": "required|integer",
            "detail_remarks": "string", // Assuming value is fetched dynamically, e.g., from a form field
            "stock_keeping_method_id": "required|integer",
            "rate_type_id": "required|integer",
            "item_price_list_id": "required|integer",
            "calculation_on": "required|decimal",
            "division_factor": "required|decimal",
            "qty": "required|decimal", // Required based on item type and stock keeping method
            "weight": "required|decimal", // Required based on item type and stock keeping method
            "rate": "required|decimal",
            "rate_per_kg": "required|decimal",
            "gross_amount": "required|decimal",
            "discount_percentage": "required|decimal",
            "discount_per_unit": "required|decimal",
            "discount_amount": "required|decimal",
            "rate_per_unit": "required|decimal",
            "amount_excl_tax": "required|decimal",
            "tax_percentage": "required|decimal",
            "tax_amount": "required|decimal",
            "amount_incl_tax": "required|decimal"
        }
    ]
}
```
