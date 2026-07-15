#!/bin/bash
echo "======================================================="
echo "Starting Food Order Processing Microservices..."
echo "======================================================="

# Function to handle shutdown of all background processes
cleanup() {
    echo "Stopping all services..."
    kill $(jobs -p)
    exit
}
trap cleanup SIGINT SIGTERM

# Run Order Service
echo "Starting Order Service on Port 8081..."
cd food-order-system/order-service && mvn spring-boot:run &
cd - > /dev/null

echo "Waiting 12 seconds for ActiveMQ Broker to initialize..."
sleep 12

# Run Payment Service
echo "Starting Payment Service on Port 8082..."
cd food-order-system/payment-service && mvn spring-boot:run &
cd - > /dev/null

# Run Kitchen Service
echo "Starting Kitchen Service on Port 8083..."
cd food-order-system/kitchen-service && mvn spring-boot:run &
cd - > /dev/null

# Run Delivery Service
echo "Starting Delivery Service on Port 8084..."
cd food-order-system/delivery-service && mvn spring-boot:run &
cd - > /dev/null

echo "Waiting 5 seconds for microservices to bind ports..."
sleep 5

# Run Frontend
echo "Starting Frontend Vite Server..."
cd frontend && npm run dev -- --host 0.0.0.0 &
cd - > /dev/null

echo "All services started in the background. Press Ctrl+C to stop all services."
wait
