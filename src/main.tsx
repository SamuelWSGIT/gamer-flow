import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Feed from "./pages/Feed/index.tsx";
import Register from "./pages/Register/index.tsx";
import EditProfile from "./pages/EditProfile/index.tsx";
import Login from "./pages/Login/index.tsx";
import NewPost from "./pages/NewPost/index.tsx";
import Profile from "./pages/Profile/index.tsx";
import AppLayout from "./components/AppLayout/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="cadastro" element={<Register />} />
        </Route>
        <Route path="/" element={<AppLayout />}>
          <Route path="" element={<Feed />} />
          <Route path="postagem" element={<NewPost />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="perfil/editar" element={<EditProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
