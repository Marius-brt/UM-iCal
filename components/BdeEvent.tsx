import { Badge, Button } from "@mantine/core";
import { BdeInterface } from "../utils/interfaces";
import { formatDateLetters } from "../utils/dates";
import { truncate } from "../utils/others";
import React, { FC } from "react";

const BDEEvent: FC<BdeInterface> = ({
  title,
  start,
  smallDescription,
  onOpen,
}) => {
  return (
    <div className="bdeCard" style={{ backgroundColor: "rgb(243, 92, 101)" }}>
      <div className="bdeContainer">
        <p className="title">{title}</p>
        <Badge color="red">{formatDateLetters(new Date(start))}</Badge>
        <p className="description">{truncate(smallDescription, 70)}</p>
      </div>
      <Button variant="outline" radius="xl" onClick={onOpen}>
        + infos
      </Button>
    </div>
  );
};

export default BDEEvent;
