import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "../components/themeContext";
import FirebaseProvider, { useFirebase } from "../context/firebase";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <RecoilRoot>
        <FirebaseProvider>
          <Component {...pageProps} />
        </FirebaseProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default MyApp;
