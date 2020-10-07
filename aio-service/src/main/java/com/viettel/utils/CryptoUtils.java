package com.viettel.utils;

import com.viettel.ktts2.common.BusinessException;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class CryptoUtils {

    private static final String HMAC_SHA1_ALGORITHM = "HmacSHA1";
    private static final String ALGORITHM = "RSA";
    private static final String DIVIDER = ":";

//    @Value("${public_key}")
//    private String PUBLIC_KEY;

    @Value("${private_key}")
    private String PRIVATE_KEY;

    private PrivateKey getPrivateKey() throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(PRIVATE_KEY);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(spec);
    }

    public String decryptText(String msg) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, getPrivateKey());
        return new String(cipher.doFinal(Base64.getDecoder().decode(msg)), StandardCharsets.UTF_8);
    }

//    private PublicKey getPublicKey() throws Exception {
//        byte[] keyBytes = Base64.getDecoder().decode(PUBLIC_KEY);
//        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
//        KeyFactory kf = KeyFactory.getInstance("RSA");
//        return kf.generatePublic(spec);
//    }
//
//    public String encryptText(String msg) throws Exception {
//        Cipher cipher = Cipher.getInstance(ALGORITHM);
//        cipher.init(Cipher.ENCRYPT_MODE, getPublicKey());
//        return Base64.getEncoder().encodeToString(cipher.doFinal(msg.getBytes(StandardCharsets.UTF_8)));
//    }

    public static String hmac(String data, String key) throws java.security.SignatureException {
        String result;
        try {
            SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(), HMAC_SHA1_ALGORITHM);
            Mac mac = Mac.getInstance(HMAC_SHA1_ALGORITHM);
            mac.init(signingKey);
            byte[] rawHmac = mac.doFinal(data.getBytes());
            result = new org.apache.commons.codec.binary.Base64().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new SignatureException("Failed to generate HMAC : " + e.getMessage());
        }
        return result;
    }

    public static String hashPassword(String data) {
        // make salt
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);

        byte[] hash = hash(data, salt);

        String salt64 = Base64.getEncoder().encodeToString(salt);
        String encoded = Base64.getEncoder().encodeToString(hash);
        return encoded + DIVIDER + salt64;
    }

    private static byte[] hash(String data, byte[] salt) {
        try {
            KeySpec spec = new PBEKeySpec(data.toCharArray(), salt, 65536, 128);
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
            return factory.generateSecret(spec).getEncoded();
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new BusinessException("Có lỗi xảy ra khi hash");
        }
    }

    public static boolean checkStringEqual(String data, String stored) {
        String[] parts = stored.split(DIVIDER);
        byte[] salt = Base64.getDecoder().decode(parts[1]);
        byte[] hash = hash(data, salt);
        return Base64.getEncoder().encodeToString(hash).equals(parts[0]);
    }
}
