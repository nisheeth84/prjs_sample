import sys
import inspect

from premembers.check.logic import awsResourceAggregate_logic
from premembers.check.logic import awsResourceChecker_logic
from premembers.exception.pm_exceptions import PmError
from premembers.const.const import CommonConst
from premembers.common import common_utils
from premembers.repository.const import CheckStatus


def main(argv):
    # コマンドラインパラメータ
    try:
        check_history_id = argv[1]
        log_id = CommonConst.BLANK
        language = CommonConst.LANGUAGE_DEFAULT
        if(len(argv) > 2):
            log_id = argv[2]
        if(len(argv) > 3 and argv[3] in CommonConst.LANGUAGE_SUPPORT):
            language = argv[3]
    except Exception as e:
        pm_logger = common_utils.begin_logger(None, __name__,
                                              inspect.currentframe())
        common_utils.write_log_exception(e, pm_logger, True)
        sys.exit(CommonConst.EXIT_CODE_ERROR)

    # バッチ処理開始
    pm_logger = common_utils.begin_logger(check_history_id, __name__,
                                          inspect.currentframe())
    error_code = None
    pm_logger.info("** バッチアプリケーション起動 ***************")
    pm_logger.info("== バッチアプリケーション処理開始 ================")
    pm_logger.info("チェック履歴ID: " + check_history_id)
    pm_logger.info("ログID: " + log_id)
    pm_logger.info("==================================================")
    try:
        awsResourceAggregate_logic.aws_resource_aggregate(
            check_history_id, log_id)
    except PmError as e:
        common_utils.write_log_pm_error(e, pm_logger, exc_info=True)
        error_code = e.message
    except Exception as e:
        common_utils.write_log_exception(e, pm_logger, True)
        error_code = 'CKEX_SECURITY-999'

    # チェック処理結果を記録
    exit_code = CommonConst.EXIT_CODE_SUCCESS
    try:
        check_status = CheckStatus.CheckCompleted
        if (error_code is None):
            check_status = CheckStatus.SummaryCompleted
        awsResourceChecker_logic.processing_finish(check_history_id,
                                                   error_code, check_status)
        if (error_code is not None):
            exit_code = CommonConst.EXIT_CODE_ERROR

        # チェック結果通知処理
        awsResourceAggregate_logic.check_result_notification(
            check_history_id, language)
    except PmError as e:
        common_utils.write_log_pm_error(e, pm_logger, exc_info=True)
        exit_code = CommonConst.EXIT_CODE_ERROR
    except Exception as e:
        common_utils.write_log_exception(e, pm_logger, True)
        exit_code = CommonConst.EXIT_CODE_ERROR
    pm_logger.info("-- 最新チェック結果作成終了 ----")
    sys.exit(exit_code)


if __name__ == "__main__":
    main(sys.argv)
