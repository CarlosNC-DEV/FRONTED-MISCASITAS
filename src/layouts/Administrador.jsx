import React, { useContext, useState, useEffect } from 'react';
import { Contexto } from '../context/contexto';
import NavbarAdmin from '../components/NavbarAdmin';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.css'
import '../layouts/layouts.css'

const Administrador = () => {

    const URL = "http://localhost:3000/casas"

    const { validarSesionAdmin } = useContext(Contexto);

    const [imgSeleccImg, setSeleccImg] = useState(null);
    const [imgAlquiler, setImgAlquiler] = useState(null);

    const [casas, setCasas] = useState([]);

    const [zona, setZona] = useState('');
    const [direccion, setDireccion] = useState('');
    const [costoAlquiler, setCostoAlquiler] = useState('');
    const [ancho, setAncho] = useState('');
    const [largo, setLargo] = useState('');
    const [pisos, setPisos] = useState('');
    const [capacidadPersonas, setCapacidadPersonas] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');


    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 6;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(casas.length / usersPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    useEffect(() => {
        validarSesionAdmin();
        getCasas('')
    }, []);

    const crearAlquiler = async () => {
        try {
            const formData = new FormData();
            formData.append('fotoAlquiler', imgAlquiler);
            formData.append('zona', zona);
            formData.append('direccion', direccion);
            formData.append('costoAlquiler', costoAlquiler);
            formData.append('ancho', ancho);
            formData.append('largo', largo);
            formData.append('numPisos', pisos);
            formData.append('capacidadPersona', capacidadPersonas);
            formData.append('categoria', categoria);
            formData.append('descripcion', descripcion);

            const loading = Swal.fire({
                title: 'Registrando Alquiler',
                text: 'Espere un momento por favor...',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            await axios.post(URL, formData);

            // Cierra la alerta de espera
            loading.close();

            Swal.fire({
                icon: 'success',
                title: 'Registrado correctamente',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = '/administrador'
            });

        } catch (error) {
            if (error.response.status === 400) {
                Swal.fire({
                    title: 'Error',
                    text: error.response.data,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                console.log(error);
            }
        }
    }

    const getCasas = async (estado) => {
        const respuesta = await axios.get(`${URL}/${estado}`);
        setCasas(respuesta.data);
    }

    const estadoTrue = (estado) => {
        const estadoKeys = Object.keys(estado);
        const estadoTrueKey = estadoKeys.find(key => estado[key]);
        return estadoTrueKey;
    }

    const getButtonProps = (casas) => {
        if (casas.estado.desactivado) {
            return { className: 'btn btn-primary', onClick: () => activarCasa(casas._id), text: 'Activar' };
        } else {
            return { className: 'btn btn-danger', onClick: () => desactivarCasa(casas._id), text: 'Desactivar' };
        }
    };

    const desactivarCasa = async (idD) => {
        Swal.fire({
            title: "¿Estas seguro/a?",
            text: "Si desactiva el arquiler no podra ser visto por los usuarios!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Desactivar Alquiler!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const respuesta = await axios.put(`${URL}/desactivar/${idD}`);
                    if (respuesta.status === 200 && respuesta.data) {
                        Swal.fire({
                            icon: "success",
                            title: "!Desactivado!",
                            text: `!${respuesta.data}!`,
                            showConfirmButton: false,
                            timer: 1500,
                        }).then(() => {
                            window.location.href = "/administrador";
                        });
                    }
                } catch (error) {
                    if (error.response.status === 400)
                        Swal.fire({
                            title: 'Error',
                            text: error.response.data,
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        });
                }

            }
        });
    }

    const activarCasa = async (idA) => {
        Swal.fire({
            title: "¿Estas seguro/a?",
            text: "Activara el alquiler y sera visible para los usuarios!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Activar Alquiler!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const respuesta = await axios.put(`${URL}/activar/${idA}`);
                    if (respuesta.status === 200 && respuesta.data) {
                        Swal.fire({
                            icon: "success",
                            title: "!Activado!",
                            text: `!${respuesta.data}!`,
                            showConfirmButton: false,
                            timer: 1500,
                        }).then(() => {
                            window.location.href = "/administrador";
                        });
                    }
                } catch (error) {
                    if (error.response.status === 400)
                        Swal.fire({
                            title: 'Error',
                            text: error.response.data,
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        });
                }

            }
        });
    }

    const handleImageChange = (e) => {
        setImgAlquiler(e.target.files[0]);
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setSeleccImg(reader.result);
        };
        reader.readAsDataURL(file);
    };


    return (
        <>
            <NavbarAdmin></NavbarAdmin>
            <div className='container-fluid'>
                <div className='d-flex mt-2 justify-content-between mx-3'>
                    <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">Filtrar</button>
                    <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#nuevaPublicacion">Crear Nuevo Alquiler</button>
                </div>

                <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasScrollingLabel">Buscar por</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <p className="fw-bold">Buscar por estado</p>
                        <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={(e) => getCasas(e.target.value)}>
                            <option value="">Todas</option>
                            <option value="disponible">Disponibles</option>
                            <option value="alquilado">Ocupadas / Alquiladas</option>
                            <option value="desactivado">Desactivadas</option>
                        </select>

                    </div>
                </div>

                <div className='contenedor'>
                    {casas.slice(pagesVisited, pagesVisited + usersPerPage).map((casas) => (
                        <div key={casas._id} className="card">
                            <div className="card-body">
                                <div className='d-flex justify-content-end'>
                                    <div>
                                        <button style={{borderRadius: '20px'}} className={casas.estado.alquilado ? 'btn btn-warning' : casas.estado.desactivado ? 'btn btn-danger' : 'btn btn-success'}>{estadoTrue(casas.estado)}</button>
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
                                        Descripción
                                    </span>
                                    <label
                                        className="form-control form-control-disabled"
                                        htmlFor="direccion"
                                    >
                                        <span>{casas.descripcion}</span>
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
                                        Capacidad
                                    </span>
                                    <label
                                        className="form-control form-control-disabled"
                                        htmlFor="direccion"
                                    >
                                        <span>{casas.capacidadPersona} Personas</span>
                                    </label>
                                    <span className="input-group-text" id="addon-wrapping">
                                        Categoria
                                    </span>
                                    <label
                                        className="form-control form-control-disabled"
                                        htmlFor="direccion"
                                    >
                                        <span>{casas.categoria}</span>
                                    </label>
                                </div>

                                <div className="input-group flex-nowrap my-2">
                                    <span className="input-group-text" id="addon-wrapping">
                                        Largo
                                    </span>
                                    <label
                                        className="form-control form-control-disabled"
                                        htmlFor="direccion"
                                    >
                                        <span>{casas.medidas.ancho} Metros</span>
                                    </label>
                                    <span className="input-group-text" id="addon-wrapping">
                                        Ancho
                                    </span>
                                    <label
                                        className="form-control form-control-disabled"
                                        htmlFor="direccion"
                                    >
                                        <span>{casas.medidas.largo} Metros</span>
                                    </label>
                                </div>

                                <div className="input-group flex-nowrap my-2">
                                    <span className="input-group-text" id="addon-wrapping">
                                        Pisos
                                    </span>
                                    <label
                                        className="form-control form-control-disabled"
                                        htmlFor="direccion"
                                    >
                                        <span>{casas.numPisos}</span>
                                    </label>
                                </div>

                                <hr />
                                <div className='d-flex gap-1'>
                                    <div>
                                        <button {...getButtonProps(casas)}>{getButtonProps(casas).text}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="modal fade" id="nuevaPublicacion" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Crear Nuevo Alquiler</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <div className="selected-image text-center w-100 mb-3">
                                    {imgSeleccImg ? <img className='w-50' src={imgSeleccImg} alt="Imagen seleccionada" /> : <p>No se ha seleccionado ninguna imagen</p>}
                                </div>

                                <div className="form-group mb-3">
                                    <div className="custom-input-file col-md-6 col-sm-6 col-xs-6">
                                        <input type="file" id="fichero-tarifas" className="input-file" name='imgPublicacion' onChange={handleImageChange}></input>
                                        Seleccione una Imagen de Alquiler...
                                    </div>
                                </div>

                                <div>
                                    <select className="form-select my-2" aria-label="Default select example" onChange={(e) => setZona(e.target.value)}>
                                        <option selected>Selecciona la zona</option>
                                        <option value="sur">Sur</option>
                                        <option value="centro">Centro</option>
                                        <option value="norte">Norte</option>
                                    </select>
                                </div>

                                <div className="input-group flex-nowrap my-2">
                                    <span className="input-group-text" id="addon-wrapping">@</span>
                                    <input type="text" className="form-control" placeholder="Direccion" aria-label="Direccion" aria-describedby="addon-wrapping" value={direccion} onChange={(e) => setDireccion(e.target.value)}></input>
                                </div>

                                <div className="input-group flex-nowrap my-2">
                                    <span className="input-group-text" id="addon-wrapping">Costo Alquiler</span>
                                    <input type="number" className="form-control" placeholder="Pesos Colombianos" aria-label="Pesos Colombianos" aria-describedby="addon-wrapping" value={costoAlquiler} onChange={(e) => setCostoAlquiler(e.target.value)}></input>
                                </div>

                                <div className="input-group flex-nowrap my-2 gap-1">
                                    <span className="input-group-text" id="addon-wrapping">Ancho</span>
                                    <input type="number" className="form-control" placeholder="Metros" aria-label="Metros" aria-describedby="addon-wrapping" value={ancho} onChange={(e) => setAncho(e.target.value)}></input>

                                    <span className="input-group-text" id="addon-wrapping">Largo</span>
                                    <input type="number" className="form-control" placeholder="Metros" aria-label="Metros" aria-describedby="addon-wrapping" value={largo} onChange={(e) => setLargo(e.target.value)}></input>
                                </div>

                                <div className="input-group flex-nowrap my-2">
                                    <span className="input-group-text" id="addon-wrapping">Número Pisos</span>
                                    <input type="number" className="form-control" aria-describedby="addon-wrapping" value={pisos} onChange={(e) => setPisos(e.target.value)}></input>
                                </div>


                                <div className="input-group flex-nowrap my-2">
                                    <span className="input-group-text" id="addon-wrapping">Capacidad Personas</span>
                                    <input type="number" className="form-control" aria-describedby="addon-wrapping" value={capacidadPersonas} onChange={(e) => setCapacidadPersonas(e.target.value)}></input>
                                </div>

                                <div>
                                    <select className="form-select my-2" aria-label="Default select example" onChange={(e) => setCategoria(e.target.value)}>
                                        <option selected>Selecciona la categoria</option>
                                        <option value="cabaña">Cabaña</option>
                                        <option value="familiar">Casa familiar</option>
                                        <option value="rodante">Casa rodante</option>
                                        <option value="inteligente">Casa inteligente</option>
                                        <option value="ecologica">Casa ecológica</option>
                                        <option value="iglu">Iglú</option>
                                        <option value="prefabricada">Casa prefabricada</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <span className="input-group-text">Descripción</span>
                                    <textarea className="form-control" aria-label="With textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button type="button" className="btn btn-primary" onClick={() => crearAlquiler()}>Crear</button>
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
}

export default Administrador;
