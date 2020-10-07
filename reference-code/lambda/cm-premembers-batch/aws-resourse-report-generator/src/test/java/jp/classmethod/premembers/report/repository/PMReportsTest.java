package jp.classmethod.premembers.report.repository;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.amazonaws.services.dynamodbv2.model.ConditionalCheckFailedException;

import jp.classmethod.premembers.report.repository.entity.PMReportsItem;
import jp.classmethod.premembers.report.repository.entity.PMReportsProjectIndexItem;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PMReportsTest {
    @Autowired
    private PMReports pmReports;

    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
    }

    @AfterClass
    public static void tearDownAfterClass() throws Exception {
    }

    @Before
    public void setUp() throws Exception {
        createTestData();
        pmReports.create(itemA);
    }

    @After
    public void tearDown() throws Exception {
        pmReports.deleteItem(itemA.getReportId());
        pmReports.deleteItem(itemB.getReportId());
        pmReports.deleteItem(itemC.getReportId());
    }

    @Test
    public void testGetItem() {
        PMReportsItem item = pmReports.read(itemA.getReportId());
        assertItem(itemA, item);
    }

    @Test
    public void testGetItemNoItem() {
        PMReportsItem item = pmReports.read(itemB.getReportId());
        assertNull(item);
    }

    @Test
    public void testDeleteItem() {
        int count = pmReports.getCountAll();

        pmReports.create(itemB);
        count++;
        assertTrue(count == pmReports.getCountAll());

        pmReports.deleteItem(itemB.getReportId());
        count--;
        assertTrue(count == pmReports.getCountAll());
    }

    @Test
    public void testGetCountAll() {
        // assertTrue(1 == pmReports.getCountAll());
    }

    @Test
    public void testUpdateItem() {
        String originUpdatedAt = itemA.getUpdatedAt();
        itemA.setGenerateUser(null);
        itemA.setErrorCode("ERR001");
        pmReports.update(itemA, originUpdatedAt);

        PMReportsItem item = pmReports.read(itemA.getReportId());
        assertItem(itemA, item);
    }

    @Test
    public void testUpdateItemFail() {
        String originUpdatedAt = itemA.getUpdatedAt();
        itemA.setErrorCode("ERR001");
        pmReports.update(itemA, originUpdatedAt);

        try {
            itemA.setErrorCode("ERR002");
            pmReports.update(itemA, originUpdatedAt);
            fail();
        } catch (ConditionalCheckFailedException ce) {
            System.out.println("正しくエラーが発生した");
            ce.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        }
    }

    @Test
    public void testQueryProjectIndex() {
        pmReports.create(itemB);
        pmReports.create(itemC);

        List<PMReportsProjectIndexItem> items = pmReports.queryProjectIndex("prj");
        String[] idArray = { itemA.getReportId(), itemB.getReportId(), itemC.getReportId() };
        assertTrue(idArray.length == items.size());
        for (int i = 0; i < items.size(); i++) {
            assertEquals(idArray[i], items.get(i).getReportId());
        }

        itemB.setProjectId("prj2");
        pmReports.update(itemB, itemB.getUpdatedAt());

        items = pmReports.queryProjectIndex("prj");
        String[] idArray2 = { itemA.getReportId(), itemC.getReportId() };
        assertTrue(idArray2.length == items.size());
        for (int i = 0; i < items.size(); i++) {
            assertEquals(idArray2[i], items.get(i).getReportId());
        }
    }

    private void assertItem(PMReportsItem expected, PMReportsItem actual) {
        assertEquals(expected.getReportId(), actual.getReportId());
        assertEquals(expected.getReportName(), actual.getReportName());
        assertEquals(expected.getGenerateUser(), actual.getGenerateUser());
        assertTrue(equalsList(expected.getAwsAccounts(), actual.getAwsAccounts()));
        assertTrue(expected.getReportStatus() == actual.getReportStatus());
        assertEquals(expected.getErrorCode(), actual.getErrorCode());
        assertEquals(expected.getJsonOutputTime(), actual.getJsonOutputTime());
        assertEquals(expected.getHtmlOutputStatus(), actual.getHtmlOutputStatus());
        assertEquals(expected.getHtmlOutputTime(), actual.getHtmlOutputTime());
        assertEquals(expected.getHtmlPath(), actual.getHtmlPath());
        assertEquals(expected.getExcelOutputStatus(), actual.getExcelOutputStatus());
        assertEquals(expected.getExcelOutputTime(), actual.getExcelOutputTime());
        assertEquals(expected.getExcelPath(), actual.getExcelPath());
        assertTrue(expected.getSchemaVersion() == actual.getSchemaVersion());
        assertEquals(expected.getOrganizationId(), actual.getOrganizationId());
        assertEquals(expected.getProjectId(), actual.getProjectId());
        assertEquals(expected.getCreatedAt(), actual.getCreatedAt());
        assertEquals(expected.getUpdatedAt(), actual.getUpdatedAt());

    }

    private boolean equalsList(List<String> expected, List<String> actual) {
        if (expected == null && actual == null) {
            return true;
        } else if ((expected != null && actual == null) || (expected == null && actual != null)) {
            return false;
        }
        if (expected.size() != actual.size()) {
            return false;
        }
        try {
            return expected.containsAll(actual);
        } catch (Exception e) {
            return false;
        }
    }

    private PMReportsItem itemA;
    private PMReportsItem itemB;
    private PMReportsItem itemC;

    private void createTestData() {
        itemA = new PMReportsItem();
        itemA.setReportId("AAA");
        itemA.setReportName("AAA report");
        itemA.setGenerateUser("tago.masayuki@classmethod.jp");
        ArrayList<String> awsAccountsA = new ArrayList<String>();
        awsAccountsA.add("000");
        awsAccountsA.add("111");
        itemA.setAwsAccounts(awsAccountsA);
        itemA.setReportStatus(0);
        itemA.setErrorCode(null);
        itemA.setJsonOutputTime(null);
        itemA.setHtmlOutputStatus(0);
        itemA.setHtmlOutputTime("HTMLTime");
        itemA.setHtmlPath("HTMLPath");
        itemA.setExcelOutputStatus(0);
        itemA.setExcelOutputTime("ExcelTime");
        itemA.setExcelPath("ExcelPath");
        itemA.setSchemaVersion(1.0);
        itemA.setOrganizationId("org");
        itemA.setProjectId("prj");
        itemA.setCreatedAt("2017-09-26 06:38:04.128");
        itemA.setUpdatedAt("2017-09-26 06:38:04.128");

        itemB = new PMReportsItem();
        itemB.setReportId("BBB");
        itemB.setReportName("BBB report");
        itemB.setGenerateUser("tago.masayuki@classmethod.jp");
        ArrayList<String> awsAccountsB = new ArrayList<String>();
        awsAccountsB.add("222");
        itemB.setAwsAccounts(awsAccountsB);
        itemB.setReportStatus(2);
        itemB.setErrorCode("ERR");
        itemB.setJsonOutputTime(null);
        itemB.setHtmlOutputStatus(0);
        itemB.setHtmlOutputTime(null);
        itemB.setHtmlPath(null);
        itemB.setExcelOutputStatus(0);
        itemB.setExcelOutputTime(null);
        itemB.setExcelPath(null);
        itemB.setSchemaVersion(1.0);
        itemB.setOrganizationId("org");
        itemB.setProjectId("prj");
        itemB.setCreatedAt("2017-09-26 07:38:04.128");
        itemB.setUpdatedAt("2017-09-26 08:38:04.128");

        itemC = new PMReportsItem();
        itemC.setReportId("CCC");
        itemC.setReportName("CCC report");
        itemC.setGenerateUser("tago.masayuki@classmethod.jp");
        ArrayList<String> awsAccountsC = new ArrayList<String>();
        awsAccountsC.add("333");
        awsAccountsC.add("444");
        awsAccountsC.add("555");
        itemC.setAwsAccounts(awsAccountsC);
        itemC.setReportStatus(4);
        itemC.setErrorCode(null);
        itemC.setJsonOutputTime("2017-09-26 09:38:04.128");
        itemC.setHtmlOutputStatus(0);
        itemC.setHtmlOutputTime(null);
        itemC.setHtmlPath(null);
        itemC.setExcelOutputStatus(2);
        itemC.setExcelOutputTime("2017-09-26 10:38:04.128");
        itemC.setExcelPath("testpath/test.xlsx");
        itemC.setSchemaVersion(1.0);
        itemC.setOrganizationId("org");
        itemC.setProjectId("prj");
        itemC.setCreatedAt("2017-09-26 08:38:04.128");
        itemC.setUpdatedAt("2017-09-26 10:38:04.128");
    }

}
