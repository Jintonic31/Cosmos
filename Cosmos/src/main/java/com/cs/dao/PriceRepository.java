package com.cs.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cs.Entity.Price;

public interface PriceRepository extends JpaRepository<Price, Integer>{

}
