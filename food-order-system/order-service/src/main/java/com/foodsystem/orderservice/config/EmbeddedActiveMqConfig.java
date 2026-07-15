package com.foodsystem.orderservice.config;

import org.apache.activemq.broker.BrokerService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmbeddedActiveMqConfig {

    @Bean(initMethod = "start", destroyMethod = "stop")
    public BrokerService broker() throws Exception {
        BrokerService broker = new BrokerService();
        broker.addConnector("tcp://0.0.0.0:61616");
        broker.setPersistent(false); // keep in-memory for testing
        broker.setUseJmx(true);
        return broker;
    }
}
