// 中文分页列表。组件在 components/PostListPage.js，数据在 lib/list-data.js（只在构建时运行）。
import PostListPage from '../../components/PostListPage';
import { getListPaths, buildListProps } from '../../lib/list-data';

export default PostListPage;

export async function getStaticPaths() {
  return getListPaths();
}

export async function getStaticProps({ params }) {
  return buildListProps('zh-CN', params);
}
