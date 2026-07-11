package com.example.pawify.service;

/**
 * Service interface for generating random alphanumeric codes.
 *
 * <p>Provides operations for generating codes of configurable length,
 * used for tracking codes, share codes, and recovery tokens.</p>
 */
public interface CodeGenerator {

    /**
     * Generates a random alphanumeric code with the default length of 10 characters.
     *
     * @return a random alphanumeric string
     */
    String generateCode();

    /**
     * Generates a random alphanumeric code of the specified length.
     *
     * @param length the desired length of the generated code
     * @return a random alphanumeric string of the given length
     */
    String generateCode(int length);
}
