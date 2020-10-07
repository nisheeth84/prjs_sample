package jp.classmethod.premembers.report.job.common;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PremembersCommonBeforeLogicTest {
    @Value("${premembers.env}")
    private String env;

    @Autowired
    private PremembersCommonBeforeLogic commonBeforeLogic;

    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
    }

    @AfterClass
    public static void tearDownAfterClass() throws Exception {
    }

    @Before
    public void setUp() throws Exception {
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void testGetLogStreamName() {
        if ("NO_AWS".equals(env)) {
            System.out.println("AWS使えません。");
        } else {
            String jobId = "8c684775-754e-4752-8f53-1e99c616764b";
            String logStreamName = "tago-batch/default/954a8c51-396c-4408-8a48-aa15d20ab6eb";
            assertEquals(logStreamName, commonBeforeLogic.getLogStreamName(jobId));
        }
    }

}
