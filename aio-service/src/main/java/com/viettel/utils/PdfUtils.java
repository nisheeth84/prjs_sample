package com.viettel.utils;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.*;

import java.io.File;
import java.io.FileOutputStream;

public class PdfUtils {
    private static final String KE_HOACH_NAM = "KeHoachNam";
    private static final String KE_HOACH_THANG_TONG_THE = "KeHoachThangTongThe";
    private static final String KE_HOACH_THANG_CHI_TIET = "KeHoachThangChiTiet";

    // add note vao pdf theo toa do cua tung template
    public static void addNoteIntoFile(File file, String fileName)
            throws Exception {
        // TODO Auto-generated method stub

        if (file != null) {
            PdfReader reader = null;
            PdfStamper stamper = null;
            String inputFile = file.getAbsolutePath();
            String outputFile = file.getAbsolutePath() + ".pdf";
            try {
                // reader = new PdfReader(file.getAbsolutePath());
                reader = new PdfReader(inputFile);
                stamper = new PdfStamper(reader, new FileOutputStream(
                        outputFile));
                int pageNum = reader.getNumberOfPages();
                float pageHeight = reader
                        .getPageSize(reader.getNumberOfPages()).getHeight();
                float pageWidth = reader.getPageSize(reader.getNumberOfPages())
                        .getWidth();
                PdfDictionary page;
                page = reader.getPageN(pageNum);
                int i = 1;
                if (page != null) {
                    if (KE_HOACH_THANG_CHI_TIET.equalsIgnoreCase(fileName)) {

                        PdfContentByte under = stamper.getUnderContent(pageNum);
                        Rectangle rect = new Rectangle(pageWidth - 170,
                                pageHeight - 100, pageWidth - 150,
                                pageHeight - 80);
                        PdfAnnotation annotation = PdfAnnotation
                                .createSquareCircle(stamper.getWriter(), rect,
                                        (i++) + "", false);
                        annotation.setTitle("Note");
                        annotation.setColor(BaseColor.YELLOW);
                        annotation.setFlags(PdfAnnotation.FLAGS_PRINT);
                        under.addAnnotation(annotation, true);

                        rect = new Rectangle(150, pageHeight - 100, 170,
                                pageHeight - 80);
                        annotation = PdfAnnotation.createSquareCircle(
                                stamper.getWriter(), rect, (i++) + "", false);
                        annotation.setTitle("Note");
                        annotation.setColor(BaseColor.YELLOW);
                        annotation.setFlags(PdfAnnotation.FLAGS_PRINT);
                        under.addAnnotation(annotation, true);


                    } else {
                        PdfContentByte under = stamper.getUnderContent(pageNum);
                        Rectangle rect = new Rectangle(pageWidth - 170,
                                pageHeight - 220, pageWidth - 150,
                                pageHeight - 200);
                        PdfAnnotation annotation = PdfAnnotation
                                .createSquareCircle(stamper.getWriter(), rect,
                                        (i++) + "", false);
                        annotation.setTitle("Note");
                        annotation.setColor(BaseColor.YELLOW);
                        annotation.setFlags(PdfAnnotation.FLAGS_PRINT);
                        under.addAnnotation(annotation, true);

                        rect = new Rectangle(150, pageHeight - 220, 170,
                                pageHeight - 200);
                        annotation = PdfAnnotation.createSquareCircle(
                                stamper.getWriter(), rect, (i++) + "", false);
                        annotation.setTitle("Note");
                        annotation.setColor(BaseColor.YELLOW);
                        annotation.setFlags(PdfAnnotation.FLAGS_PRINT);
                        under.addAnnotation(annotation, true);

                        rect = new Rectangle(pageWidth / 2 - 10,
                                pageHeight - 100, pageWidth / 2 + 10,
                                pageHeight - 120);
                        annotation = PdfAnnotation.createSquareCircle(
                                stamper.getWriter(), rect, (i++) + "", false);
                        annotation.setTitle("Note");
                        annotation.setColor(BaseColor.YELLOW);
                        annotation.setFlags(PdfAnnotation.FLAGS_PRINT);
                        under.addAnnotation(annotation, true);

                    }
                }

                // insert note into page 1
                page = reader.getPageN(1);
                if (page != null) {
                    Rectangle rect = new Rectangle(150, pageHeight - 180, 170,
                            pageHeight - 160);
                    PdfAnnotation annotation = PdfAnnotation
                            .createSquareCircle(stamper.getWriter(), rect,
                                    (i++) + "", false);
                    annotation.setTitle("Note");
                    annotation.setColor(BaseColor.YELLOW);
                    annotation.setFlags(PdfAnnotation.FLAGS_PRINT);
                    PdfContentByte under;
                    under = stamper.getUnderContent(1);
                    under.addAnnotation(annotation, true);

                }

            } finally {
                if (stamper != null) {
                    stamper.close();
                }
                if (reader != null) {
                    reader.close();
                }
                // rename backup file
            }
        }
    }
	/*public static void convertDoctoPDF(String inputFilePath, String outputFilePath, String printArea ) throws Exception{
		View view = new View();
		try
        {	
        	view.setPrintArea(printArea);
        	view.read(inputFilePath);
            view.setPrintGridLines(false);  //show grid line
            view.setPrintLeftMargin(0);
            view.setPrintRightMargin(0);
            view.exportPDF(outputFilePath);
            view.setDefaultFontName("Times New Roman");
        }
         catch (Exception e)
        {
            e.printStackTrace();
        }
		
	}*/
}
