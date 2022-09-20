import { Badge } from "@mantine/core";
import { IconArrowNarrowRight } from "@tabler/icons";
import { ColorInterface } from "../utils/interfaces";
import { formatTime } from "../utils/dates";
import React, { FC, useEffect, useState } from "react";

interface SummaryInterface {
  summary: string;
  start: Date;
  end: Date;
  teacher: string;
  location: string;
  color: ColorInterface;
  style: string;
}

const Summary: FC<SummaryInterface> = ({
  summary,
  start,
  end,
  teacher,
  location,
  color,
  style,
}) => {
  const [percent, setPercent] = useState(0);
  let interval: any = null;
  useEffect(() => {
    const now = new Date();
    if (start <= now && end >= now) {
      if (interval != null) clearInterval(interval);
      interval = setInterval(calc, 10000);
      calc();
    } else if (interval != null) {
      clearInterval(interval);
    }
  }, []);
  const calc = () => {
    const n = new Date();
    var q = Math.abs(+n - +start);
    var d = Math.abs(+end - +start);
    const p = (q / d) * 100;
    setPercent(p <= 100 ? p : 100);
  };
  const renderBar = () => {
    switch (style || "default") {
      case "default":
        return (
          <div
            className="progress"
            style={percent > 0 ? { width: percent + "%" } : { display: "none" }}
          ></div>
        );
      case "goku":
        return (
          <>
            <img
              className="goku"
              src="goku.png"
              alt=""
              style={percent > 0 ? {} : { display: "none" }}
            />
            <div
              className="progress goku"
              style={
                percent > 0 ? { width: percent + "%" } : { display: "none" }
              }
            ></div>
          </>
        );
      case "lucky":
        return (
          <>
            <img
              className="lucky"
              src="lucky luke.png"
              alt=""
              style={percent > 0 ? {} : { display: "none" }}
            />
            <div
              className="progress lucky"
              style={
                percent > 0 ? { width: percent + "%" } : { display: "none" }
              }
            >
              <img src="bullet.png" alt="" />
            </div>
          </>
        );
      case "lightsaber":
        return (
          <>
            <img
              className="lightsaber"
              src="lightsaber.png"
              alt=""
              style={percent > 0 ? {} : { display: "none" }}
            />
            <div
              className="progress goku"
              style={
                percent > 0 ? { width: percent + "%" } : { display: "none" }
              }
            ></div>
          </>
        );
      case "amongus":
        return (
          <>
            <div
              className="progress amongus"
              style={
                percent > 0 ? { width: percent + "%" } : { display: "none" }
              }
            >
              <img
                src="amongus.png"
                alt=""
                style={{ transform: `rotate(${(percent / 100) * 360}deg)` }}
              />
            </div>
          </>
        );
    }
  };
  return (
    <div className="card" style={{ backgroundColor: color.bg }}>
      {renderBar()}
      <p className="summary">{summary}</p>
      <Badge color={color.badge}>{location}</Badge>
      <p className="teacher">{teacher}</p>
      <div className="hours">
        <p>{formatTime(start)}</p>
        <IconArrowNarrowRight size={18} color="#fff" />
        <p>{formatTime(end)}</p>
      </div>
    </div>
  );
};

export default Summary;
