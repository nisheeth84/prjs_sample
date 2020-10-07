package jp.classmethod.premembers.check.security.util;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jp.classmethod.premembers.check.security.exception.PremembersApplicationException;

public class FileUtil {
    private final static Logger LOGGER = LoggerFactory.getLogger(FileUtil.class);

    /**
     * ファイル出力します。
     *
     * @param fileName
     * @param text
     */
    public static void outputFile(String directoryName, String fileName, String text) {
        Path directory = Paths.get(directoryName);
        try {
            Files.createDirectories(directory);
        } catch (IOException e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            throw new PremembersApplicationException("ERROR", e.getMessage());
        }
        Path path = new File(directoryName + "/" + fileName).toPath();
        try (BufferedWriter bw = Files.newBufferedWriter(path)) {
            bw.write(text);
        } catch (IOException e) {
            LOGGER.error(PremembersUtil.getStackTrace(e));
            throw new PremembersApplicationException("ERROR", e.getMessage());
        }
    }

    /**
     * 対象パスのディレクトリの削除を行います。 ディレクトリ配下のファイル等が存在する場合は 配下のファイルをすべて削除します。
     *
     * @param dirPath
     *            削除対象ディレクトリパス
     */
    public static void deleteDirectory(String dirPath) {
        File file = new File(dirPath);
        recursiveDeleteFile(file);
    }

    /**
     * 対象のファイルオブジェクトの削除を行います。
     *
     * @param file
     *            ファイルオブジェクト
     */
    private static void recursiveDeleteFile(final File file) {
        // 存在しない場合は処理終了
        if (!file.exists()) {
            LOGGER.info("存在しないパスです: FilePath=" + file.getAbsolutePath());
            return;
        }
        // 対象がディレクトリの場合は再帰処理
        if (file.isDirectory()) {
            for (File child : file.listFiles()) {
                recursiveDeleteFile(child);
            }
        }
        // 対象がファイルもしくは配下が空のディレクトリの場合は削除する
        file.delete();
    }

    /**
     * ファイルの削除を行います
     *
     * @param filePath
     *            ファイルパス
     */
    public static void fileDelete(String filePath) {
        File file = new File(filePath);

        if (file.exists()) {
            if (file.delete()) {
                LOGGER.info("ファイルを削除しました: FilePath=" + filePath);
            } else {
                LOGGER.warn("ファイルの削除に失敗しました: FilePath=" + filePath);
            }
        }
    }
}