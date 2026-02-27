import React from "react";
import { createHashRouter } from "react-router";
import { RoleSelect } from "./screens/RoleSelect";
import { HostRoom } from "./screens/HostRoom";
import { PlayerRoom } from "./screens/PlayerRoom";

export const router = createHashRouter([
  { path: "/", element: <RoleSelect /> },
  { path: "/host", element: <HostRoom /> },
  { path: "/host/:roomCode", element: <HostRoom /> },
  { path: "/play/:roomCode", element: <PlayerRoom /> },
]);
