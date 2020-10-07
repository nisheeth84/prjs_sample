package com.viettel.aio.business;

import com.viettel.aio.dto.BiddingPackageDTO;

import java.util.List;


public interface BiddingPackageBusiness {

    long getTotal();

    public List<BiddingPackageDTO> importBiddingPackage(String fileInput) throws Exception;
    
	List<BiddingPackageDTO> getFileDrop();
	
	

}
