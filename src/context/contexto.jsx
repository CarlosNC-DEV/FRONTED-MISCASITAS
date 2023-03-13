import React, { createContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

export const Contexto = createContext();

export const ContextoProvider = (props) => {

  const URL = "http://localhost:3000/usuarios";
  const URL_ADMIN = "http://localhost:3000/administrador";

  const [id, setId] = useState("");
  const [imgPerfil, setImgPerfil] = useState('');
  const [nombre, setNombre] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [usuario, setUsuario] = useState("");
  const [monto, setMonto] = useState("");


  const [idAdmin, setIdUsuario] = useState('');
  const [usuarioAdmin, setUsuarioAdmin] = useState('');
  const [correoAdmin, setCorreoAdmin] = useState('');
  const [montoAdmin, setMontoAdmin] = useState('');

  const validarSesion = async () => {
    const JWT = localStorage.getItem("JWT_USUARIO");
    if (!JWT) {
      Swal.fire({
        icon: "info",
        title: "Sesión cerrada",
        text: "Tu sesión ha sido cerrada exitosamente",
        showConfirmButton: false,
        timer: 1200,
      }).then(() => {
        window.location.href = "/";
      });
    }

      try {
        const response = await axios.get(URL, {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        });
        setId(response.data._id);
        setImgPerfil(response.data.fotoPerfil)
        setNombre(response.data.nombre)
        setIdentificacion(response.data.identificacion)
        setUsuario(response.data.usuario);
        setMonto(response.data.dinero);
      } catch (error) {
        if (error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "¡Ups!",
            text: "Necesitas Iniciar sesión!",
            showConfirmButton: false,
            timer: 1200,
          }).then(() => {
            window.location.href = "/404";
          });
        }
      }
  };

  const cerrarSesion = () => {
    Swal.fire({
      title: "¿Estas seguro/a?",
      text: "Si cierras la sesión tendras de que logearte nuevamente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, cerrar sesión!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("JWT_USUARIO");
        Swal.fire({
          icon: "success",
          title: "!Sesión cerrada!",
          text: "!Vuelve pronto!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.href = "/";
        });
      }
    });
  };

  const validarSesionAdmin = async () => {
    const JWT = localStorage.getItem("JWT_ADMIN");
    if (!JWT) {
      Swal.fire({
        icon: "info",
        title: "Sesión cerrada",
        text: "Tu sesión ha sido cerrada exitosamente",
        showConfirmButton: false,
        timer: 1200,
      }).then(() => {
        window.location.href = "/";
      });
    }

      try {
        const response = await axios.get(URL_ADMIN, {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        });
        setIdUsuario(response.data._id);
        setUsuarioAdmin(response.data.usuario);
        setCorreoAdmin(response.data.correo);
        setMontoAdmin(response.data.monto);
      } catch (error) {
        if (error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "¡Ups!",
            text: "Necesitas Iniciar sesión!",
            showConfirmButton: false,
            timer: 1200,
          }).then(() => {
            window.location.href = "/404";
          });
        }
      }
  };

  const cerrarSesionAdmin = () => {
    Swal.fire({
      title: "¿Estas seguro/a?",
      text: "Si cierras la sesión tendras de que logearte nuevamente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, cerrar sesión!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("JWT_ADMIN");
        Swal.fire({
          icon: "success",
          title: "!Sesión cerrada!",
          text: "!Vuelve pronto!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.href = "/";
        });
      }
    });
  };

  return (
    <Contexto.Provider
      value={{ validarSesion, cerrarSesion, validarSesionAdmin, cerrarSesionAdmin, id, imgPerfil, nombre, identificacion, usuario, monto, idAdmin, usuarioAdmin, correoAdmin, montoAdmin }}
    >
      {props.children}
    </Contexto.Provider>
  );
};

export default Contexto;
