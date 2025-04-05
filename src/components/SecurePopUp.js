"use client";

import { Button } from "@/components/ui/button";

export function SecurePopupLink({ url }) {
  
    const handleClick = () => {
      const win = window.open(
        url,
        "_blank",
        "noopener,noreferrer,width=800,height=600"
      );

      if (!win) {
        alert("Popup blocked. Please allow popups.");
        return;
      }

      // Tell the child window to try full screen when ready
      win.onload = () => {
        win.document.body.setAttribute("data-trigger-fullscreen", "true");
      };
    };


  return <Button onClick={handleClick}>Continue</Button>;
}
