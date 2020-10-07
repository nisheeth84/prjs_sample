package com.viettel.vtpgw.ws;

import com.viettel.vtpgw.domain.service.abs.IBackupService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("backup")
public class BackupController {
    private IBackupService iBackupService;

    public BackupController(IBackupService iBackupService) {
        this.iBackupService = iBackupService;
    }

    @GetMapping("")
    public String index() {
        return "backup";
    }

    @GetMapping("/list")
    @ResponseBody
    public String getList() {
        return "backup";
    }

    @GetMapping("/backup")
    public String backup() {
        iBackupService.backupAll();
//        iBackupService.getAllData();
        return "backup";
    }
}
