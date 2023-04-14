import React from "react";
import { Popover } from "../popover/Popover";
import { ToolbarButton } from "../input/ToolbarButton";
import { ReactComponent as ObjectIcon } from "../icons/GuestbookImg.svg";

export function GuestbookButton() {
  return (
    <Popover
      title={"Guestbook"}
      placement="top"
      offsetDistance={28}
    >
      {({popoverVisible, triggerRef }) => (
        <ToolbarButton
          ref={triggerRef}
          icon={<ObjectIcon />}
          selected={popoverVisible}
          onClick={() => {
            console.log('Button clicked for real!');
            window.open("https://galaxy-hub-dev.com/", "_blank");}}
          label={"Guestbook"}
          preset="accent3"
        />
      )}
    </Popover>
  );
}
