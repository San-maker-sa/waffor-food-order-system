@echo off
echo =======================================================
echo Starting Food Order Processing Microservices and Website...
echo =======================================================

echo.
echo [1/5] Starting Order Service on Port 8081 (and embedded ActiveMQ Broker)...
start "Order Service - Port 8081" cmd /k "cd food-order-system\order-service && mvn spring-boot:run"

echo Waiting 12 seconds for ActiveMQ Broker to initialize...
timeout /t 12 /nobreak > nul

echo.
echo [2/5] Starting Payment Service on Port 8082...
start "Payment Service - Port 8082" cmd /k "cd food-order-system\payment-service && mvn spring-boot:run"

echo.
echo [3/5] Starting Kitchen Service on Port 8083...
start "Kitchen Service - Port 8083" cmd /k "cd food-order-system\kitchen-service && mvn spring-boot:run"

echo.
echo [4/5] Starting Delivery Service on Port 8084...
start "Delivery Service - Port 8084" cmd /k "cd food-order-system\delivery-service && mvn spring-boot:run"

echo Waiting 5 seconds for microservices to bind ports...
timeout /t 5 /nobreak > nul

echo.
echo [5/5] Starting Frontend Vite Server...
start "Frontend - Vite Dev Server" cmd /k "cd frontend && npm run dev"

echo Waiting 3 seconds for Frontend to spin up...
timeout /t 3 /nobreak > nul

echo.
echo Launching the FoodHub Web Application in your default browser...
start http://localhost:5173

echo.
echo =======================================================
echo All services and the website have been launched!
echo =======================================================
pause
