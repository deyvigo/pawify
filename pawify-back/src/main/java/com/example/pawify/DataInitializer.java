package com.example.pawify;

import com.example.pawify.model.RoleEntity;
import com.example.pawify.model.RoleEnum;
import com.example.pawify.repository.RoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findAll().isEmpty()) {
            RoleEntity roleAdmin = new RoleEntity();
            roleAdmin.setRole(RoleEnum.ADMIN);
            roleRepository.save(roleAdmin);

            RoleEntity roleUser = new RoleEntity();
            roleUser.setRole(RoleEnum.BUYER);
            roleRepository.save(roleUser);
        }
    }
}
