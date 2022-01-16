import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import awsExports from "../aws-exports";
import theme from "../utils/theme";
import createEmotionCache from "../utils/createEmotionCache";
import { MUISwitch } from "../components/MUISwitch";
import { useEffect, useState } from "react";
import { createTheme } from "@mui/material/styles";
import Amplify from "aws-amplify";

Amplify.configure({ ...awsExports, ssr: true });

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

type PaletteMode = "dark" | "light";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#031625",
    },
  },
});

export default function MyApp(props: MyAppProps) {
  const [paletteMode, setPaletteMode] = useState<PaletteMode>("light");

  useEffect(() => {
    if (localStorage.getItem("paletteMode")) {
      setPaletteMode(localStorage.getItem("paletteMode") as "dark" | "light");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("paletteMode", paletteMode);
  }, [paletteMode]);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={paletteMode === "dark" ? darkTheme : theme}>
        <CssBaseline />
        <Component {...pageProps} />
        <MUISwitch
          checked={paletteMode === "light" ? false : true}
          onChange={() =>
            setPaletteMode(paletteMode === "light" ? "dark" : "light")
          }
        />
      </ThemeProvider>
    </CacheProvider>
  );
}
