// 英文首页：与中文首页同一个组件，数据换成英文版。
import HomePage from '../../components/HomePage';
import { buildHomeProps } from '../../lib/home-data';

export default HomePage;

export async function getStaticProps() {
  return buildHomeProps('en');
}
