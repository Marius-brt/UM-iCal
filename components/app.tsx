import { Component } from "react";
import Nav from "./navbar";

import {
  MantineProvider,
  TextInput,
  Button,
  Code,
  LoadingOverlay,
  Loader,
} from "@mantine/core";
import Head from "next/head";
import { isDesktop, isIOS } from "react-device-detect";
import { isValidHttpUrl } from "../utils/others";

export default class App extends Component<any, any> {
  constructor(props: {}) {
    super(props);
    this.state = {
      mounted: false,
      open: false,
      installed: false,
      promptInstall: null,
      supportsPWA: false,
      urlInput: "",
      error: "",
      loadingLogin: false,
    };
  }

  componentDidMount(): void {
    if (!this.state.mounted) {
      this.setState({
        mounted: true,
        installed:
          window.matchMedia("(display-mode: standalone)").matches || isDesktop,
        ios: isIOS,
      });
    }
  }

  toggleMenu = (e: any) => {
    this.setState({ open: false });
  };

  render() {
    return (
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: "dark" }}
      >
        <Head>
          <title>UM iCal</title>
          <meta
            name="description"
            content="L'emploie du temps à l'UM en mode ez"
          />
          <link rel="icon" href="/favicon.ico" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
          ></meta>
          <link href="/manifest.json" rel="manifest"></link>

          <meta name="theme-color" content="#1A1B1E" />
          <meta name="mobile-web-app-capable" content="yes" />
          <link href="icon.png" rel="icon" sizes="256x256"></link>

          <meta name="apple-mobile-web-app-title" content="UM iCal" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <link href="icon.png" rel="apple-touch-icon"></link>
        </Head>
        {!this.props.urlIsValid && this.state.installed ? (
          <div className="login">
            <div className="logo">
              <img src="icon.png" />
              <h2>UM iCal</h2>
            </div>
            <div className="inputs">
              <TextInput
                required
                placeholder="Lien iCal"
                value={this.state.urlInput}
                onChange={(e) => {
                  this.setState({ urlInput: e.target.value });
                }}
                label="Lien de ton calendrier"
              />
              <LoadingOverlay
                visible={this.state.loadingLogin}
                overlayBlur={2}
                loader={<Loader color="#f35c65" />}
              />
            </div>
            <Button
              disabled={this.state.loadingLogin}
              onClick={() => {
                if (
                  this.state.urlInput == "" ||
                  !isValidHttpUrl(this.state.urlInput)
                ) {
                  this.setState({ error: "Lien invalide" });
                } else {
                  localStorage.setItem("ics-url", this.state.urlInput);
                  this.setState({
                    error: "",
                    urlInput: "",
                    loadingLogin: true,
                  });
                  this.props.refresh();
                }
              }}
            >
              3, 2, 1... Partez ! 🔥
            </Button>
            <p className="error">{this.state.error}</p>
            <div className="creator">
              <Code>
                Créer par{" "}
                <a
                  href="https://www.instagram.com/marius.brt/"
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
                de UM iCal
              </Code>
            </div>
          </div>
        ) : this.state.installed ? (
          <div className="appShell">
            {this.props.children}
            <Nav />
          </div>
        ) : (
          <main className="install">
            <img src="icon.png" className="logo" />
            <h2>Bienvenue sur UM iCal</h2>
            <p>
              Avant de commencer, il faut que tu installes UM iCal sur ton tel.
              Pour ça, clique sur{" "}
              {this.state.ios ? (
                <>
                  <img src="share.png" className="ios" /> en bas, puis sur le
                  bouton{" "}
                  <Code style={{ whiteSpace: "nowrap" }}>
                    Sur l'écran d'accueil
                  </Code>
                  .
                </>
              ) : (
                <>
                  les trois points en haut à droite puis sur le bouton{" "}
                  <Code style={{ whiteSpace: "nowrap" }}>
                    Ajouter à l'écran d'accueil
                  </Code>
                  .
                </>
              )}
              <br />
              Tu peux désormais lancer UM iCal sur ton écran d'accueil.
            </p>
          </main>
        )}
      </MantineProvider>
    );
  }
}
