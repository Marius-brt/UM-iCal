import { Component, ReactNode } from "react";
import { Title, Accordion, Code, Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons";
import Link from "next/link";

class FAQ extends Component {
  render(): ReactNode {
    return (
      <>
        <Title
          align="center"
          style={{ marginBottom: "30px", fontSize: "22px" }}
        >
          Foire Aux Questions
        </Title>
        <div className="creator2">
          <p>
            Créer par{" "}
            <Link href="https://www.instagram.com/marius.brt/" target="_blank">
              <a>@marius.brt</a>
            </Link>
            {" • "}
            <Link
              href="https://github.com/Marius-brt/UM-iCal/issues"
              target="_blank"
            >
              <a>Github</a>
            </Link>{" "}
            de UM iCal.
          </p>
          <Button
            style={{ display: "block", width: "100%" }}
            onClick={() => {
              window.open("https://www.buymeacoffee.com/mariusbrt", "_blank");
            }}
          >
            🍺 Buy me a beer
          </Button>
        </div>
        <Accordion
          variant="separated"
          className="faq"
          style={{ paddingBottom: "50px" }}
        >
          <Accordion.Item value="find-link">
            <Accordion.Control>Où trouver mon lien ical ?</Accordion.Control>
            <Accordion.Panel>
              Le lien iCal permet de récupérer ton fichier <Code>.ics</Code>{" "}
              (fichier calendrier). Tu peux trouver le lien en allant sur l{"'"}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://ent.umontpellier.fr/"
              >
                ENT
              </a>{" "}
              puis va sur <Code>Planning [année]</Code>. Cliques sur{" "}
              <Code>
                iCal <IconDownload size={11} />
              </Code>{" "}
              puis copie le lien dans l{"'"}encadré. Colles ensuite ce lien dans
              les{" "}
              <Link href="/settings">
                <a>paramètres</a>
              </Link>
              .
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="change-link">
            <Accordion.Control>
              Si je change mes groupes sélectionnés ?
            </Accordion.Control>
            <Accordion.Panel>
              Si tu changes les groupes sélectionnés sur l{"'"}ENT, récupère ton
              nouveau lien comme écris au dessus, puis changes le dans les{" "}
              <Link href="/settings">
                <a>paramètres</a>
              </Link>
              .
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="librairies">
            <Accordion.Control>Librairies utilisées</Accordion.Control>
            <Accordion.Panel>
              UM iCal est basé sur le framework NextJs. UM iCal est hébergé sur
              Vercel. Les librairies utilisées sont :
              <ul style={{ paddingLeft: "15px" }}>
                <li>Mongoose avec MongoDB</li>
                <li>Mantine</li>
                <li>Tabler icon</li>
                <li>Node iCal</li>
              </ul>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="bde">
            <Accordion.Control>Je fait partie d'un BDE</Accordion.Control>
            <Accordion.Panel>À venir</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="bug-feature">
            <Accordion.Control>
              J'ai trouver un Bug ou j'ai une idée
            </Accordion.Control>
            <Accordion.Panel>
              Si tu as trouver un Bug ou bien que tu as une idée de
              fonctionnalité à ajouter à UM iCal, tu peux faire une issue sur le{" "}
              <Link
                href="https://github.com/Marius-brt/UM-iCal/issues"
                target="_blank"
              >
                <a>Github</a>
              </Link>{" "}
              si tu sais faire, sinon tu peux m'envoyer un DM sur{" "}
              <Link
                href="https://www.instagram.com/marius.brt/"
                target="_blank"
              >
                <a>Instagram</a>
              </Link>
              .
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="help">
            <Accordion.Control>J'ai une autre question</Accordion.Control>
            <Accordion.Panel>
              Si tu as une autre question ou bien un problème avec UM iCal, tu
              peux m'envoyer un DM sur{" "}
              <Link
                href="https://www.instagram.com/marius.brt/"
                target="_blank"
              >
                <a>Instagram</a>
              </Link>
              .
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </>
    );
  }
}

export default FAQ;
