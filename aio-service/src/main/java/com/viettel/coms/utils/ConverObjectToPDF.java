package com.viettel.coms.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.util.PDFTextStripper;
import org.apache.pdfbox.util.TextPosition;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfAnnotation;
import com.itextpdf.text.pdf.PdfBoolean;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfDictionary;
import com.itextpdf.text.pdf.PdfImage;
import com.itextpdf.text.pdf.PdfIndirectObject;
import com.itextpdf.text.pdf.PdfName;
import com.itextpdf.text.pdf.PdfObject;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import com.itextpdf.text.pdf.PdfString;
import com.itextpdf.text.pdf.PdfWriter;

public class ConverObjectToPDF {

	public static void addSignPlaceHolder(String inputFile, String keySearch, String comment, int shiftX, int shiftY)
			throws Exception {
		List<TextPosition> listTextPosition = findPositions(inputFile, keySearch);
		int size = listTextPosition.size();
		if (size == 0) {
			return;
		}
		Rectangle rect = null;

		String outputFile = inputFile + "_temp";
		PdfReader reader = new PdfReader(inputFile);
		PdfStamper stamper = new PdfStamper(reader, new FileOutputStream(outputFile));
		PdfAnnotation annotation;
		float pageHeight = reader.getPageSize(reader.getNumberOfPages()).getHeight();
		int orderComment = 1;
		for (TextPosition tp : listTextPosition) {
			rect = new Rectangle(tp.getX(), tp.getY(), tp.getX(), tp.getY());
			Rectangle nRect = new Rectangle(rect.getLeft() - shiftX, pageHeight - rect.getTop() - shiftY,
					rect.getLeft() - shiftX - 20, pageHeight - rect.getTop() - shiftY + 20);
			annotation = PdfAnnotation.createSquareCircle(stamper.getWriter(), nRect, String.valueOf(orderComment),
					false);
			annotation.setTitle("Note");
			annotation.setColor(BaseColor.YELLOW);
			annotation.setFlags(PdfAnnotation.FLAGS_PRINT);
			stamper.addAnnotation(annotation, reader.getNumberOfPages());
			orderComment++;
		}
		stamper.close();
		reader.close();
		// Thay the file cu
		(new File(inputFile)).delete();
		File oldFile = new File(inputFile);
		new File(outputFile).renameTo(oldFile);
	}

	public static void addSignPlaceHolderNew(String inputFile, String keySearch, String comment, int shiftX, int shiftY,
			Integer checkPage) throws Exception {
		List<TextPosition> listTextPosition = findPositions(inputFile, keySearch);
		int size = listTextPosition.size();
		Rectangle rect = null;
		if (size > 1) {
			rect = new Rectangle(listTextPosition.get(size - 1).getX(), listTextPosition.get(size - 1).getY(),
					listTextPosition.get(size - 1).getX(), listTextPosition.get(size - 1).getY());
		} else {
			rect = new Rectangle(listTextPosition.get(0).getX(), listTextPosition.get(0).getY(),
					listTextPosition.get(0).getX(), listTextPosition.get(0).getY());
		}
		String outputFile = inputFile + "_temp";
		PdfReader reader = new PdfReader(inputFile);
		PdfStamper stamper = new PdfStamper(reader, new FileOutputStream(outputFile));
		PdfAnnotation annotation;
		float pageHeight = reader.getPageSize(reader.getNumberOfPages()).getHeight();
		Rectangle nRect = new Rectangle(rect.getLeft() + shiftX, pageHeight - rect.getTop() + shiftY,
				rect.getLeft() + shiftX - 20, pageHeight - rect.getTop() + shiftY + 20);
		annotation = PdfAnnotation.createText(stamper.getWriter(), nRect, comment, comment, true, null);
		if (checkPage > 12) {
			stamper.addAnnotation(annotation, reader.getNumberOfPages());
		} else {
			stamper.addAnnotation(annotation, 1);
		}
		stamper.close();
		reader.close();
		// Thay the file cu
		(new File(inputFile)).delete();
		File oldFile = new File(inputFile);
		new File(outputFile).renameTo(oldFile);
	}

	public static PdfAnnotation createTextModify(PdfWriter writer, Rectangle rect, String title, String contents,
			boolean open, String icon) {
		PdfAnnotation annot = writer.createAnnotation(rect, PdfName.TEXT);
		if (title != null)
			annot.put(PdfName.T, new PdfString(title, PdfObject.TEXT_UNICODE));
		if (contents != null)
			annot.put(PdfName.CONTENTS, new PdfString(contents, PdfObject.TEXT_UNICODE));
		if (open)
			annot.put(PdfName.OPEN, PdfBoolean.PDFTRUE);
		if (icon != null) {
			annot.put(PdfName.NAME, new PdfName(icon));
		}
		return annot;
	}

	public static List<TextPosition> findPositions(String pdfFile, final String key) throws IOException {
		PDDocument document = PDDocument.load(pdfFile);
		final StringBuffer extractedText = new StringBuffer();
		final List<TextPosition> positions = new ArrayList<TextPosition>();
		PDFTextStripper textStripper = new PDFTextStripper() {
			@Override
			protected void processTextPosition(TextPosition text) {
				extractedText.append(text.getCharacter());
				if (extractedText.toString().endsWith(key)) {
					positions.add(text);
				}
			}
		};
		List lstPage = document.getDocumentCatalog().getAllPages();
		for (int pageNum = 0; pageNum < document.getDocumentCatalog().getAllPages().size(); pageNum++) {
			PDPage page = (PDPage) lstPage.get(pageNum);
			textStripper.processStream(page, page.findResources(), page.getContents().getStream());
			extractedText.setLength(0);
		}
		document.close();
		return Collections.unmodifiableList(positions);
	}
	
	public static TextPosition findPosition(String pdfFile, final String key) throws IOException {
		List<TextPosition> findPositions = findPositions(pdfFile, key);
		if(findPositions.size() > 0)
		{
			return findPositions.get(0);
		}
		return null;
	}
	
	public static void addNoteIntoFile(File file, String fileName)
			throws Exception {
		if (file != null) {
			PdfReader reader = null;
			PdfStamper stamper = null;
			String inputFile = file.getPath();
			String outputFile = inputFile + "_temp";
			try {
				// reader = new PdfReader(file.getAbsolutePath());
				reader = new PdfReader(inputFile);
				stamper = new PdfStamper(reader, new FileOutputStream(
						outputFile));
				int pageNum = reader.getNumberOfPages();
				float pageHeight = reader
						.getPageSize(reader.getNumberOfPages()).getHeight();
				PdfDictionary page;
				page = reader.getPageN(pageNum);
				if (page != null) {
					if (fileName.contains("KeHoachSanXuatVatTu")) {
						PdfContentByte under = stamper.getUnderContent(pageNum);
						Rectangle rect = null;
						TextPosition textPosition = findPosition(inputFile, "TRUNG  TÂM  HẠ  TẦNG");
						if(textPosition !=null)
						{
							rect = new Rectangle(textPosition.getX(), textPosition.getY(), textPosition.getX(), textPosition.getY());
							Rectangle nRect = new Rectangle(rect.getLeft() - 40, pageHeight - rect.getTop() - 65,
									rect.getLeft() - 58, pageHeight - rect.getTop() - 45);
							insertAnnotaion(stamper,under,nRect,"1");
						}
						
						TextPosition pDvpd = findPosition(inputFile, "PHÒNG  ĐẦU  TƯ");
						if(pDvpd !=null)
						{
							rect = new Rectangle(pDvpd.getX(), pDvpd.getY(), pDvpd.getX(), pDvpd.getY());
							Rectangle nRect = new Rectangle(rect.getLeft() - 43, pageHeight - rect.getTop() - 65,
									rect.getLeft() - 61, pageHeight - rect.getTop() - 45);
							insertAnnotaion(stamper,under,nRect,"2");
						}
						
						TextPosition txt = findPosition(inputFile, "PHÒNG  QUẢN  LÝ  TÀI  SẢN");
						if(txt !=null)
						{
							rect = new Rectangle(txt.getX(), txt.getY(), txt.getX(), txt.getY());
							Rectangle nRect = new Rectangle(rect.getLeft() - 43, pageHeight - rect.getTop() - 65,
									rect.getLeft() - 61, pageHeight - rect.getTop() - 45);
							insertAnnotaion(stamper,under,nRect,"3");
						}
						
						TextPosition text = findPosition(inputFile, "PHÓ TỔNG GIÁM ĐỐC");
						if(text !=null)
						{
							rect = new Rectangle(text.getX(), text.getY(), text.getX(), text.getY());
							Rectangle nRect = new Rectangle(rect.getLeft() - 43, pageHeight - rect.getTop() - 65,
									rect.getLeft() - 61, pageHeight - rect.getTop() - 45);
							insertAnnotaion(stamper,under,nRect,"4");
						}
					}
				}

			} finally {
				if (stamper != null) {
					stamper.close();
				}
				if (reader != null) {
					reader.close();
				}
				// rename backup file
				(new File(inputFile)).delete();
				File oldFile = new File(inputFile);
				new File(outputFile).renameTo(oldFile);
			}
		}
	}
	
	private static void insertAnnotaion(PdfStamper stamper,PdfContentByte under,Rectangle nRect,String note)
	{
		PdfAnnotation annotation = PdfAnnotation.createSquareCircle(
				stamper.getWriter(), nRect, note, false);
		annotation.setTitle("Note");
		annotation.setColor(BaseColor.YELLOW);
		annotation.setFlags(PdfAnnotation.FLAGS_PRINT);
		under.addAnnotation(annotation, true);
	}
	
	/*
	 * public static void converDoctoPDF(String inputFilePath, String
	 * outputFilePath, String printArea ) throws Exception{ View view = new View();
	 * try { view.setPrintArea(printArea); view.read(inputFilePath);
	 * view.setPrintGridLines(false); //show grid line view.setPrintLeftMargin(0);
	 * view.setPrintRightMargin(0); view.exportPDF(outputFilePath);
	 * view.setDefaultFontName("Times New Roman"); } catch (Exception e) {
	 * e.printStackTrace(); }
	 * 
	 * }
	 */
	
	  public static void addImagePdf(String src, String dest, String img) throws IOException, DocumentException {
	        PdfReader reader = new PdfReader(src);
	        PdfStamper stamper = new PdfStamper(reader, new FileOutputStream(dest));
	        Image image = Image.getInstance(img);
	        int pageNum = reader.getNumberOfPages();
	        PdfImage stream = new PdfImage(image, "", null);
	        stream.put(new PdfName("ITXT_SpecialId"), new PdfName("123456789"));
	        PdfIndirectObject ref = stamper.getWriter().addToBody(stream);
	        
	        TextPosition textPosition = findPosition(src, "Người nhận hàng");
	        image.setDirectReference(ref.getIndirectReference());
//	        image.scaleAbsolute(70f, 50f);
	        
	        image.setAbsolutePosition((textPosition.getX()- 68 ), (textPosition.getTextPos().getYPosition() - 90));
	        PdfContentByte over = stamper.getOverContent(pageNum);
	        over.addImage(image);
	        stamper.close();
	        reader.close();
	    }

	  
	  
//	  public static void addNoteIntoFileVersion2(File file, String fileName)
//				throws Exception {
//			// TODO Auto-generated method stub
//			if (file != null) {
//				PdfReader reader = null;
//				PdfStamper stamper = null;
//				String inputFile = file.getPath();
//				String outputFile = inputFile + "_temp";
//				try {
//					// reader = new PdfReader(file.getAbsolutePath());
//					reader = new PdfReader(inputFile);
//					stamper = new PdfStamper(reader, new FileOutputStream(
//							outputFile));
//					int pageNum = reader.getNumberOfPages();
//					float pageHeight = reader
//							.getPageSize(reader.getNumberOfPages()).getHeight();
//					PdfDictionary page;
//					page = reader.getPageN(pageNum);
//					if (page != null) {
//						java.util.Map<Integer, String> listSigner =  Constants.DOCUMENT_SIGNING_LIST.get(fileName);
////						java 8 lamda
////						listSigner.entrySet().stream().forEach(item ->{
////							
////						});
//						
//						for (Entry<Integer, String> signer : ((java.util.Map<Integer, String>) listSigner).entrySet()) {
//						    System.out.println(signer.getKey() + " = " + signer.getValue());
//						    PdfContentByte under = stamper.getUnderContent(pageNum);
//							Rectangle rect = null;
//							TextPosition textPosition = findPosition(inputFile, signer.getValue());
//							if(textPosition !=null)
//							{
//								rect = new Rectangle(textPosition.getX(), textPosition.getY(), textPosition.getX(), textPosition.getY());
//								Rectangle nRect = new Rectangle(rect.getLeft() - 40, pageHeight - rect.getTop() - 65,
//										rect.getLeft() - 58, pageHeight - rect.getTop() - 45);
//								insertAnnotaion(stamper,under,nRect, signer.getKey().toString());
//							}
//						}
//					}
//
//				} finally {
//					if (stamper != null) {
//						stamper.close();
//					}
//					if (reader != null) {
//						reader.close();
//					}
//					// rename backup file
//					(new File(inputFile)).delete();
//					File oldFile = new File(inputFile);
//					new File(outputFile).renameTo(oldFile);
//				}
//			}
//		}

}
