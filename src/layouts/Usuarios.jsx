import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import NavbarUsuarios from "../components/NavbarUsuarios";
import { Contexto } from "../context/contexto";
import "../layouts/layouts.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const Usuarios = () => {
  const URL = "http://localhost:3000/casasDisponibles";

  const { id, validarSesion, monto } = useContext(Contexto);

  const [casas, setCasas] = useState([]);

  const [idCasa, setIdCasa] = useState("");
  const [zona, setZona] = useState("");
  const [direccion, setDireccion] = useState("");
  const [costoAlquiler, setCostoAlquiler] = useState("");
  const [ancho, setAncho] = useState("");
  const [largo, setLargo] = useState("");
  const [pisos, setPisos] = useState("");
  const [capacidadPersonas, setCapacidadPersonas] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    validarSesion();
    casasDisponible();
  }, []);

  const casasDisponible = async () => {
    const respuesta = await axios.get(URL);
    setCasas(respuesta.data);
  };

  const estadoTrue = (estado) => {
    const estadoKeys = Object.keys(estado);
    const estadoTrueKey = estadoKeys.find((key) => estado[key]);
    return estadoTrueKey;
  };

  const openModal = (
    idCasa,
    zona,
    direccion,
    costo,
    ancho,
    largo,
    pisos,
    capacidad,
    categoria,
    descripcion
  ) => {
    setIdCasa(idCasa);
    setZona(zona);
    setDireccion(direccion);
    setCostoAlquiler(costo);
    setAncho(ancho);
    setLargo(largo);
    setPisos(pisos);
    setCapacidadPersonas(capacidad);
    setCategoria(categoria);
    setDescripcion(descripcion);
  };

  const handleAlquilar = async (zona) => {
    const retencion = costoAlquiler * 0.85;
    const devolucion = costoAlquiler * 0.15;
    const nuevoMonto = monto - retencion + devolucion;

    Swal.fire({
      title: "Confirmar alquiler",
      html: `Al confirmar el alquiler se le retendrá el 85% del costo del alquiler (${retencion} Pesos Colombianos) de su saldo actual de ${monto} Pesos Colombianos. Además, se le devolverá un 15% del costo del alquiler (${devolucion} Pesos Colombianos) a su saldo. ¿Desea continuar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, alquilar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(URL, {
            idTenedorAlquiler: id,
            ValorRetenido: retencion,
            zona: zona,
            idCasa: idCasa,
            nuevoMontoUsuario: nuevoMonto,
          });
          if (respuesta.status === 200 && respuesta.data) {
            Swal.fire({
              icon: "success",
              title: "!Alquilado!",
              text: `!${respuesta.data}!`,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              window.location.href = "/usuarios";
            });
          }
        } catch (error) {
          if (error.response.status === 400)
            Swal.fire({
              title: "Error",
              text: error.response.data,
              icon: "error",
              confirmButtonText: "Aceptar",
            });
        }
      }
    });
  };

  return (
    <>
      <NavbarUsuarios></NavbarUsuarios>
      <div className="contenedor">
        {casas.map((casas) => (
          <div key={casas._id} className="card">
            <div className="card-body">
              <div className="d-flex justify-content-end">
                <div>
                  <button
                    className={
                      casas.estado.alquilado
                        ? "btn btn-primary"
                        : casas.estado.desactivado
                          ? "btn btn-danger"
                          : "btn btn-success"
                    }
                  >
                    {estadoTrue(casas.estado)}
                  </button>
                </div>
              </div>
              <h5 className="card-title">{casas.zona}</h5>
              <p className="card-text">{casas.descripcion}</p>
              <p className="card-text">{casas.direccion}</p>
              <p className="card-text">Costo: ${casas.costoAlquiler} pesos</p>
              <hr />
              <div className="text-center">
                <a
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#verAlquiler"
                  onClick={() =>
                    openModal(
                      casas._id,
                      casas.zona,
                      casas.direccion,
                      casas.costoAlquiler,
                      casas.medidas.ancho,
                      casas.medidas.largo,
                      casas.numPisos,
                      casas.capacidadPersona,
                      casas.categoria,
                      casas.descripcion
                    )
                  }
                >
                  Me intereza
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div
          className="modal fade"
          id="verAlquiler"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Descripción Alquiler
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">
                      Zona
                    </span>
                    <label
                      className="form-control form-control-disabled"
                      htmlFor="direccion"
                    >
                      <span>{zona}</span>
                    </label>
                  </div>

                  <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">
                      Dirección
                    </span>
                    <label
                      className="form-control form-control-disabled"
                      htmlFor="direccion"
                    >
                      <span>{direccion}</span>
                    </label>
                  </div>

                  <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">
                      Costo Alquiler
                    </span>
                    <label
                      className="form-control form-control-disabled"
                      htmlFor="direccion"
                    >
                      <span>${costoAlquiler} Pesos Colombianos</span>
                    </label>
                  </div>

                  <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">
                      Ancho
                    </span>
                    <label
                      className="form-control form-control-disabled"
                      htmlFor="direccion"
                    >
                      <span>{ancho} Metros</span>
                    </label>

                    <span className="input-group-text" id="addon-wrapping">
                      Largo
                    </span>
                    <label
                      className="form-control form-control-disabled"
                      htmlFor="direccion"
                    >
                      <span>{largo} Metros</span>
                    </label>
                  </div>

                  <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">
                      Número Pisos
                    </span>
                    <label
                      className="form-control form-control-disabled"
                      htmlFor="direccion"
                    >
                      <span>{pisos} Pisos</span>
                    </label>
                  </div>

                  <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">
                      Capacidad
                    </span>
                    <label
                      className="form-control form-control-disabled"
                      htmlFor="direccion"
                    >
                      <span>{capacidadPersonas} Personas</span>
                    </label>
                  </div>

                  <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">
                      Categoria
                    </span>
                    <label
                      className="form-control form-control-disabled"
                      htmlFor="direccion"
                    >
                      <span>{categoria}</span>
                    </label>
                  </div>

                  <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">
                      Descripcion
                    </span>
                    <label
                      className="form-control form-control-disabled"
                      htmlFor="direccion"
                    >
                      <span>{descripcion}</span>
                    </label>
                  </div>

                  <div>
                    <p>Tu saldo es de: ${monto} Pesos Colombianos</p>
                    {monto >= costoAlquiler ? (
                      <p className="text-success">Monto suficiente ✔️</p>
                    ) : (
                      <p className="text-danger">Monto insuficiente ❌</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cerrar
                </button>
                {monto >= costoAlquiler ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAlquilar(zona)}
                  >
                    Alquilar
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={true}
                    className="btn btn-primary"
                  >
                    Monto insuficiente
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Usuarios;
