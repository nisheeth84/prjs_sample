package com.viettel.utils;

import org.apache.commons.codec.binary.Base64;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class ImageUtil {

    public static void deleteFile(String filePath) {
        File file = new File(filePath);

        if (file.isFile()) {
            file.delete();
        }
    }

    public static String convertImageToBase64(String filePath) {
        String base64 = null;
        Path path = Paths.get(filePath);
        byte[] imageBytes;

        try {
            imageBytes = Files.readAllBytes(path);
            base64 = Base64.encodeBase64String(imageBytes);
        } catch (IOException e) {
            base64 = null;
        }

        return base64;
    }

    public static InputStream convertBase64ToInputStream(String base64) {

        if (base64 == null || base64.isEmpty()) {
            return null;
        }

        byte[] byteArray = Base64.decodeBase64(base64);

        InputStream fis = new ByteArrayInputStream(byteArray);

        return fis;
    }

    public static boolean saveBase64ImageToFile(String base64, String filePath) {

        if (base64 == null || base64.isEmpty() || filePath == null || filePath.isEmpty()) {
            return false;
        }

        try {
            // Decode String using Base64 Class
            byte[] imageByteArray = Base64.decodeBase64(base64);

            // Write Image into File system - Make sure you update the path
            FileOutputStream imageOutFile = new FileOutputStream(filePath);
            imageOutFile.write(imageByteArray);

            imageOutFile.close();

            System.out.println("Image Successfully Stored");
            return true;
        } catch (FileNotFoundException fnfe) {
            System.out.println("Image Path not found" + fnfe);
            return false;
        } catch (IOException ioe) {
            System.out.println("Exception while converting the Image " + ioe);
            return false;
        }

    }
}
