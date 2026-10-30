import GuidesPage from '../../components/GuidesPage';
import { buildCommunityProps } from '../../lib/community-data';
export default GuidesPage;
export async function getStaticProps() { return buildCommunityProps('en'); }
