import React from "react";
import { createRoot } from "react-dom/client";
import Lanyard from "./Lanyard";
import ProfileCard from "./ProfileCard";
import ModelViewer from "./ModelViewer";

import avtPng from "./assets/lanyard/avt.png";
import avt2Png from "./assets/lanyard/avt2.png";
import iconPattern from "./assets/demo/iconpattern.svg";

function mount() {
  const lanyardEl = document.getElementById("lanyard-root");
  if (lanyardEl) {
    try {
      createRoot(lanyardEl).render(<Lanyard frontImage={avtPng} />);
    } catch (e) {
      // Fallback for older React where createRoot may not be available
      const ReactDOM = require("react-dom");
      ReactDOM.render(
        React.createElement(Lanyard, { frontImage: avtPng }),
        lanyardEl,
      );
    }
  }

  const modelViewerEl = document.getElementById("model-viewer-root");
  if (modelViewerEl) {
    try {
      createRoot(modelViewerEl).render(<ModelViewer />);
    } catch (e) {
      const ReactDOM = require("react-dom");
      ReactDOM.render(React.createElement(ModelViewer), modelViewerEl);
    }
  }

  const profileEl = document.getElementById("profile-card-root");
  if (profileEl) {
    try {
      createRoot(profileEl).render(
        <ProfileCard
          name="TDCDanh"
          title="Vibe Coder / Student"
          handle="tdcdanh"
          status="Online"
          contactText="Contact Me"
          avatarUrl={avt2Png}
          showUserInfo={false}
          enableTilt={true}
          enableMobileTilt={false}
          onContactClick={() => console.log("Contact clicked")}
          behindGlowColor="rgba(68, 138, 255, 0.67)"
          iconUrl={iconPattern}
          behindGlowEnabled
          innerGradient="linear-gradient(145deg,#4a6a8e8c 0%,#448AFF44 100%)"
        />,
      );
    } catch (e) {
      const ReactDOM = require("react-dom");
      ReactDOM.render(
        React.createElement(ProfileCard, {
          name: "TDCDanh",
          title: "Vibe Coder / Student",
          handle: "tdcdanh",
          status: "Online",
          contactText: "Contact Me",
          avatarUrl: avt2Png,
          showUserInfo: false,
          enableTilt: true,
          enableMobileTilt: false,
          onContactClick: () => console.log("Contact clicked"),
          behindGlowColor: "rgba(68, 138, 255, 0.67)",
          iconUrl: iconPattern,
          behindGlowEnabled: true,
          innerGradient: "linear-gradient(145deg,#4a6a8e8c 0%,#448AFF44 100%)",
        }),
        profileEl,
      );
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
