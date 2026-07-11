package com.example.pawify.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Simple REST controller for health check and connectivity testing.
 * <p>
 * Provides a single endpoint that returns a greeting message, useful for
 * verifying that the application is running and reachable.
 * </p>
 */
@RestController
@RequestMapping("/helloworld")
public class HelloWorldController {
    /**
     * Returns a "Hello World!" greeting string.
     * <p>
     * This endpoint is publicly accessible (no authentication required)
     * and is typically used for application health checks.
     * </p>
     *
     * @return a plain text greeting string
     */
    @GetMapping(name = "")
    public String helloWorld() {
        return "Hello World!";
    }
}
