import { Component, ReactNode } from "react";
import { Button, Select, TextInput, Title } from "@mantine/core";
import { Modal } from "@mantine/core";
import { isValidHttpUrl } from "../utils/others";

class Settings extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      text: "",
      error: "",
      open: false,
      openLink: false,
      linkValue: "",
      loading: false,
    };
  }

  setLink() {
    const link = localStorage.getItem("ics-url");
    if (link != null && isValidHttpUrl(link))
      this.setState({ linkValue: link });
  }

  componentDidMount(): void {
    this.setLink();
  }

  render(): ReactNode {
    return (
      <>
        <Title style={{ marginBottom: "20px" }}>Paramètres</Title>
        <Select
          label="Style bar progression"
          placeholder="Choisir"
          defaultValue={this.props.settings.barStyle}
          data={[
            { value: "default", label: "Par défaut" },
            { value: "lucky", label: "Lucky Luke" },
            { value: "goku", label: "Goku" },
            { value: "lightsaber", label: "Sabre Laser" },
            { value: "amongus", label: "Among Us" },
          ]}
          onChange={(e) => {
            let settings = this.props.settings;
            settings.barStyle = e;
            this.props.updateSettings(settings);
          }}
        />
        <Button
          style={{ width: "100%", marginTop: "25px" }}
          onClick={() => {
            this.setLink();
            this.setState({ openLink: true });
          }}
        >
          📝 Modifier mon lien iCal
        </Button>
        <Button
          style={{ width: "100%", marginTop: "10px" }}
          color="red"
          onClick={() => this.setState({ open: true })}
        >
          Se déconnecter
        </Button>
        <Modal
          opened={this.state.openLink}
          onClose={() => {}}
          withCloseButton={false}
          title="Modifier lien iCal"
          centered
        >
          <TextInput
            value={this.state.linkValue}
            onFocus={(event) => event.target.select()}
            onChange={(e) => this.setState({ linkValue: e.target.value })}
          />
          <p className="error">{this.state.error}</p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Button
              onClick={() => this.setState({ openLink: false })}
              disabled={this.state.loading}
              color="gray"
              style={{ width: "50%" }}
            >
              Annuler
            </Button>
            <Button
              style={{ width: "50%" }}
              disabled={
                !isValidHttpUrl(this.state.linkValue) || this.state.loading
              }
              onClick={async () => {
                const oldLink = localStorage.getItem("ics-url");
                if (oldLink == this.state.linkValue) {
                  this.setState({ openLink: false });
                  return;
                }
                this.setState({ loading: true });
                localStorage.setItem("ics-url", this.state.linkValue);
                if (await this.props.refresh(true))
                  this.setState({ openLink: false, loading: false, error: "" });
                else {
                  localStorage.setItem("ics-url", oldLink || "");
                  this.setState({ loading: false, error: "Lien invalide" });
                }
              }}
            >
              Modifier
            </Button>
          </div>
        </Modal>
        <Modal
          opened={this.state.open}
          onClose={() => this.setState({ open: false })}
          title="⚠️ Déconnexion"
          centered
        >
          <p>
            UM iCal conserve toutes tes données sur ton tel, si tu te
            déconnecte, elles seront supprimer. Tu perdras donc les événements
            dans ton calendrier et tes paramètres. T'es sur de vouloir le faire
            ?
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button color="gray" onClick={() => this.setState({ open: false })}>
              Je reste connecté
            </Button>
            <Button color="red" onClick={() => this.props.deleteDatas()}>
              Je suis sur
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

export default Settings;
