// 英文分页列表：与中文同一个组件，每篇换成英文版。
import PostListPage from '../../../components/PostListPage';
import { getListPaths, buildListProps } from '../../../lib/list-data';

export default PostListPage;

export async function getStaticPaths() {
  return getListPaths();
}

export async function getStaticProps({ params }) {
  return buildListProps('en', params);
}
