package com.cs.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cs.Entity.Price;
import com.cs.service.PriceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/price")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PriceController {
	
	@Autowired
	PriceService ps;
	
	
	
	@PostMapping("/insertmoney")
	public HashMap<String, Object> insertmoney(@RequestBody Price price){
		ps.insertmoney(price);
		return null;
	}

}
