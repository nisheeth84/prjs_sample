import unittest
import handler


class test_handler(unittest.TestCase):
    def test_ブランチ名のみを取得(self):
        full_branch_name = 'refs/heads/feature/github-commit-4'
        correnct_output_branch_name = 'github-commit-4'
        output_branch_name = handler.get_only_branch_name(full_branch_name)
        self.assertEqual(correnct_output_branch_name, output_branch_name)

    def test_スタック一覧を取得(self):
        list = handler.check_stack()
        self.assertEqual(len(list), 3)