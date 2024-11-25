package com.cs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cs.Entity.Price;
import com.cs.dao.PriceRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PriceService {
	
	
	@Autowired
	PriceRepository pr;

	public void insertmoney(Price price) {
		pr.save(price);
	}
	

}
