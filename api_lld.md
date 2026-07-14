# Deliverable 1: API Low-Level Design (LLD)

This document describes the API contracts, queue formats, and error handling mechanisms designed and implemented for the **Online Food Food Order Processing System**.

---

## 1. REST API Endpoints

### A. Order Service (`order-service` — Port 8081)

#### 1. Place Order
* **Endpoint**: `POST /api/orders`
* **Purpose**: Allows a customer to submit a new order.
* **Request Payload**:
  ```json
  {
    "customerId": "sathish",
    "address": "chrompet | Phone: 9498866756",
    "itemDetails": [
      {
        "foodId": "idly-1",
        "name": "Soft Steamed Idly",
        "quantity": 2,
        "price": 60.0
      }
    ]
  }
  ```
* **Response Payload (HTTP 201 Created)**:
  ```json
  {
    "orderId": "26a67ffd-b024-49e9-8805-951c76354944",
    "customerId": "sathish",
    "amount": 120.0,
    "status": "PLACED",
    "paymentStatus": "PENDING",
    "deliveryPartnerId": null,
    "createdAt": "2026-07-14T00:03:37.854",
    "items": "2x Soft Steamed Idly",
    "address": "chrompet | Phone: 9498866756",
    "paymentMethod": null,
    "message": "Order status: PLACED (Payment: PENDING, Method: null, Ticket: null, Delivery: null)",
    "itemDetails": [
      {
        "foodId": "idly-1",
        "name": "Soft Steamed Idly",
        "quantity": 2,
        "price": 60.0
      }
    ]
  }
  ```

#### 2. Get All Orders
* **Endpoint**: `GET /api/orders`
* **Purpose**: Retrieves list of all placed orders for real-time status display.
* **Response Payload (HTTP 200 OK)**:
  ```json
  [
    {
      "orderId": "26a67ffd-b024-49e9-8805-951c76354944",
      "customerId": "sathish",
      "amount": 120.0,
      "status": "PAYMENT_COMPLETED",
      "paymentStatus": "PAID",
      "createdAt": "2026-07-14T00:03:37.854",
      "items": "2x Soft Steamed Idly",
      "address": "chrompet | Phone: 9498866756",
      "paymentMethod": "CARD"
    }
  ]
  ```

#### 3. Pay for Order
* **Endpoint**: `POST /api/orders/{id}/pay?paymentMethod=CARD`
* **Purpose**: Authorizes online payment and initiates the Camunda workflow.
* **Response Payload (HTTP 200 OK)**:
  ```json
  {
    "orderId": "26a67ffd-b024-49e9-8805-951c76354944",
    "status": "PAYMENT_COMPLETED",
    "paymentStatus": "PAID",
    "paymentMethod": "CARD"
  }
  ```

#### 4. Place Cash on Delivery (COD) Order
* **Endpoint**: `POST /api/orders/{id}/cod`
* **Purpose**: Commits order to preparation with payment status set to pending delivery.
* **Response Payload (HTTP 200 OK)**:
  ```json
  {
    "orderId": "cf14dee7-6c43-4d58-b1e2-e4b9e2c5c840",
    "status": "PAYMENT_COMPLETED",
    "paymentStatus": "COD_PENDING",
    "paymentMethod": "COD"
  }
  ```

#### 5. Confirm Cash Collected (Rider COD Action)
* **Endpoint**: `POST /api/orders/{id}/confirm-cod-payment`
* **Purpose**: Invoked by riders to confirm cash receipt, updating database order status to `PAID`.
* **Response Payload (HTTP 200 OK)**:
  ```json
  {
    "orderId": "cf14dee7-6c43-4d58-b1e2-e4b9e2c5c840",
    "paymentStatus": "PAID"
  }
  ```

#### 6. Cancel Order (Compensation flow)
* **Endpoint**: `POST /api/orders/{id}/cancel`
* **Purpose**: Customer triggers cancellation. If paid, initiates refund.
* **Response Payload (HTTP 200 OK)**:
  ```json
  {
    "orderId": "26a67ffd-b024-49e9-8805-951c76354944",
    "status": "CANCELLED",
    "paymentStatus": "REFUND_INITIATED"
  }
  ```

---

## 2. ActiveMQ Message Formats

### A. Queue: `order.created` (starts workflow)
* **Publisher**: `order-service`
* **Consumer**: Camunda engine (`order-service` listener)
* **Message Payload (JSON)**:
  ```json
  {
    "orderId": "26a67ffd-b024-49e9-8805-951c76354944",
    "amount": 120.0,
    "paymentStatus": "PAID",
    "items": "2x Soft Steamed Idly"
  }
  ```

### B. Queue: `payment-request-queue` & `payment-response-queue`
* **Publisher**: Camunda Service Task / `payment-service`
* **Message Payload (JSON)**:
  ```json
  {
    "orderId": "26a67ffd-b024-49e9-8805-951c76354944",
    "amount": 120.0,
    "status": "PAID / REFUNDED",
    "message": "Payment processing mock output"
  }
  ```

### C. Queue: `delivery-request-queue` & `delivery-response-queue`
* **Publisher**: Camunda Service Task / `delivery-service`
* **Message Payload (JSON)**:
  ```json
  {
    "orderId": "26a67ffd-b024-49e9-8805-951c76354944",
    "status": "OUT_FOR_DELIVERY / DELIVERED",
    "deliveryId": "DEL-98213",
    "paymentMethod": "COD",
    "amount": 120.0
  }
  ```

---

## 3. Error Handling and Edge Cases

1. **Incorrect Form Input validations**: Form triggers direct browser checks. Regex patterns strictly enforce alphabets-only on names, correct `@` domain tags for emails, exactly 10 digits for phones, and exactly 16 digits for card payments to filter bad data locally.
2. **Camunda Workflow Process Failures**: If Camunda fails to instantiate/correlate, catch clauses update database status to `FAILED` and respond with an internal server error to notify the client.
3. **Database Connection Issues**: Repositories are wrapped in spring transactions, ensuring that if database inserts fail, ActiveMQ queue events are not published (Saga data integrity).
