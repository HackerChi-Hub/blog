// pages/_app.js
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="app-shell">
      <div className="app-inner">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
