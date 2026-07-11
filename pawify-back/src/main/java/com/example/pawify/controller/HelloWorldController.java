package com.example.pawify.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Controlador de verificacion de salud de la aplicacion
@RestController
@RequestMapping("/helloworld")
public class HelloWorldController {
    // Retorna un saludo Hello World
    @GetMapping(name = "")
    public String helloWorld() {
        return "Hello World!";
    }
}
