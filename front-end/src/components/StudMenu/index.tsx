import { IconButton, Menu, MenuItem } from "@material-ui/core";
import React, { useState } from "react";

import { AccountCircle } from "@material-ui/icons";
import { useHistory } from "react-router";

export type MenuProps = {};

const StudMenu: React.FC<MenuProps> = (props: MenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const history = useHistory();
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
        <AccountCircle />
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
        <MenuItem
          onClick={() => {
            localStorage.clear();
            history.push("/");
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default StudMenu;
