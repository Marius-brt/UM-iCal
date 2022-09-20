import React, { FC, useEffect, useState } from "react";
import {
  IconHome,
  IconQuestionMark,
  IconCalendar,
  IconSettings,
} from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar: FC<any> = () => {
  const router = useRouter();
  const [route, setRoute] = useState("/");
  useEffect(() => {
    setRoute(router.asPath);
  }, [router.asPath]);
  return (
    <div className="navbar-container">
      <div className="navbar">
        <Link href="/">
          <div className={route == "/" ? "item active" : "item"}>
            <div style={{ width: "25px", height: "25px" }}>
              <IconHome size={25} color="#fff" />
            </div>
            <p>Accueil</p>
          </div>
        </Link>
        <Link href="/calendar">
          <div className={route == "/calendar" ? "item active" : "item"}>
            <div style={{ width: "25px", height: "25px" }}>
              <IconCalendar size={25} color="#fff" />
            </div>
            <p>Calendrier</p>
          </div>
        </Link>
        <Link href="/settings">
          <div className={route == "/settings" ? "item active" : "item"}>
            <div style={{ width: "25px", height: "25px" }}>
              <IconSettings size={25} color="#fff" />
            </div>
            <p>Paramètres</p>
          </div>
        </Link>
        <Link href="/faq">
          <div className={route == "/faq" ? "item active" : "item"}>
            <div style={{ width: "25px", height: "25px" }}>
              <IconQuestionMark color="#fff" size={25} />
            </div>
            <p>FAQ</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
