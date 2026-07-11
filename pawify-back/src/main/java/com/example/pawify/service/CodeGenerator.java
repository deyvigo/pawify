package com.example.pawify.service;

// Generador de codigos alfanumericos aleatorios
public interface CodeGenerator {

    // Genera un codigo de 10 caracteres por defecto
    String generateCode();

    // Genera un codigo de la longitud indicada
    String generateCode(int length);
}
