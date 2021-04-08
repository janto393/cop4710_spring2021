import { IconButton, Menu, MenuItem } from "@material-ui/core";
import React, { useState } from "react";

import MenuIcon from "@material-ui/icons/Menu";
import { menuItems } from "../../Utils/menuUtils";

export type MenuProps = {};

const StudMenu: React.FC<MenuProps> = (props: MenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        edge="start"
        className=""
        color="inherit"
        aria-label="menu"
        onClick={(e: React.MouseEvent<HTMLElement>) =>
          setAnchorEl(e.currentTarget)
        }
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        {/* options will depend on user auth */}
        {menuItems.map((menuItem) => {
          const { onClick, title } = menuItem;
          return <MenuItem onClick={onClick}>{title}</MenuItem>;
        })}
      </Menu>
    </>
  );
};

export default StudMenu;
