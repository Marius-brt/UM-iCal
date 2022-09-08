import { MantineProvider } from '@mantine/core';
import { Center, Code } from '@mantine/core';
import '../styles/style.css'
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return       <MantineProvider
  withGlobalStyles
  withNormalizeCSS
  theme={{
	colorScheme: 'dark',
  }}
>
	<Head>
		<title>UM iCal</title>
		<meta name="description" content="L'emploie du temps à l'UM en mode ez" />
		<link rel="icon" href="/favicon.ico" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
		<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"></meta>
		<link href="/manifest.json" rel="manifest"></link>
		
		<meta name="theme-color" content="#1A1B1E"/>
		<meta name="mobile-web-app-capable" content="yes"/>
		<link href="icon.png" rel="icon" sizes="256x256"></link>

		<meta name="apple-mobile-web-app-title" content="UM iCal"/>
		<meta name="apple-mobile-web-app-capable" content="yes"/>
		<meta name="apple-mobile-web-app-status-bar-style" content="default"/>
		<link href="icon.png" rel="apple-touch-icon"></link>
	</Head>
	
	<main>
  		<Component {...pageProps} />
		<Center>
			<Code className="footer">
				Créer par{" "}
				<a
				href="https://github.com/Marius-brt"
				target="_blank"
				rel="noreferrer"
				style={{ color: "#C1C2C5" }}
				>
				@marius.brt
				</a>{" "}
				•{" "}
				<a
				href="https://github.com/Marius-brt/UM-iCal"
				target="_blank"
				rel="noreferrer"
				style={{ color: "#C1C2C5" }}
				>
				Github
				</a>{" "}
				du site
			</Code>
		</Center>
  	</main>
</MantineProvider>
}

export default MyApp
