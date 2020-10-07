package com.viettel.vtpgw.domain.service;

import com.google.gson.Gson;
import com.viettel.vtpgw.domain.service.abs.IBackupService;
import com.viettel.vtpgw.persistence.entity.AccountEntity;
import com.viettel.vtpgw.persistence.entity.ApplicationEntity;
import com.viettel.vtpgw.persistence.repository.IAccountRepository;
import com.viettel.vtpgw.persistence.repository.IApplicationRepository;
import com.viettel.vtpgw.persistence.repository.IContactRepository;
import com.viettel.vtpgw.persistence.repository.INodeRepository;
import com.viettel.vtpgw.persistence.repository.IPermissionRepository;
import com.viettel.vtpgw.persistence.repository.IReportRepository;
import com.viettel.vtpgw.persistence.repository.IServiceRepository;
import com.viettel.vtpgw.shared.utils.Common;
import com.viettel.vtpgw.shared.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BackupService implements IBackupService {
    @Autowired
    public BackupService(IAccountRepository iAccountRepository, IContactRepository iContactRepository,
                         IApplicationRepository iApplicationRepository, INodeRepository iNodeRepository,
                         IPermissionRepository iPermissionRepository, IReportRepository iReportRepository,
                         IServiceRepository iServiceRepository) {
        this.iAccountRepository = iAccountRepository;
        this.iApplicationRepository = iApplicationRepository;
        this.iContactRepository = iContactRepository;
        this.iNodeRepository = iNodeRepository;
        this.iPermissionRepository = iPermissionRepository;
        this.iReportRepository = iReportRepository;
        this.iServiceRepository = iServiceRepository;
    }

    private IAccountRepository iAccountRepository;
    private IApplicationRepository iApplicationRepository;
    private IContactRepository iContactRepository;
    private INodeRepository iNodeRepository;
    private IPermissionRepository iPermissionRepository;
    private IReportRepository iReportRepository;
    private IServiceRepository iServiceRepository;
    private Gson gson;


    @Override
    public boolean backupAll() {
        String folderBackupPathStr = Common.getSourcePath() + Constants.BACKUP_FILE_PATH + System.currentTimeMillis();
        System.out.println(folderBackupPathStr);
        try {
            Common.saveObjsToFile(iAccountRepository.findAll(), Constants.ACCOUNT_FILE, folderBackupPathStr);
            Common.saveObjsToFile(iApplicationRepository.findAll(), Constants.APPLICATION_FILE, folderBackupPathStr);
//            Common.saveObjsToFile(iContactRepository.findAll(), Constants.CONTACT_FILE, folderBackupPathStr);
            Common.saveObjsToFile(iNodeRepository.findAll(), Constants.NODES_FILE, folderBackupPathStr);
            Common.saveObjsToFile(iPermissionRepository.findAll(), Constants.PERMISSION_FILE, folderBackupPathStr);
            Common.saveObjsToFile(iReportRepository.findAll(), Constants.REPORT_FILE, folderBackupPathStr);
            Common.saveObjsToFile(iServiceRepository.findAll(), Constants.SERVICE_FILE, folderBackupPathStr);
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public void getAllData() {
        String folderBackupPathStr = Common.getSourcePath() + Constants.BACKUP_FILE_PATH;
        try {
            List<AccountEntity> listAccount = Common.readObjsFromFile(Constants.ACCOUNT_FILE, folderBackupPathStr);
            List<ApplicationEntity> listApplication = Common.readObjsFromFile(Constants.APPLICATION_FILE, folderBackupPathStr);
//            List<ContactEntity> listContact = Common.readObjsFromFile(Constants.CONTACT_FILE, folderBackupPathStr);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
