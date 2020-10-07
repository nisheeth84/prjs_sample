import sys
import inspect

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
        if(len(argv) > 2):
            log_id = argv[2]
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
        awsResourceChecker_logic.aws_resource_checker(check_history_id, log_id)
    except PmError as e:
        error_code = e.message
        if error_code != "CKEX_SECURITY-900":
            common_utils.write_log_pm_error(e, pm_logger, exc_info=True)
    except Exception as e:
        common_utils.write_log_exception(e, pm_logger, True)
        error_code = 'CKEX_SECURITY-999'
    # チェック処理結果を記録
    exit_code = CommonConst.EXIT_CODE_SUCCESS
    try:
        check_status = CheckStatus.Waiting
        if (error_code is None):
            check_status = CheckStatus.CheckCompleted
        awsResourceChecker_logic.processing_finish(check_history_id,
                                                   error_code, check_status)
        if (error_code is not None):
            exit_code = CommonConst.EXIT_CODE_ERROR
    except PmError as e:
        common_utils.write_log_pm_error(e, pm_logger, exc_info=True)
        exit_code = CommonConst.EXIT_CODE_ERROR
    except Exception as e:
        common_utils.write_log_exception(e, pm_logger, True)
        exit_code = CommonConst.EXIT_CODE_ERROR
    pm_logger.info("** バッチアプリケーション終了 ***************")
    sys.exit(exit_code)


if __name__ == "__main__":
    main(sys.argv)
