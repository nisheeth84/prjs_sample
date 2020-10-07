class MsgConst:
    ERR_101 = {
        'code': 101,
        'message': '権限エラー',
        'description': 'この操作を実行するために必要な権限がありません。'
    }
    ERR_201 = {
        'code': 201,
        'message': 'バリデーションエラー',
        'description': '（バリデーションエラー詳細は後述）'
    }
    ERR_301 = {
        'code': 301,
        'message': 'リソースエラー',
        'description': '対象のリソースが見つかりません。'
    }
    ERR_302 = {
        'code': 302,
        'message': 'リソースエラー',
        'description': '対象のリソースは既に存在します。'
    }
    ERR_402 = {
        'code': 402,
        'message': 'データベースエラー',
        'description': 'レコード取得に失敗しました。'
    }
    ERR_999 = {
        'code': 999,
        'message': '内部エラー',
        'description': '予期しないエラーが発生しました。'
    }

    ERR_DB_403 = {
        'code': 403,
        'message': 'データベースエラー',
        'description': 'レコード作成に失敗しました。'
    }

    ERR_DB_404 = {
        'code': 404,
        'message': 'データベースエラー',
        'description': 'レコード更新に失敗しました。'
    }

    ERR_DB_405 = {
        'code': 405,
        'message': 'データベースエラー',
        'description': 'レコード削除に失敗しました。'
    }

    ERR_REQUEST_201 = {'code': 201, 'message': 'バリデーションエラー', 'description': ''}
    ERR_REQUEST_202 = {
        'code': 202,
        'message': 'リクエストボディエラー',
        'description': 'リクエストボディのパースに失敗しました。'
    }
    ERR_REQUEST_203 = {
        'code': 203,
        'message': '前提条件エラー',
        'description': 'リクエストを実行する前提条件を満たしていません。'
    }

    ERR_VAL_101 = {'code': 101, 'message': '必須項目です。'}
    ERR_VAL_201 = {'code': 201, 'message': '値は整数である必要があります。'}
    ERR_VAL_202 = {'code': 202, 'message': '値は文字列である必要があります。'}
    ERR_VAL_204 = {'code': 204, 'message': '値の形式は配列である必要があります。'}
    ERR_VAL_302 = {'code': 302, 'message': '値は{0}のいずれかである必要があります。'}
    ERR_VAL_303 = {'code': 303, 'message': '値は{0}文字以内で入力する必要があります。'}
    ERR_VAL_999 = {'code': 999, 'message': '不正なパラメータ値です。'}

    ERR_AWS_401 = {
        'code': 401,
        'message': 'リソース同士の関係が不正です。',
        'description': 'リソースの階層関係が正しいことを確認する。'
    }
    ERR_AWS_601 = {
        'code': 601,
        'message': '内部エラー',
        'description': 'AWS Batchのジョブキューへジョブをサブミットできませんでした。'
    }
    ERR_COGNITO_501 = {
        'code': 501,
        'message': '内部エラー',
        'description': 'Cognitoからユーザー情報を取得できませんでした。'
    }
    ERR_S3_701 = {
        'code': 701,
        'message': '内部エラー',
        'description': 'S3へのオブジェクトputに失敗しました。'
    }
    ERR_S3_702 = {
        'code': 702,
        'message': '内部エラー',
        'description': 'S3からのオブジェクトgetに失敗しました。'
    }
    ERR_S3_709 = {
        'code': 709,
        'message': '内部エラー',
        'description': 'S3へのアクセスに失敗しました。'
    }
    ERR_SES_801 = {
        'code': 801,
        'message': '内部エラー',
        'description': 'Amazon SESからメール送信に失敗しました。'
    }
