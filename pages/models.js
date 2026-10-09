import DiscoveryPage from '../components/DiscoveryPage';
import { buildDiscoveryProps } from '../lib/discovery-data';

export default DiscoveryPage;

export async function getStaticProps() {
  return buildDiscoveryProps('model');
}
