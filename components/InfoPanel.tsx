import { Badge, Button, Center, Title } from "@mantine/core";
import { BdeInfoPanelInterface } from "../utils/interfaces";
import { formatDateLetters } from "../utils/dates";
import React, { FC, useEffect, useState } from "react";

const isValidUrl = (urlString: string): boolean => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!urlPattern.test(urlString);
};

const InfoPanel: FC<BdeInfoPanelInterface> = ({
  id,
  title,
  start,
  description,
  price,
  registration,
  bde,
  onClose,
  addToCalendar,
  removeFromCalendar,
}) => {
  const [added, setAdded] = useState(false);
  useEffect(() => {
    try {
      const e = localStorage.getItem("ics-calendar");
      if (e == null) {
        setAdded(false);
        return;
      }
      const eJ = JSON.parse(e);
      setAdded(eJ.find((el: any) => el.id == id) != null);
    } catch (e) {
      setAdded(false);
    }
  }, [id]);
  return (
    <div className="infoPanel">
      <Title className="title">{title}</Title>
      <div className="badges">
        <Badge color="red">{formatDateLetters(new Date(start))}</Badge>
        <Badge color="green">{bde}</Badge>
      </div>
      <Badge>{price}</Badge>
      <p className="registration">
        <strong>Inscription:</strong>{" "}
        {registration == "" ? (
          "Pas d'inscription nécessaire"
        ) : isValidUrl(registration) ? (
          <a target="_blank" rel="noreferrer" href={registration}>
            {registration}
          </a>
        ) : (
          registration
        )}
      </p>
      <p className="description">{description}</p>
      <div className="buttons">
        {added ? (
          <Button
            color="red"
            onClick={() => {
              removeFromCalendar(id);
              setAdded(false);
            }}
          >
            Supprimer du calendrier
          </Button>
        ) : (
          <Button
            onClick={() => {
              setAdded(true);
              addToCalendar({
                date: new Date(start),
                text: title,
                id,
                summary: bde,
                color: 2,
              });
            }}
          >
            📅 Ajouter au calendrier
          </Button>
        )}

        <Button color="gray" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </div>
  );
};

export default InfoPanel;
