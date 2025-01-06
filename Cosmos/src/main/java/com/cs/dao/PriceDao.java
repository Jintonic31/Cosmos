package com.cs.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.cs.Entity.Price;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

@Repository
public class PriceDao implements IPriceDao{
	
	@Autowired
	private EntityManager em;

	@Override
	public List<Price> getPriceList() {
		String sql = "select n from Price n where DATE(n.indate) = CURRENT_DATE order by n.indate desc limit 48";
		
		TypedQuery<Price> query = em.createQuery(sql, Price.class);
	    
	    List<Price> result = query.getResultList();
		
		return result;
	}

	@Override
	public List<Price> getOneList() {
		String sql = "select n from Price n where DATE(n.indate) = CURRENT_DATE order by n.indate desc limit 1";
		
		TypedQuery<Price> query = em.createQuery(sql, Price.class);
	    
	    List<Price> result = query.getResultList();
		
		return result;
	}

}
