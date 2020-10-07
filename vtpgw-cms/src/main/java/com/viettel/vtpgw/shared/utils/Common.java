package com.viettel.vtpgw.shared.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class Common {

    public static String getSourcePath() {
        return System.getProperty("user.dir");
    }

    public static <T> boolean saveObjsToFile (List<T> listObj, String fileName, String filePath) {
        Path folderBackupPath = Paths.get(filePath);
        try {
            if (!Files.exists(folderBackupPath)) {
                Files.createDirectories(folderBackupPath);
            }

            folderBackupPath = Paths.get(filePath + Constants.DIVIDER + fileName);
            if (Files.notExists(folderBackupPath)) {
                Files.createFile(folderBackupPath);
            }

            Gson gson = new Gson();
            String json = gson.toJson(listObj);

            Files.write(folderBackupPath, json.getBytes());
        } catch (Exception ex) {
            return false;
        }
        return true;
    }

    public static <T> List<T> readObjsFromFile (String fileName, String folderPath) {
        List<T> listObj = new ArrayList<>();
        StringBuffer strBuff = new StringBuffer();
        Path filePath = Paths.get(folderPath + Constants.DIVIDER + fileName);
        try {
            List<String> listStr = Files.readAllLines(filePath);
            listStr.forEach(strBuff::append);
            ObjectMapper mapper = new ObjectMapper();
            listObj = mapper.readValue(strBuff.toString(), new TypeReference<List<T>>(){});
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return listObj;
    }
}
