/*
 * Copyright (C) 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.aio.dao;

import com.viettel.aio.bo.AIOContractBO;
import com.viettel.aio.bo.StockTransBO;
import com.viettel.aio.bo.StockTransDetailBO;
import com.viettel.aio.dto.*;
import com.viettel.aio.webservice.AIOContractServiceWsRsService;
import com.viettel.coms.bo.UtilAttachDocumentBO;
import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.dao.BaseFWDAOImpl;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.hibernate.type.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

//import com.viettel.coms.dto.*;
//import com.viettel.coms.bo.SynStockTransBO;
//import com.viettel.coms.dto.ConstructionAcceptanceCertDetailVTADTO;

/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@Repository("aioContractSellMobileDAO")
@EnableTransactionManagement
@Transactional
public class AIOContractSellMobileDAO extends
		BaseFWDAOImpl<AIOContractBO, Long> {

	public AIOContractSellMobileDAO() {
		this.model = new AIOContractBO();
	}

	public AIOContractSellMobileDAO(Session session) {
		this.session = session;
	}

	@Autowired
	private UtilAttachDocumentDAO utilAttachDocumentDAO;

//	@Autowired
//	private AIOAcceptanceRecordsDetailDAO aioRecordDetailDAO;

	@Autowired
	private AIOSynStockTransDAO aiostockTransDAO;
	@Autowired
	private AIOStockTransDetailDAO aiostockTransDetailDAO;
	@Autowired
	private AIOStockTransDetailSerialDAO aiostockTransDetailSerialDAO;
	@Autowired
	private AIOMerEntityDAO aioMerEntityDAO;

	@Autowired
	private AIOContractServiceMobileDAO aioContractServiceMobileDAO;

	private Logger LOGGER = Logger
			.getLogger(AIOContractServiceWsRsService.class);

	/**
	 * get countContractService
	 *
	 * @param SysUserRequest
	 *            request
	 * @return List<MerEntityDTO>
	 */
	public AIOContractDTO countContractSell(SysUserRequest request) {
		StringBuilder sql = new StringBuilder("");
		sql.append(" select nvl(sum(case when b.status=1 then 1 end),0) sumNonExcute,");
		sql.append(" nvl(sum(case when b.status=2 then 1 end),0) sumExcute ");
		sql.append(" from AIO_CONTRACT a,AIO_CONTRACT_DETAIL b where a.contract_id=b.contract_id ");
		sql.append(" and a.status !=4 and a.type=2 and b.status in(1,2) and performer_id = :sysUserId ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("sysUserId", request.getSysUserId());
		query.addScalar("sumNonExcute", new LongType());
		query.addScalar("sumExcute", new LongType());

		query.setResultTransformer(Transformers
				.aliasToBean(AIOContractDTO.class));

		return (AIOContractDTO) query.list().get(0);
	}

	/**
	 * Get current time
	 *
	 * @return Current time
	 * @throws ParseException
	 */
	private String getCurrentTime() throws ParseException {
		Date now = new Date();
		String dateNow = now.toString();
		// Tue May 22 13:56:18 GMT+07:00 2018
		SimpleDateFormat dt = new SimpleDateFormat(
				"EEE MMM d HH:mm:ss zzz yyyy");
		Date dateString = dt.parse(dateNow);
		SimpleDateFormat formater = new SimpleDateFormat("dd-MMMM-yy");
		return formater.format(dateString);
	}

	// aio_20190315_start
	public List<AIOContractDTO> getListContractSellTask(SysUserRequest request) {
		StringBuilder sql = new StringBuilder("");
		sql.append(" select a.contract_id contractId, b.WORK_NAME workName,b.START_DATE startDate,b.END_DATE endDate,a.CUSTOMER_PHONE customerPhone,b.PACKAGE_NAME packageName,b.STATUS status, ");
		sql.append(" a.is_money isMoney,b.PACKAGE_DETAIL_ID packageDetailId,b.CONTRACT_DETAIL_ID contractDetailId ");
		sql.append(", a.status statusContract ");
		sql.append("from AIO_CONTRACT a,AIO_CONTRACT_DETAIL b where a.contract_id=b.contract_id ");
		sql.append(" and a.status !=4 and a.type=2 and b.status in(1,2) and a.performer_id = :sysUserId order by b.START_DATE desc ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("sysUserId", request.getSysUserId());
		query.addScalar("contractId", new LongType());
		query.addScalar("workName", new StringType());
		query.addScalar("startDate", new DateType());
		query.addScalar("endDate", new DateType());
		query.addScalar("customerPhone", new StringType());
		query.addScalar("packageName", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("isMoney", new LongType());
		query.addScalar("packageDetailId", new LongType());
//		hoanm1_20190510_start
		query.addScalar("contractDetailId", new LongType());
//		hoanm1_20190510_end
		query.addScalar("statusContract", new LongType());
		query.setResultTransformer(Transformers
				.aliasToBean(AIOContractDTO.class));

		return query.list();
	}

	public List<AIOContractDTO> getListContractSellTaskDetail(
			AIOContractMobileRequest request) {
		StringBuilder sql = new StringBuilder("");
		sql.append("SELECT a.contract_id contractId, " + 
				"  a.CONTRACT_CODE contractCode, " + 
				"  a.customer_name customerName, " + 
				"  a.CUSTOMER_PHONE customerPhone, " + 
				"  a.CUSTOMER_ADDRESS customerAddress, " + 
				"  a.CUSTOMER_TAX_CODE customerTaxCode, " + 
				"  a.IS_MONEY isMoney, " +
				//VietNT_11/06/2019_start
				"  a.STATUS status, " +
				"(select count(*) from aio_contract_detail where CONTRACT_ID = c.contract_id) detailFinished, " +
				//VietNT_end
				"  b.PACKAGE_NAME packageName, " +
				"  b.QUANTITY quantity, " + 
				"  b.AMOUNT amountDetail, " + 
				"  b.package_id packageId, " + 
				"  b.package_detail_id packageDetailId, " + 
				//thangtv24 130719 start
				"  b.is_bill isBill, " +
				//thangtv24 130719 end
				"  TO_CHAR(c.start_date,'dd/MM/yyyy hh24:mi:ss') startDateContract, " + 
				"  TO_CHAR(c.end_date,'dd/MM/yyyy hh24:mi:ss') endDateContract, " + 
				"  c.ACCEPTANCE_RECORDS_ID acceptanceRecordsId, " + 
				"  a.CUSTOMER_ID customerId, " + 
//				"  ROUND((b.quantity*d.PERCENT_DISCOUNT_STAFF/100 * d.PRICE ),2) discountStaff , " + 
				" ROUND((b.quantity*d.PERCENT_DISCOUNT_STAFF/100 * (case when b.amount > 0 then e.PRICE else 0 end) ),2) discountStaff ,"+
				"  d.QUANTITY_DISCOUNT quantityDiscount, " + 
				"  d.AMOUNT_DISCOUNT amountDiscount, " + 
				"  d.percent_discount percentDiscount, " + 
				"  b.contract_detail_id contractDetailId, " + 
//				hoanm1_20190510_start
				"  case when b.amount > 0 then e.PRICE else 0 end price " +
//				hoanm1_20190510_end
				//VietNT_27/07/2019_start
				", b.SALE_CHANNEL saleChannel, " +
				"a.THU_HO thuHo, " +
				"a.APPROVED_PAY approvedPay, " +
				"a.PAY_TYPE payType " +
				//VietNT_end
				"FROM AIO_CONTRACT a " + 
				"LEFT JOIN AIO_CONTRACT_DETAIL b " + 
				"ON a.contract_id =b.contract_id " + 
				"LEFT JOIN AIO_ACCEPTANCE_RECORDS c " + 
				"ON b.contract_id =c.contract_id " + 
				"AND b.package_id =c.package_id " + 
//				hoanm1_20190510_start
				" AND b.PACKAGE_DETAIL_ID =c.PACKAGE_DETAIL_ID AND b.CONTRACT_DETAIL_ID =c.CONTRACT_DETAIL_ID "+
//				hoanm1_20190510_end
				"INNER JOIN AIO_PACKAGE_DETAIL d " + 
				"ON b.PACKAGE_DETAIL_ID =d.AIO_PACKAGE_DETAIL_ID " + 
				"LEFT JOIN AIO_PACKAGE_DETAIL_PRICE e " + 
				"ON b.PACKAGE_DETAIL_ID  = e.PACKAGE_DETAIL_ID " + 
				"where a.contract_id       = :contractId " + 
				"AND b.PACKAGE_DETAIL_ID = :packageDetailId " + 
//				hoanm1_20190510_start
				" and b.CONTRACT_DETAIL_id = :contractDetailId "+
//				hoanm1_20190510_end
				"and e.PROVINCE_ID in (select aa.PROVINCE_ID from AIO_CUSTOMER ac " + 
				"LEFT JOIN AIO_AREA aa " + 
				"ON aa.AREA_ID = ac.AIO_AREA_ID " + 
				"left join AIO_CONTRACT acc on ac.CUSTOMER_ID = acc.CUSTOMER_ID " + 
				"where acc.CONTRACT_ID = :contractId) ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("contractId", request.getAioContractDTO()
				.getContractId());
//		hoanm1_20190416_start
		query.setParameter("packageDetailId", request.getAioContractDTO()
				.getPackageDetailId());
//		hoanm1_20190416_end
//		hoanm1_20190510_start
		query.setParameter("contractDetailId", request.getAioContractDTO()
				.getContractDetailId());
//		hoanm1_20190510_end
		query.addScalar("contractId", new LongType());
		query.addScalar("contractCode", new StringType());
		query.addScalar("customerName", new StringType());
		//VietNT_11/06/2019_start
		query.addScalar("status", new LongType());
		//VietNT_end
		query.addScalar("customerPhone", new StringType());
		query.addScalar("customerAddress", new StringType());
		query.addScalar("customerTaxCode", new StringType());
		query.addScalar("isMoney", new LongType());
		query.addScalar("packageName", new StringType());
		query.addScalar("quantity", new DoubleType());
		query.addScalar("packageId", new LongType());
		query.addScalar("amountDetail", new DoubleType());
		query.addScalar("packageDetailId", new LongType());
		query.addScalar("startDateContract", new StringType());
		query.addScalar("endDateContract", new StringType());
		query.addScalar("acceptanceRecordsId", new LongType());
		query.addScalar("customerId", new LongType());
		query.addScalar("discountStaff", new DoubleType());
		query.addScalar("price", new DoubleType());
		query.addScalar("quantityDiscount", new DoubleType());
		query.addScalar("amountDiscount", new DoubleType());
		query.addScalar("percentDiscount", new DoubleType());
		query.addScalar("contractDetailId", new LongType());
		query.addScalar("contractDetailId", new LongType());
		//thangtv24 130719 start
		query.addScalar("isBill", new LongType());
		//thangtv24 130719 end

		//VietNT_27/07/2019_start
		query.addScalar("saleChannel", new StringType());
		query.addScalar("thuHo", new DoubleType());
		query.addScalar("approvedPay", new LongType());
		query.addScalar("payType", new LongType());
		query.addScalar("detailFinished", new IntegerType());
		//VietNT_end
		query.setResultTransformer(Transformers
				.aliasToBean(AIOContractDTO.class));

		return query.list();
	}
	//Huypq-end
	public Long updateLocationUser(AIOContractMobileRequest request) {
		try {
			List<Long> lstStatus = getStatusDetail(request.getSysUserRequest()
					.getSysUserId());
			deleteLocationUser(request.getSysUserRequest().getSysUserId());
			insertLocationUser(request, lstStatus);
		} catch (Exception ex) {
			return 0L;
		}
		return 1L;
	}

	public List<Long> getStatusDetail(Long sysUserId) {
		String sql = new String(
				"select b.STATUS status from AIO_CONTRACT a,AIO_CONTRACT_DETAIL b where a.contract_id=b.contract_id and b.status=2 and a.PERFORMER_ID = :sysUserId");
		SQLQuery query = getSession().createSQLQuery(sql);
		query.setParameter("sysUserId", sysUserId);
		query.addScalar("status", new LongType());
		return query.list();
	}

	public void deleteLocationUser(Long sysUserId) {
		String sql = new String(
				"delete from AIO_LOCATION_USER a where a.SYS_USER_ID = :sysUserId");
		SQLQuery query = getSession().createSQLQuery(sql);
		query.setParameter("sysUserId", sysUserId);
		query.executeUpdate();
	}

	public void insertLocationUser(AIOContractMobileRequest request,
			List<Long> lstStatus) {
		String sql = new String(
				" insert into AIO_LOCATION_USER (LOCATION_USER_ID,CREATED_DATE,SYS_USER_ID,LAT,LNG,STATUS) values (AIO_LOCATION_USER_seq.nextval,sysdate, :sysUserId , :lat , :lng , :status)");
		SQLQuery query = getSession().createSQLQuery(sql);
		query.setParameter("sysUserId", request.getSysUserRequest()
				.getSysUserId());
		query.setParameter("lat", request.getAioContractDTO().getLat());
		query.setParameter("lng", request.getAioContractDTO().getLng());
		if (lstStatus.size() > 0) {
			query.setParameter("status", 2);
		} else {
			query.setParameter("status", 1);
		}
		query.executeUpdate();
	}

	public Long startContract(AIOContractMobileRequest request) {
		try {
			// String Contract = checkStatus(request.getSysUserRequest());
			// if (Contract.isEmpty() || Contract.equals("")) {
			updateStartContract(request);
			// } else {
			// this.getSession().clear();
			// return -3L;
			// }
		} catch (Exception ex) {
			this.getSession().clear();
			return 0L;
		}
		return 1L;
	}

	public void updateStartContract(AIOContractMobileRequest request) {
		StringBuilder sql = new StringBuilder("");
		sql.append("update AIO_ACCEPTANCE_RECORDS set START_DATE=sysdate where contract_id = :contractId and PACKAGE_DETAIL_ID = :packageDetailId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("contractId", request.getAioContractDTO()
				.getContractId());
		query.setParameter("packageDetailId", request.getAioContractDTO()
				.getPackageDetailId());

		StringBuilder sqlContract = new StringBuilder("");
		sqlContract
				.append("update AIO_CONTRACT set status=2 where contract_id = :contractIdContract ");
		SQLQuery queryContract = getSession().createSQLQuery(
				sqlContract.toString());
		queryContract.setParameter("contractIdContract", request
				.getAioContractDTO().getContractId());

		StringBuilder sqlContractDetail = new StringBuilder("");
		sqlContractDetail
				.append("update AIO_CONTRACT_DETAIL set status=2 where contract_id = :contractIdConDetail and PACKAGE_DETAIL_ID = :packageDetailId  ");
		SQLQuery queryContractDetail = getSession().createSQLQuery(
				sqlContractDetail.toString());
		queryContractDetail.setParameter("contractIdConDetail", request
				.getAioContractDTO().getContractId());
		queryContractDetail.setParameter("packageDetailId", request
				.getAioContractDTO().getPackageDetailId());

		query.executeUpdate();
		queryContract.executeUpdate();
		queryContractDetail.executeUpdate();
	}

	public Long endContract(AIOContractMobileRequest request) {
		try {
			Long result = insertBillExportSock(request);
			if (result == -1L) {
				this.getSession().clear();
				return -1L;
			}
			if (result == -2L) {
				this.getSession().clear();
				return -2L;
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			this.getSession().clear();
			return 0L;
		}
		return 1L;
	}

	/*
	public void updateEndContract(AIOContractMobileRequest request, String stockTransCode) {

		if (request.getAioContractDTO().getCheckBill() == 1) {
			StringBuilder sqlContractDetail = new StringBuilder("");
			sqlContractDetail
					.append("update AIO_CONTRACT_DETAIL set IS_BILL=1,status=3,CUSTOMER_NAME = :customerNameBill,CUSTOMER_ADDRESS =:customerAddressBill,TAX_CODE =:taxCodeBill where contract_id = :contractId "
							+ " and PACKAGE_DETAIL_ID = :packageDetailId and CONTRACT_DETAIL_id = :contractDetailId ");
			SQLQuery queryContractDetail = getSession().createSQLQuery(
					sqlContractDetail.toString());
			queryContractDetail.setParameter("customerNameBill", request
					.getAioContractDTO().getCustomerNameBill());
			queryContractDetail.setParameter("customerAddressBill", request
					.getAioContractDTO().getCustomerAddressBill());
			queryContractDetail.setParameter("taxCodeBill", request
					.getAioContractDTO().getTaxCodeBill());
			queryContractDetail.setParameter("contractId", request
					.getAioContractDTO().getContractId());
			queryContractDetail.setParameter("packageDetailId", request
					.getAioContractDTO().getPackageDetailId());
//			hoanm1_20190510_start
			queryContractDetail.setParameter("contractDetailId", request
					.getAioContractDTO().getContractDetailId());
//			hoanm1_20190510_end
			queryContractDetail.executeUpdate();
		} else {
			StringBuilder sqlContractDetail = new StringBuilder("");
			sqlContractDetail
					.append("update AIO_CONTRACT_DETAIL set IS_BILL=0,status=3 where contract_id = :contractId and PACKAGE_DETAIL_ID = :packageDetailId and CONTRACT_DETAIL_id = :contractDetailId ");
			SQLQuery queryContractDetail = getSession().createSQLQuery(
					sqlContractDetail.toString());
			queryContractDetail.setParameter("contractId", request
					.getAioContractDTO().getContractId());
			queryContractDetail.setParameter("packageDetailId", request
					.getAioContractDTO().getPackageDetailId());
//			hoanm1_20190510_start
			queryContractDetail.setParameter("contractDetailId", request
					.getAioContractDTO().getContractDetailId());
//			hoanm1_20190510_end
			queryContractDetail.executeUpdate();
		}

		StringBuilder sqlRecord = new StringBuilder("");
		sqlRecord
				.append("update AIO_ACCEPTANCE_RECORDS set END_DATE=sysdate,AMOUNT =:amount,DISCOUNT_STAFF =:discountStaff " +
						//VietNT_20/06/2019_start
						", PERFORMER_TOGETHER = :performerTogether " +
						//VietNT_end
						"where contract_id = :contractId and PACKAGE_DETAIL_ID = :packageDetailId and CONTRACT_DETAIL_id = :contractDetailId");
		SQLQuery queryRecord = getSession()
				.createSQLQuery(sqlRecord.toString());
		queryRecord.setParameter("amount", request.getAioContractDTO()
				.getAmount());
		queryRecord.setParameter("discountStaff", request.getAioContractDTO()
				.getDiscountStaff());
		queryRecord.setParameter("contractId", request.getAioContractDTO()
				.getContractId());
		queryRecord.setParameter("packageDetailId", request.getAioContractDTO()
				.getPackageDetailId());
//		hoanm1_20190510_start
		queryRecord.setParameter("contractDetailId", request
				.getAioContractDTO().getContractDetailId());
//		hoanm1_20190510_end
		//VietNT_20/06/2019_start
		queryRecord.setParameter("performerTogether", request.getPerformTogether(), new StringType());
		//VietNT_end
		queryRecord.executeUpdate();

		Double statusContract = avgStatusContract(request.getAioContractDTO()
				.getContractId());
		StringBuilder sqlContract = new StringBuilder("");
		sqlContract
				.append("update AIO_CONTRACT set status =:status where contract_id = :contractId ");
		SQLQuery queryContract = getSession().createSQLQuery(
				sqlContract.toString());
		if (statusContract == 3.0) {
			queryContract.setParameter("status", 3);
		} else {
			queryContract.setParameter("status", 2);
		}
		queryContract.setParameter("contractId", request.getAioContractDTO()
				.getContractId());

		queryContract.executeUpdate();

		if (request.getLstAIOContractMobileDTO() != null) {
			for (AIOContractDTO obj : request.getLstAIOContractMobileDTO()) {
				List<String> lst = new ArrayList<String>();
				if (obj.getTypeSerial() == 1) {
					lst = obj.getLstSerial();
				} else {
					lst = obj.getLstSerialText();
				}
				AIOAcceptanceRecordsDetailDTO dto =
						AIOContractServiceMobileDAO.toAcceptanceDetailDTO(request.getAioContractDTO().getAcceptanceRecordsId(), obj, stockTransCode);
				if (lst != null) {
					for (int i = 0; i < lst.size(); i++) {
						dto.setQuantity(1D);
						dto.setPrice(obj.getPriceRecordDetail());
						dto.setAmount(obj.getPriceRecordDetail());
						dto.setType(obj.getType());
						dto.setSerial(lst.get(i));
						Long idDetail = aioRecordDetailDAO.saveObject(dto.toModel());
						if (idDetail < 1) {
							throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " ACCEPTANCE_RECORDS_DETAIL");
						}
					}
				} else {
					dto.setQuantity(obj.getQuantity());
					dto.setPrice(obj.getPriceRecordDetail() != null ? obj.getPriceRecordDetail() : 0);
					dto.setAmount(dto.getPrice() * dto.getQuantity());
					dto.setType(obj.getType());
					dto.setSerial(null);
					Long idDetail = aioRecordDetailDAO.saveObject(dto.toModel());
					if (idDetail < 1) {
						throw new BusinessException(AIOErrorType.SAVE_ERROR.msg + " ACCEPTANCE_RECORDS_DETAIL");
					}
				}
			}
		}
		// hoanm1_20190413_start
		SysUserCOMSDTO userDto = getSysUserBySysUserId(request
				.getSysUserRequest().getSysUserId());
		insertLogUpdateCamera(userDto, request);
		// hoanm1_20190413_end
	}
	 */

	// hoanm1_20190413_start
	public SysUserCOMSDTO getSysUserBySysUserId(Long sysUserId) {

		StringBuilder sql = new StringBuilder("SELECT "
				+ "SU.SYS_USER_ID sysUserId " + ",SU.LOGIN_NAME loginName "
				+ ",SU.FULL_NAME fullName " + ",SU.PASSWORD password "
				+ ",SU.EMPLOYEE_CODE employeeCode " + ",SU.EMAIL email "
				+ ",SU.PHONE_NUMBER phoneNumber " + ",SU.STATUS status "
				+ ",SU.SYS_GROUP_ID departmentId " + ",SY.NAME sysGroupName "
				+ " FROM SYS_USER SU " + "LEFT JOIN sys_group SY "
				+ "ON SU.SYS_GROUP_ID = SY.SYS_GROUP_ID "
				+ "WHERE SU.SYS_USER_ID = :sysUserId ");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("sysUserId", new LongType());
		query.addScalar("loginName", new StringType());
		query.addScalar("fullName", new StringType());
		query.addScalar("password", new StringType());
		query.addScalar("employeeCode", new StringType());
		query.addScalar("email", new StringType());
		query.addScalar("phoneNumber", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("departmentId", new LongType());
		query.addScalar("sysGroupName", new StringType());

		query.setParameter("sysUserId", sysUserId);

		query.setResultTransformer(Transformers
				.aliasToBean(SysUserCOMSDTO.class));

		return (SysUserCOMSDTO) query.list().get(0);

	}

	public void insertLogUpdateCamera(SysUserCOMSDTO userDto,
			AIOContractMobileRequest requestDTO) {
		StringBuilder sqlWorkItemTask = new StringBuilder(
				" INSERT INTO KPI_LOG_MOBILE_AIO (KPI_LOG_MOBILE_ID, SYSUSERID, LOGINNAME, PASSWORD,  EMAIL, FULLNAME, "
						+ " EMPLOYEECODE, PHONENUMBER, SYSGROUPNAME, SYSGROUPID, TIME_DATE,update_time,FUNCTION_CODE,DESCRIPTION, "
						+ " contractId,contractCode,packageDetailId,acceptanceRecordsId,customerId)"
						+ " VALUES (KPI_LOG_MOBILE_AIO_seq.nextval,:SYSUSERID,:LOGINNAME,:PASSWORD,:EMAIL,:FULLNAME,"
						+ " :EMPLOYEECODE,:PHONENUMBER,:SYSGROUPNAME,:SYSGROUPID,sysdate,trunc(sysdate),:functionCode,:description, "
						+ "  :contractId,:contractCode,:packageDetailId,:acceptanceRecordsId,:customerId) ");
		SQLQuery queryWorkItemTask = getSession().createSQLQuery(
				sqlWorkItemTask.toString());

		queryWorkItemTask.setParameter("SYSUSERID", userDto.getSysUserId());
		queryWorkItemTask.setParameter("LOGINNAME", userDto.getLoginName());
		queryWorkItemTask.setParameter("PASSWORD", userDto.getPassword());
		queryWorkItemTask.setParameter("EMAIL", userDto.getEmail());
		queryWorkItemTask.setParameter("FULLNAME", userDto.getFullName());
		queryWorkItemTask.setParameter("EMPLOYEECODE",
				userDto.getEmployeeCode());
		queryWorkItemTask.setParameter("PHONENUMBER", userDto.getPhoneNumber());
		queryWorkItemTask.setParameter("SYSGROUPNAME",
				userDto.getSysGroupName());
		queryWorkItemTask.setParameter("SYSGROUPID", userDto.getDepartmentId());
		queryWorkItemTask.setParameter("functionCode", "UPDATE CAMERA");
		queryWorkItemTask.setParameter("description",
				"Kết thúc công việc bán hàng Camera");
		queryWorkItemTask.setParameter("contractId", requestDTO
				.getAioContractDTO().getContractId());
		queryWorkItemTask.setParameter("contractCode", requestDTO
				.getAioContractDTO().getContractCode());
		queryWorkItemTask.setParameter("packageDetailId", requestDTO
				.getAioContractDTO().getPackageDetailId());
		queryWorkItemTask.setParameter("acceptanceRecordsId", requestDTO
				.getAioContractDTO().getAcceptanceRecordsId());
		queryWorkItemTask.setParameter("customerId", requestDTO
				.getAioContractDTO().getCustomerId());
		queryWorkItemTask.executeUpdate();
	}

	// hoanm1_20190413_end

	public AIOStockTransDetailSerialDTO createFromMerEntity(
			AIOMerEntityDTO goods, Long stockTransId, Long stockTransDetailId) {
		AIOStockTransDetailSerialDTO detailSerial = new AIOStockTransDetailSerialDTO();
		detailSerial.setQuantityIssue(goods.getAmount().doubleValue());
		detailSerial.setQuantity(goods.getAmount().doubleValue());
		detailSerial.setPrice(goods.getApplyPrice());
		detailSerial.setUnitPrice(goods.getUnitPrice());
		detailSerial.setCellCode(goods.getStockCellCode());
		detailSerial.setStockTransId(stockTransId);
		detailSerial.setStockTransDetailId(stockTransDetailId);
		detailSerial.setMerEntityId(goods.getMerEntityId());
		detailSerial.setGoodsState(goods.getState());
		detailSerial.setSerial(goods.getSerial());
		return detailSerial;
	}

	public AIOContractDTO getStock(Long sysUserId) {
		String sql = new String(
				"select a.cat_stock_id stockId,a.code stockCode,a.name stockName from cat_stock a where type=4 and a.sys_user_id = :sysUserId ");
		SQLQuery query = getSession().createSQLQuery(sql);
		query.setParameter("sysUserId", sysUserId);
		query.addScalar("stockId", new LongType());
		query.addScalar("stockCode", new StringType());
		query.addScalar("stockName", new StringType());
		query.setResultTransformer(Transformers
				.aliasToBean(AIOContractDTO.class));
		return (AIOContractDTO) query.uniqueResult();
	}

	public String getUserName(Long sysUserId) {
		String sql = new String(
				"select  a.FULL_NAME sysUserName from sys_user a where a.sys_user_id= :sysUserId ");
		SQLQuery query = getSession().createSQLQuery(sql);
		query.setParameter("sysUserId", sysUserId);
		query.addScalar("sysUserName", new StringType());
		List<String> lstUser = query.list();
		if (lstUser != null && lstUser.size() > 0) {
			return lstUser.get(0).toString();
		}
		return "";
	}

	public String getGroupName(Long sysGroupId) {
		String sql = new String(
				"select name from sys_group where sys_group_id = :sysGroupId ");
		SQLQuery query = getSession().createSQLQuery(sql);
		query.setParameter("sysGroupId", sysGroupId);
		query.addScalar("name", new StringType());
		List<String> lstGroupName = query.list();
		if (lstGroupName != null && lstGroupName.size() > 0) {
			return lstGroupName.get(0).toString();
		}
		return "";
	}

	public Double avgStatusContract(Long contractId) {
		String sql = new String(
				"select round(nvl(avg(status),0),2)status from AIO_CONTRACT_DETAIL  a where a.CONTRACT_ID =:contractId");
		SQLQuery query = getSession().createSQLQuery(sql);
		query.addScalar("status", new DoubleType());
		query.setParameter("contractId", contractId);
		List<Double> lstDoub = query.list();
		if (lstDoub != null && lstDoub.size() > 0) {
			return lstDoub.get(0);
		}
		return 0D;
	}

	public List<ConstructionImageInfo> getImagesByPackageDetailId(
			Long packageDetailId) {
		String sql = new String(
				"select a.UTIL_ATTACH_DOCUMENT_ID utilAttachDocumentId, a.name imageName, a.file_path imagePath , 1 status from UTIL_ATTACH_DOCUMENT a "
						+ " where a.object_id = :packageDetailId AND a.TYPE = '97' and a.STATUS = 1 "
						+ " ORDER BY a.UTIL_ATTACH_DOCUMENT_ID DESC ");
		SQLQuery query = getSession().createSQLQuery(sql);
		query.addScalar("imageName", new StringType());
		query.addScalar("imagePath", new StringType());
		query.addScalar("status", new LongType());
		query.addScalar("utilAttachDocumentId", new LongType());
		query.setParameter("packageDetailId", packageDetailId);
		query.setResultTransformer(Transformers
				.aliasToBean(ConstructionImageInfo.class));
		return query.list();
	}

	public void saveImagePathsDao(List<AIOContractDTO> lstImages,
			long contractDetailId, SysUserRequest request) {

		if (lstImages == null) {
			return;
		}

		for (AIOContractDTO pakageDetailImage : lstImages) {

			UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
			utilAttachDocumentBO.setObjectId(contractDetailId);
			utilAttachDocumentBO.setName(pakageDetailImage.getImageName());
			utilAttachDocumentBO.setType("97");
			utilAttachDocumentBO
					.setDescription("file ảnh thực hiện công việc camera aio");
			utilAttachDocumentBO.setStatus("1");
			utilAttachDocumentBO.setFilePath(pakageDetailImage.getImagePath());
			utilAttachDocumentBO.setCreatedDate(new Date());
			utilAttachDocumentBO.setCreatedUserId(request.getSysUserId());
			utilAttachDocumentBO.setCreatedUserName(request.getName());
			if (pakageDetailImage.getLongtitude() != null) {
				utilAttachDocumentBO.setLongtitude(pakageDetailImage
						.getLongtitude());
			}
			if (pakageDetailImage.getLatitude() != null) {
				utilAttachDocumentBO.setLatitude(pakageDetailImage
						.getLatitude());
			}
			long ret = utilAttachDocumentDAO.saveObject(utilAttachDocumentBO);
		}
	}

	public void updateUtilAttachDocumentById(Long utilAttachDocumentId) {
		StringBuilder sql = new StringBuilder(" ");
		sql.append("DELETE FROM UTIL_ATTACH_DOCUMENT a  WHERE a.UTIL_ATTACH_DOCUMENT_ID =:id ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("id", utilAttachDocumentId);
		query.executeUpdate();
	}

	public List<AIOMerEntityDTO> findByGoodsForExport(Long goodsId,
			String goodsState, Long stockId) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append("T1.UPDATED_DATE updatedDate ");
		stringBuilder.append(",T1.STOCK_CELL_ID stockCellId ");
		stringBuilder.append(",T1.STOCK_CELL_CODE stockCellCode ");
		stringBuilder
				.append(",T1.CAT_PRODUCING_COUNTRY_ID catProducingCountryId ");
		stringBuilder.append(",T1.PARENT_MER_ENTITY_ID parentMerEntityId ");
		stringBuilder.append(",T1.CAT_UNIT_NAME catUnitName ");
		stringBuilder.append(",T1.IMPORT_DATE importDate ");
		stringBuilder.append(",T1.MANUFACTURER_NAME manufacturerName ");
		stringBuilder
				.append(",T1.PRODUCING_COUNTRY_NAME producingCountryName ");
		stringBuilder.append(",T1.CAT_UNIT_ID catUnitId ");
		stringBuilder.append(",T1.ORDER_ID orderId ");
		stringBuilder.append(",T1.CNT_CONTRACT_CODE cntContractCode ");
		stringBuilder.append(",T1.MER_ENTITY_ID merEntityId ");
		stringBuilder.append(",T1.SERIAL serial ");
		stringBuilder.append(",T1.GOODS_ID goodsId ");
		stringBuilder.append(",T1.GOODS_CODE goodsCode ");
		stringBuilder.append(",T1.GOODS_NAME goodsName ");
		stringBuilder.append(",T1.STATE state ");
		stringBuilder.append(",T1.STATUS status ");
		stringBuilder.append(",T1.AMOUNT amount ");
		stringBuilder.append(",T1.CAT_MANUFACTURER_ID catManufacturerId ");
		stringBuilder.append(",T1.STOCK_ID stockId ");
		stringBuilder.append(",T1.CNT_CONTRACT_ID cntContractId ");
		stringBuilder.append(",T1.SYS_GROUP_ID sysGroupId ");
		stringBuilder.append(",T1.PROJECT_ID projectId ");
		stringBuilder.append(",T1.SHIPMENT_ID shipmentId ");
		stringBuilder.append(",T1.PART_NUMBER partNumber ");
		stringBuilder.append(",T1.UNIT_PRICE unitPrice ");
		stringBuilder.append(",T1.APPLY_PRICE applyPrice ");

		stringBuilder.append(",T1.IMPORT_STOCK_TRANS_ID importStockTransId ");
		stringBuilder.append(",T1.EXPORT_DATE exportDate ");

		stringBuilder.append("FROM MER_ENTITY T1 ");
		stringBuilder
				.append("WHERE T1.STATUS = 4 AND T1.GOODS_ID = :value and T1.STATE = :goodsState and T1.STOCK_ID = :stockId ");
		stringBuilder.append("order by T1.IMPORT_DATE");

		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());

		query.addScalar("updatedDate", new DateType());
		query.addScalar("stockCellId", new LongType());
		query.addScalar("stockCellCode", new StringType());
		query.addScalar("catProducingCountryId", new LongType());
		query.addScalar("parentMerEntityId", new LongType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("importDate", new DateType());
		query.addScalar("manufacturerName", new StringType());
		query.addScalar("producingCountryName", new StringType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("orderId", new LongType());
		query.addScalar("cntContractCode", new StringType());
		query.addScalar("merEntityId", new LongType());
		query.addScalar("serial", new StringType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("state", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("amount", new DoubleType());
		query.addScalar("catManufacturerId", new LongType());
		query.addScalar("stockId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("projectId", new LongType());
		query.addScalar("shipmentId", new LongType());
		query.addScalar("partNumber", new StringType());
		query.addScalar("unitPrice", new DoubleType());
		query.addScalar("applyPrice", new DoubleType());
		query.addScalar("exportDate", new DateType());
		query.addScalar("importStockTransId", new LongType());

		query.setParameter("value", goodsId);
		query.setParameter("goodsState", goodsState);
		query.setParameter("stockId", stockId);
		query.setResultTransformer(Transformers
				.aliasToBean(AIOMerEntityDTO.class));

		return query.list();
	}

	public AIOMerEntityDTO findBySerial(AIOMerEntityDTO obj) {
		StringBuilder sql = new StringBuilder(
				"SELECT s.STOCK_ID stockId,"
						+ "st.NAME stockName,"
						+ "s.GOODS_ID goodsId,"
						+ "s.CNT_CONTRACT_CODE cntContractCode, "
						+ "s.MER_ENTITY_ID merEntityId, "
						+ "s.MANUFACTURER_NAME manufacturerName "
						+ ",s.PRODUCING_COUNTRY_NAME producingCountryName "
						+ ",s.CAT_UNIT_ID catUnitId "
						+ ",s.CAT_UNIT_NAME catUnitName "
						+ ",s.PARENT_MER_ENTITY_ID parentMerEntityId "
						+ ",s.ORDER_ID orderId "
						+ ",s.MER_ENTITY_ID merEntityId "
						+ ",s.SERIAL serial "
						+ ",s.GOODS_ID goodsId "
						+ ",s.GOODS_CODE goodsCode "
						+ ",s.GOODS_NAME goodsName "
						+ ",s.STATE state "
						+ ",s.STATUS status "
						+ ",s.IMPORT_DATE importDate "
						+ ",s.AMOUNT amount "
						+ ",s.CAT_MANUFACTURER_ID catManufacturerId "
						+ ",s.CAT_PRODUCING_COUNTRY_ID catProducingCountryId "
						+ ",s.STOCK_ID stockId "
						+ ",s.CNT_CONTRACT_ID cntContractId "
						+ ",s.SYS_GROUP_ID sysGroupId "
						+ ",s.PROJECT_ID projectId "
						+ ",s.SHIPMENT_ID shipmentId "
						+ ",s.PART_NUMBER partNumber "
						+ ",s.UNIT_PRICE unitPrice "
						+ ",s.APPLY_PRICE applyPrice "
						+ ",s.UPDATED_DATE updatedDate "
						+ ",s.STOCK_CELL_ID stockCellId "
						+ ",s.STOCK_CELL_CODE stockCellCode "
						+ ",s.IMPORT_STOCK_TRANS_ID importStockTransId "
						+ ",s.EXPORT_DATE exportDate "
						+ "FROM MER_ENTITY s "
						+ "INNER JOIN CAT_STOCK st ON s.STOCK_ID = st.CAT_STOCK_ID "
						+ "left JOIN CNT_CONTRACT SC ON SC.CNT_CONTRACT_ID = s.CNT_CONTRACT_ID "
						+ "WHERE s.STATUS = '4' ");
		if (obj.getGoodsId() != null) {
			sql.append(" AND (s.GOODS_ID = :goodsId)");
		}
		if (obj.getStockId() != null) {
			sql.append(" AND (s.STOCK_ID = :stockId )");
		}
		if (obj.getState() != null) {
			sql.append(" AND (s.STATE = :state )");
		}
		if ((obj.getSerial() != null)) {
			sql.append(" AND upper(s.SERIAL) = upper(:serial)  ");
		}

		sql.append(" ORDER BY st.NAME");

		SQLQuery query = getSession().createSQLQuery(sql.toString());

		query.addScalar("merEntityId", new LongType());
		query.addScalar("stockId", new LongType());
		query.addScalar("stockName", new StringType());
		query.addScalar("stockCellId", new LongType());
		query.addScalar("parentMerEntityId", new LongType());
		query.addScalar("stockCellCode", new StringType());
		query.addScalar("goodsId", new LongType());
		query.addScalar("goodsCode", new StringType());
		query.addScalar("goodsName", new StringType());
		query.addScalar("serial", new StringType());
		query.addScalar("amount", new DoubleType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("state", new StringType());
		query.addScalar("status", new StringType());
		query.addScalar("cntContractCode", new StringType());
		query.addScalar("importDate", new DateType());
		query.addScalar("manufacturerName", new StringType());
		query.addScalar("producingCountryName", new StringType());
		query.addScalar("catUnitId", new LongType());
		query.addScalar("catUnitName", new StringType());
		query.addScalar("updatedDate", new DateType());
		query.addScalar("orderId", new LongType());
		query.addScalar("catManufacturerId", new LongType());

		query.addScalar("exportDate", new DateType());
		query.addScalar("importStockTransId", new LongType());

		query.addScalar("catProducingCountryId", new LongType());
		query.addScalar("cntContractId", new LongType());
		query.addScalar("sysGroupId", new LongType());
		query.addScalar("projectId", new LongType());
		query.addScalar("shipmentId", new LongType());
		query.addScalar("partNumber", new StringType());
		query.addScalar("unitPrice", new DoubleType());
		query.addScalar("applyPrice", new DoubleType());
		if (obj.getGoodsId() != null) {
			query.setParameter("goodsId", obj.getGoodsId());
		}
		if (obj.getState() != null) {
			query.setParameter("state", obj.getState());
		}
		if (obj.getStockId() != null) {
			query.setParameter("stockId", obj.getStockId());
		}
		if ((obj.getSerial() != null)) {
			query.setParameter("serial", obj.getSerial());
		}
		query.setResultTransformer(Transformers
				.aliasToBean(AIOMerEntityDTO.class));
		return (AIOMerEntityDTO) query.uniqueResult();
		// return query.list();
	}

	public Long insertBillExportSock(AIOContractMobileRequest obj) {
		String createdStockTransCode = StringUtils.EMPTY;
		if (obj.getAioContractDTO().getCheckStock() == 1) {
			String userName = getUserName(obj.getSysUserRequest()
					.getSysUserId());
			String GroupName = getGroupName(obj.getSysUserRequest()
					.getDepartmentId());
			AIOContractDTO stock = getStock(obj.getSysUserRequest()
					.getSysUserId());
			AIOSynStockTransDTO stockTransDto = new AIOSynStockTransDTO();
			Long sequence = getSequenceStock();
			stockTransDto.setCode("PXK_" + stock.getStockCode() + "/19/"
					+ sequence);
			stockTransDto.setType("2");
			stockTransDto.setStockId(stock.getStockId());
			stockTransDto.setStockCode(stock.getStockCode());
			stockTransDto.setStockName(stock.getStockName());
			stockTransDto.setStatus("2");
			stockTransDto.setSignState("3");
			stockTransDto.setDescription("Xuất kho bán hàng");
			stockTransDto.setCreatedByName(userName);
			stockTransDto.setCreatedDeptId(obj.getSysUserRequest()
					.getDepartmentId());
			stockTransDto.setCreatedDeptName(GroupName);
			stockTransDto.setRealIeTransDate(new Date());
			stockTransDto.setRealIeUserId(String.valueOf(obj
					.getSysUserRequest().getSysUserId()));
			stockTransDto.setRealIeUserName(userName);
			stockTransDto.setContractCode(obj.getAioContractDTO()
					.getContractCode());
			stockTransDto.setCreatedBy(obj.getSysUserRequest().getSysUserId());
			stockTransDto.setCreatedDate(new Date());
			stockTransDto.setBusinessTypeName("Xuất bán cho khách hàng");
			stockTransDto.setDeptReceiveName(GroupName);
			stockTransDto.setDeptReceiveId(obj.getSysUserRequest()
					.getDepartmentId());
			stockTransDto.setBussinessType("11");
			stockTransDto.setCustId(obj.getAioContractDTO().getCustomerId());
			StockTransBO boStock = stockTransDto.toModel();
			Long stockTransId = aiostockTransDAO.saveObject(boStock);
			//VietNT_06/08/2019_start
			createdStockTransCode = stockTransDto.getCode();
			//VietNT_end
//			hoanm1_20190504_comment_start
//			boStock.setStockTransId(stockTransId);
//			aiostockTransDAO.update(boStock);
//			hoanm1_20190504_comment_end
			if (obj.getLstAIOContractMobileDTO() != null) {
				for (AIOContractDTO bo : obj.getLstAIOContractMobileDTO()) {
					Double totalPrice = (double) 0;
					AIOSynStockTransDetailDTO dto = new AIOSynStockTransDetailDTO();
					dto.setStockTransId(stockTransId);
					dto.setGoodsId(bo.getGoodsId());
					dto.setGoodsCode(bo.getGoodsCode());
					dto.setGoodsName(bo.getGoodsName());
					dto.setGoodsIsSerial(bo.getGoodsIsSerial().toString());
					dto.setGoodsUnitId(bo.getGoodsUnitId());
					dto.setGoodsUnitName(bo.getGoodsUnitName());
					dto.setAmountReal(bo.getQuantity());
					dto.setAmountOrder(bo.getQuantity());
					dto.setGoodsState("1");
					dto.setGoodsStateName("Bình thường");
					dto.setGoodsType(bo.getGoodType());
//					hoanm1_20190508_start
					AIOSynStockTransDetailDTO goodType=getGoodTypeName(bo.getGoodsId());
					dto.setGoodsTypeName(goodType.getGoodsTypeName());
//					hoanm1_20190508_end
					StockTransDetailBO boStockDetail = dto.toModel();
					Long idDetail = aiostockTransDetailDAO
							.saveObject(boStockDetail);
					LOGGER.error("Hoanm1 start: kết thúc CV Camera có stock_trans_detail");
			        LOGGER.error(stockTransId +"_"+ idDetail);
			        LOGGER.error("Hoanm1 end: kết thúc CV Camera có stock_trans_detail");
//					hoanm1_20190504_comment_start
//					boStockDetail.setStockTransDetailId(idDetail);
//					aiostockTransDetailDAO.update(boStockDetail);
//					hoanm1_20190504_comment_end
					
//					 hoanm1_20190425_start
//					SysUserCOMSDTO userDto = getSysUserBySysUserId(obj.getSysUserRequest()
//							.getSysUserId());
//					insertLogDeliveryMaterials(userDto, obj);
//					 hoanm1_20190425_end
					
					List<String> lst = new ArrayList<String>();
					if (bo.getTypeSerial() == 1) {
						lst = bo.getLstSerial();
					} else {
						lst = bo.getLstSerialText();
					}
					if (lst !=null ) {
						for (int i = 0; i < lst.size(); i++) {
							AIOMerEntityDTO mer = new AIOMerEntityDTO();
							mer.setSerial(lst.get(i));
							mer.setStockId(stock.getStockId());
							mer.setGoodsId(bo.getGoodsId());
							mer.setState("1");
							AIOMerEntityDTO merEntityDto = findBySerial(mer);
							if (merEntityDto != null) {
								merEntityDto.setStatus("5");
								if (merEntityDto.getExportDate() == null) {
									merEntityDto.setExportDate(new Date());
								}
//								hoanm1_20190504_comment_start
//								String idMerUpdate = aioMerEntityDAO
//										.update(merEntityDto.toModel());
//								hoanm1_20190504_comment_end
								aioMerEntityDAO.update(merEntityDto.toModel());
								AIOStockTransDetailSerialDTO detailSerial = createFromMerEntity(
										merEntityDto, stockTransId, idDetail);
								totalPrice = totalPrice
										+ detailSerial.getQuantity()
										* (detailSerial.getPrice() != null ? detailSerial
												.getPrice() : 0);
								Long idDetailSerial = aiostockTransDetailSerialDAO
										.saveObject(detailSerial.toModel());
							} else {
//								return -1L;
								throw new BusinessException("Hàng hóa không tồn tại trong kho xuất của người dùng");
							}
						}
					} else {
						List<AIOMerEntityDTO> availabelGoods = findByGoodsForExport(
								bo.getGoodsId(), "1", stock.getStockId());
						if (availabelGoods == null
								|| availabelGoods.size() == 0) {
//							return -1L;
							throw new BusinessException("Hàng hóa không tồn tại trong kho xuất của người dùng");
						}
						AIOMerEntityDTO currentEntity = null;
						Double exportAmount = bo.getQuantity();
						Double amountSum = findByGoodsForExportSum(
								bo.getGoodsId(), "1", stock.getStockId());
						if (exportAmount - amountSum > 0) {
//							return -2L;
							throw new BusinessException("Số lượng hàng tồn kho không đủ");
						}
						StringBuilder lstMerEntityId = new StringBuilder("");
						for (AIOMerEntityDTO goods : availabelGoods) {
							if (exportAmount - goods.getAmount() < 0) {
								currentEntity = goods;
								break;
							}
							exportAmount = (double) Math
									.round((exportAmount - goods.getAmount()) * 1000) / 1000;// update
							goods.setStatus("5");
							if (goods.getExportDate() == null) {
								goods.setExportDate(new Date());
							}
//							hoanm1_20190504_comment_start
//							String idMerUpdate = aioMerEntityDAO.update(goods
//									.toModel());
//							hoanm1_20190504_comment_end
							aioMerEntityDAO.update(goods.toModel());

							AIOStockTransDetailSerialDTO detailSerial = createFromMerEntity(
									goods, stockTransId, idDetail);
							if (detailSerial.getPrice() == null) {
								detailSerial.setPrice(0d);
							}
							totalPrice = totalPrice
									+ detailSerial.getQuantity()
									* detailSerial.getPrice();
							Long idDetailSerial = aiostockTransDetailSerialDAO
									.saveObject(detailSerial.toModel());
						}
						if (exportAmount > 0) {
							Long currentId = currentEntity.getMerEntityId();
							Long currentParrent_entity = currentEntity
									.getParentMerEntityId();
							Double remainAmount = currentEntity.getAmount()
									- exportAmount;
							Long currentOrderId = currentEntity.getOrderId();
							Date currentExportDate = currentEntity
									.getExportDate();
							// tach mer entity moi
							AIOMerEntityDTO newEntity = currentEntity;
							newEntity.setId(null);
							newEntity.setMerEntityId(0l);
							newEntity.setAmount(exportAmount);
							newEntity.setParentMerEntityId(currentId);
							newEntity.setStatus("5");
							if (newEntity.getExportDate() == null) {
								newEntity.setExportDate(new Date());
							}
							Long idMerInsert = aioMerEntityDAO
									.saveObject(newEntity.toModel());
//							hoanm1_20190504_comment_start
//							aioMerEntityDAO.update(newEntity.toModel());
//							hoanm1_20190504_comment_end
							newEntity.setMerEntityId(idMerInsert);
							// luu stock trans detail serial
							AIOStockTransDetailSerialDTO detailSerial = createFromMerEntity(
									newEntity, stockTransId, idDetail);
							Double price = detailSerial.getPrice() != null ? detailSerial
									.getPrice() : 0;
							totalPrice = totalPrice
									+ detailSerial.getQuantity() * price;
							Long idDetailSerial = aiostockTransDetailSerialDAO
									.saveObject(detailSerial.toModel());
							// update lai thong tin mer entity goc
							currentEntity.setAmount(remainAmount);
							currentEntity.setStatus("4");
							currentEntity.setMerEntityId(currentId);
							currentEntity
									.setParentMerEntityId(currentParrent_entity);
							currentEntity.setOrderId(currentOrderId);
							currentEntity.setExportDate(currentExportDate);
//							hoanm1_20190504_comment_start
//							String idMerUpdate = aioMerEntityDAO
//									.update(currentEntity.toModel());
//							hoanm1_20190504_comment_end
							aioMerEntityDAO.update(currentEntity.toModel());
						}
					}
					boStockDetail.setTotalPrice(totalPrice);
					aiostockTransDetailDAO.update(boStockDetail);
//					hoanm1_20190517_start
					bo.setPriceRecordDetail((double) Math.round(( totalPrice/bo.getQuantity() ) * 100) / 100 );
//					hoanm1_20190517_end
//					hoanm1_20190508_start
					AIOSynStockTransDTO stockTotal = getStockGoodTotal(stock.getStockId(),bo.getGoodsId());
					StringBuilder sql = new StringBuilder("");
					if (stockTotal != null) {
						sql.append("UPDATE stock_goods_total st set change_date=sysdate, st.amount= "
								+ stockTotal.getAmount()
								+ " - :amount,st.amount_issue =  "
								+ stockTotal.getAmountIssue()+ " - :amount "
								+ " WHERE st.stock_goods_total_id  = :stockGoodsTotalId");
						SQLQuery query = getSession()
								.createSQLQuery(sql.toString());
						query.setParameter("amount", bo.getQuantity());
						query.setParameter("stockGoodsTotalId",
								stockTotal.getStockGoodsTotalId());
						query.executeUpdate();
					}
//					hoanm1_20190508_end
				}
			}else{
				LOGGER.error("Hoanm1 start: kết thúc CV Camera không có stock_trans_detail");
		        LOGGER.error(stockTransId);
		        LOGGER.error("Hoanm1 end: kết thúc CV Camera không có stock_trans_detail");
			}
			
		}
//		updateEndContract(obj, createdStockTransCode);
		aioContractServiceMobileDAO.updateEndContract(obj, createdStockTransCode);
		// hoanm1_20190413_start
		SysUserCOMSDTO userDto = getSysUserBySysUserId(obj.getSysUserRequest().getSysUserId());
		insertLogUpdateCamera(userDto, obj);
		// hoanm1_20190413_end
		return 1L;
	}

	public long getSequenceStock() {
		String sql = new String(
				"select cat_stock_seq.nextval sequenceStockId from dual ");
		SQLQuery query = getSession().createSQLQuery(sql);
		query.addScalar("sequenceStockId", new LongType());
		List<Long> lstSequence = query.list();
		if (lstSequence != null && lstSequence.size() > 0) {
			return lstSequence.get(0);
		}
		return -1;
	}

	public Double findByGoodsForExportSum(Long goodsId, String goodsState,
			Long stockId) {
		StringBuilder stringBuilder = new StringBuilder("SELECT ");
		stringBuilder.append(" sum(T1.AMOUNT) amount ");
		stringBuilder.append("FROM MER_ENTITY T1 ");
		stringBuilder
				.append("WHERE T1.STATUS = 4 AND T1.GOODS_ID = :value and T1.STATE = :goodsState and T1.STOCK_ID = :stockId ");
		SQLQuery query = getSession().createSQLQuery(stringBuilder.toString());
		query.addScalar("amount", new DoubleType());
		query.setParameter("value", goodsId);
		query.setParameter("goodsState", goodsState);
		query.setParameter("stockId", stockId);

		List<Double> lstDoub = query.list();
		if (lstDoub != null && lstDoub.size() > 0) {
			return lstDoub.get(0);
		}
		return 0D;
	}

	public String checkStatus(SysUserRequest request) {
		StringBuilder sql = new StringBuilder("");
		sql.append(" select a.contract_id contractId from AIO_CONTRACT a,AIO_CONTRACT_DETAIL b where a.contract_id=b.contract_id ");
		sql.append(" and  b.status in(2) and a.performer_id = :sysUserId ");
		SQLQuery query = getSession().createSQLQuery(sql.toString());
		query.setParameter("sysUserId", request.getSysUserId());
		query.addScalar("contractId", new StringType());
		List<String> lstContract = query.list();
		if (lstContract != null && lstContract.size() > 0) {
			return lstContract.get(0).toString();
		}
		return "";
	}
	// aio_20190315_end
//	hoanm1_20190508_start
	public AIOSynStockTransDetailDTO getGoodTypeName(Long goodsId) {
		String sql = new String(
				"select a.GOODS_TYPE goodsType,b.name goodsTypeName from goods a,app_param b where b.par_type='GOODS_TYPE' and a.goods_type=b.code and a.goods_id = :goodsId ");
		SQLQuery query = getSession().createSQLQuery(sql);
		query.setParameter("goodsId", goodsId);
		query.addScalar("goodsType", new StringType());
		query.addScalar("goodsTypeName", new StringType());
		query.setResultTransformer(Transformers
				.aliasToBean(AIOSynStockTransDetailDTO.class));
		return (AIOSynStockTransDetailDTO) query.uniqueResult();
	}
	public AIOSynStockTransDTO getStockGoodTotal(Long StockId, Long goodId) {
		String sql = new String(
				"select a.stock_id stockId,a.stock_goods_total_id stockGoodsTotalId, a.amount,a.amount_issue amountIssue from stock_goods_total a where stock_id = :stockId and goods_id = :goodId ");
		SQLQuery query = getSession().createSQLQuery(sql);
		query.setParameter("stockId", StockId);
		query.setParameter("goodId", goodId);
		query.addScalar("stockGoodsTotalId", new LongType());
		query.addScalar("stockId", new LongType());
		query.addScalar("amount", new DoubleType());
		query.addScalar("amountIssue", new DoubleType());
		query.setResultTransformer(Transformers
				.aliasToBean(AIOSynStockTransDTO.class));
		return (AIOSynStockTransDTO) query.uniqueResult();
	}
//	hoanm1_20190508_end
}
