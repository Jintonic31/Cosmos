package com.cs.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cs.Entity.Price;
import com.cs.dao.IPriceDao;
import com.cs.dao.PriceRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PriceService {
	
	@Autowired
	IPriceDao ipdao;
	
	@Autowired
	PriceRepository pr;

	public void insertmoney(Price price) {
		pr.save(price);
	}

	public List<Price> getPriceList() {
		List<Price> list = ipdao.getPriceList();
		return list;
	}

	public List<Price> getOneList() {
		List<Price> list = ipdao.getOneList();
		return list;
	}

}
