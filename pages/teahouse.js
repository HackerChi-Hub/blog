import TeahousePage from '../components/TeahousePage';
import { buildCommunityProps } from '../lib/community-data';
export default TeahousePage;
export async function getStaticProps() { return buildCommunityProps(); }
