import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import NavbarUsuarios from "../components/NavbarUsuarios";
import { Contexto } from "../context/contexto";
import ReactPaginate from 'react-paginate';
import "../layouts/layouts.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const Usuarios = () => {
  const URL = "http://localhost:3000/casasDisponibles";

  const { id, validarSesion, monto } = useContext(Contexto);

  const [casas, setCasas] = useState([]);

  const [search, setSearch] = useState("");
  const [precioMinimo, setPrecioMinimo] = useState(0);
  const [precioMaximo, setPrecioMaximo] = useState(1000000);

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

  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 6;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(casas.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    validarSesion();
    casasDisponible('');
  }, [search]);

  const casasDisponible = async (zonas) => {
    const respuesta = await axios.get(`${URL}/${zonas}`);
    setCasas(respuesta.data);
  };


  const sutmitBuscar = (e) => {
    e.preventDefault();

    setCasas(
      casas.filter((item) =>
        item.direccion.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const submitBuscarPrecio = (e) => {
    e.preventDefault();

    const filteredCasas = casas.filter((item) => {
      const costoAlquiler = item.costoAlquiler;

      const costoMatches = (costoAlquiler >= precioMinimo && costoAlquiler <= precioMaximo);
      return costoMatches
    });

    setCasas(filteredCasas);
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
      <div className='d-flex mt-2 justify-content-between mx-3'>
        <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">Filtrar</button>
      </div>
      <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasScrollingLabel">Buscar por</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <p className="fw-bold">Buscar por zona</p>
          <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={(e) => casasDisponible(e.target.value)}>
            <option value="">Todas</option>
            <option value="norte">Norte</option>
            <option value="centro">Centro</option>
            <option value="sur">Sur</option>
          </select>

          <p className="fw-bold mt-4">Buscar por Direccion</p>
          <form className="d-flex justify-content-center gap-2" onSubmit={sutmitBuscar}>
            <input type="text" placeholder="Buscar por dirección" className="form-control w-100" onChange={(e) => setSearch(e.target.value)} />
            <button type="submit" className="btn btn-primary"> Buscar</button>
          </form>

          <p className="fw-bold mt-4">Buscar por Costo</p>
          <form className="d-flex justify-content-center gap-2" onSubmit={submitBuscarPrecio}>
            <input type="number" placeholder="Precio Minimo" value={precioMinimo} className="form-control w-100" onChange={(e) => setPrecioMinimo(e.target.value)} />
            <input type="number" placeholder="Precio Maximo" value={precioMaximo} className="form-control w-100" onChange={(e) => setPrecioMaximo(e.target.value)} />
            <button type="submit" className="btn btn-primary"> Buscar</button>
          </form>

        </div>
      </div>
      <div className="contenedor">
        {casas.slice(pagesVisited, pagesVisited + usersPerPage).map((casas) => (
          <div key={casas._id} className="card">
            <div className="card-body">
              <div className="d-flex justify-content-end">
                <div>
                  <button
                  style={{borderRadius: '20px'}}
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

              <div className='w-100 text-center mt-1'>
                <img className='w-75' style={{height: '150px'}} src={casas.imgCasa.urlImg} alt={casas.imgCasa.urlImg} />
              </div>

              <div className="input-group flex-nowrap my-2">
                <span className="input-group-text" id="addon-wrapping">
                Zona
                </span>
                <label
                className="form-control form-control-disabled"
                htmlFor="direccion"
                >
                <h5>{casas.zona}</h5>
                </label>
                <span className="input-group-text" id="addon-wrapping">
                Costo
                </span>
                <label
                className="form-control form-control-disabled"
                htmlFor="direccion"
                >
                <span>${casas.costoAlquiler} Pesos</span>
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
                <span>{casas.direccion}</span>
                </label>
              </div>

              <div className="input-group flex-nowrap my-2">
                <span className="input-group-text" id="addon-wrapping">
                Descripción
                </span>
                <label
                className="form-control form-control-disabled"
                htmlFor="direccion"
                >
                <span>{casas.descripcion}</span>
                </label>
              </div>

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
      {/* Paginación */}
      <div className='d-flex justify-content-center'>
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"pagination"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          disabledClassName={"disabled"}
          activeClassName={"active"}
        />
      </div>
    </>
  );
};

export default Usuarios;
