"use client";

import { useCallback } from "react";
import { Button } from "./ui/button";

const FullscreenPopup = ({ url, isUserAutherised }) => {
  const openPopup = useCallback(() => {


    const features = `
      toolbar=no,
      location=no,
      status=no,
      menubar=no,
      scrollbars=yes,
      resizable=no,
      width=${window.screen.availWidth},
      height=${window.screen.availHeight},
      top=0,
      left=0
    `.replace(/\s+/g, "");

    const newWindow = window.open("", "_blank", features);

    if (!newWindow) {
      alert("Popup blocked! Please allow popups for this site.");
      return;
    }

    newWindow.moveTo(0, 0);
    newWindow.resizeTo(window.screen.availWidth, window.screen.availHeight);
    newWindow.focus();

    // Navigate to the secure page
    newWindow.location.href = url;
  }, [url]);

  return (
    <Button disabled={!isUserAutherised} onClick={()=>{
      if (isUserAutherised){
        openPopup()
      }
    }}>
      Continue
    </Button>
  );
};

export default FullscreenPopup;
