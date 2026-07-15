# 🍔 FoodHub: Premium Order-to-Delivery System (Saga Orchestration)

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?repo=San-maker-sa/waffor-food-order-system)

FoodHub is a state-of-the-art, asynchronous food ordering and delivery web application built with **Spring Boot Microservices**, **Camunda BPMN Saga Orchestration**, **ActiveMQ**, and a beautiful **Glassmorphic React Frontend**.

The system utilizes the **Saga Pattern** to manage distributed transactions across four microservices with automatic compensations (refunds, ticket rollbacks) in case of system failures.

---

## 🏗️ System Architecture & Services

The system is decomposed into four Spring Boot microservices communicating asynchronously via **Apache ActiveMQ** queues:

```mermaid
graph TD
    React[React Frontend] -->|REST API| OrderSvc[Order Service :8081]
    OrderSvc -->|Orchestrates| Camunda[Camunda Workflow Engine]
    Camunda -->|JMS ActiveMQ| PaymentSvc[Payment Service :8082]
    Camunda -->|JMS ActiveMQ| KitchenSvc[Kitchen Service :8083]
    Camunda -->|JMS ActiveMQ| DeliverySvc[Delivery Service :8084]
```

### 1. 📋 Order Service (`order-service` - Port 8081)
- Exposes REST APIs for customer registration, placing orders, processing payments, and tracking status.
- Integrates the **Camunda 7 Workflow Engine** to orchestrate the order-to-delivery lifecycle.
- Hosts the embedded **ActiveMQ Broker** for JMS queue communication.

### 2. 💳 Payment Service (`payment-service` - Port 8082)
- Asynchronously processes payment authorizations via `payment-request-queue`.
- Handles credit cards, UPI, and cash-on-delivery (COD) flows.
- Fires success/failure messages back to `payment-response-queue`.
- Supports automated refund compensation flows.

### 3. 🍳 Kitchen Service (`kitchen-service` - Port 8083)
- Listens for food preparation tickets from the workflow engine.
- Manages kitchen status transitions (`RECEIVED` ➔ `PREPARING` ➔ `READY_FOR_DELIVERY`).
- Integrates with the Shop Keeper dashboard for manual acceptance and preparation controls.

### 4. 🚀 Delivery Service (`delivery-service` - Port 8084)
- Coordinates rider assignment and tracking.
- Updates delivery status (`ASSIGNED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`).
- Integrates with the Delivery Partner dashboard for rider execution.

---

## 🎨 Premium Frontend Features
The frontend is a dark-themed, glassmorphic single-page application built on **Vite + React**:
- **Customer View**: Search local kitchens globally by specialties, categories, or dishes. Supports live order status tracking and interactive checkout.
- **Shop Keeper View**: Manage order tickets, accept new orders, and update preparation status.
- **Delivery Partner View**: Accept delivery assignments, view customer details, and confirm cash collection on delivery.

---

## 🚀 How to Run the Project

### Option A: One-Click Cloud Launch (Free, No Card Required)
You can run the entire system in a ready-to-use cloud container workspace on GitHub Codespaces (120 hours free per month, no credit card required):
1. Click the button: [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?repo=San-maker-sa/waffor-food-order-system)
2. Select your repository settings and click **Create new codespace**.
3. Codespaces will build your environment and download packages automatically.
4. Once completed, open a new terminal in the Codespace and start all services by running:
   ```bash
   ./run-all.sh
   ```
5. When the frontend service starts, click **Open in Browser** in the pop-up notification to open the live application!

---

### Option B: Run via Docker Compose (No Java/Node installation needed)
To run the application locally without manually installing dependencies (Java, Maven, Node, etc.), use Docker Compose:
1. Ensure you have Docker Desktop running.
2. Run the following command in the root folder:
   ```bash
   docker-compose up --build
   ```
3. Once fully booted, open your browser and navigate to **`http://localhost:5173/`**.

---

### Option C: Run Services Manually (Traditional Local Setup)

#### Prerequisites
- Java 21 or higher
- Maven 3.8+
- Node.js (v18+)

#### 1. Start all Backend Microservices
Run the startup script based on your operating system:
* **Windows:**
  ```powershell
  .\run-all.bat
  ```
* **Linux / macOS:**
  ```bash
  chmod +x run-all.sh
  ./run-all.sh
  ```

#### 2. Start the Frontend Server manually (if not running script)
Navigate to the frontend directory, install dependencies, and start Vite:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## 🛠️ Git & Push Operations

To commit and push future changes to your GitHub repository:
```bash
git add .
git commit -m "Commit message"
git push
```
