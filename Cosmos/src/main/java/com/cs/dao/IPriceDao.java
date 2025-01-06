package com.cs.dao;

import java.util.List;

import com.cs.Entity.Price;

public interface IPriceDao {

	List<Price> getPriceList();

	List<Price> getOneList();
	


}
