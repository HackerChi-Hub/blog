// 中文首页。组件在 components/HomePage.js，数据在 lib/home-data.js（只在构建时运行）。
import HomePage from '../components/HomePage';
import { buildHomeProps } from '../lib/home-data';

export default HomePage;

export async function getStaticProps() {
  return buildHomeProps('zh-CN');
}
