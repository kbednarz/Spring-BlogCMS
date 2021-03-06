package com.github.kbednarz.repo;

import com.github.kbednarz.model.UserEntity;
import org.springframework.data.repository.CrudRepository;


public interface UserRepository extends CrudRepository<UserEntity, Long> {
    UserEntity findByUsername(String name);
}

