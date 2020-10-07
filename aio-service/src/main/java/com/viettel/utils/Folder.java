/**
 *
 */
package com.viettel.utils;

import com.google.common.base.Joiner;

import java.io.File;
import java.time.MonthDay;
import java.time.Year;

/**
 * @author rocke
 */
public abstract class Folder {
    public static String getFolderSubfix(String folderName) {
        return Joiner.on(File.separatorChar).join(folderName, Year.now().getValue(), MonthDay.now().getMonthValue(),
                MonthDay.now().getDayOfMonth());

    }
}
