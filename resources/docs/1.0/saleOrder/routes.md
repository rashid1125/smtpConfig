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
