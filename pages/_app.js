import { MantineProvider } from '@mantine/core';
import '../styles/style.css'

function MyApp({ Component, pageProps }) {
  return       <MantineProvider
  withGlobalStyles
  withNormalizeCSS
  theme={{
	colorScheme: 'dark',
  }}
>
  <Component {...pageProps} />
</MantineProvider>
}

export default MyApp
