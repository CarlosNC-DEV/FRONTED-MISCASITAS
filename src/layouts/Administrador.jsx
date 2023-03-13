import React, { useContext, useState, useEffect } from 'react';
import { Contexto } from '../context/contexto';
import NavbarAdmin from '../components/NavbarAdmin';
import axios from 'axios';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.css'
import '../layouts/layouts.css'

const Administrador = () => {

    const URL = "http://localhost:3000/casas"

    const { validarSesionAdmin } = useContext(Contexto);

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

    useEffect(()=>{
        validarSesionAdmin();
        getCasas()
    },[]);

    const crearAlquiler = async()=>{
        try {
            const respuesta = await axios.post(URL, { zona: zona, direccion: direccion, costoAlquiler: costoAlquiler, ancho: ancho, largo:largo, numPisos: pisos, capacidadPersona:capacidadPersonas, categoria:categoria, descripcion:descripcion});
            if(respuesta.status === 200 && respuesta.data){
                Swal.fire({
                    icon: 'success',
                    title: 'Registrado correctamente',
                    showConfirmButton: false,
                    timer: 1500}).then(()=>{
                        window.location.href = '/administrador'
                    });
            }
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

    const getCasas = async()=>{
        const respuesta = await axios.get(URL);
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

    const desactivarCasa = async(idD)=>{
        Swal.fire({
            title: "¿Estas seguro/a?",
            text: "Si desactiva el arquiler no podra ser visto por los usuarios!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Desactivar Alquiler!",
          }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    const respuesta = await axios.put(`${URL}/desactivar/${idD}`);
                    if(respuesta.status === 200 && respuesta.data){
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
                    if(error.response.status === 400)
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

    const activarCasa = async(idA)=>{
        Swal.fire({
            title: "¿Estas seguro/a?",
            text: "Activara el alquiler y sera visible para los usuarios!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Activar Alquiler!",
          }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    const respuesta = await axios.put(`${URL}/activar/${idA}`);
                    if(respuesta.status === 200 && respuesta.data){
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
                    if(error.response.status === 400)
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

    return (
        <>
            <NavbarAdmin></NavbarAdmin>
            <div className='container-fluid'>
                <div className='d-flex mt-2 justify-content-end'>
                    <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#nuevaPublicacion">Crear Nuevo Alquiler</button>
                </div>
                
                <div className='contenedor'>
                    {casas.map((casas)=>(
                    <div key={casas._id} className="card">
                        <div className="card-body">
                            <div className='d-flex justify-content-end'>
                                <div>
                                    <button className={casas.estado.alquilado ? 'btn btn-warning' : casas.estado.desactivado ? 'btn btn-danger' : 'btn btn-success'}>{estadoTrue(casas.estado)}</button>
                                </div>
                            </div>
                            <h5 className="card-title">{casas.zona}</h5>
                            <p className="card-text">{casas.descripcion}</p>
                            <p className="card-text">{casas.direccion}</p>
                            <p className="card-text">Costo: ${casas.costoAlquiler} pesos</p>
                            <p className="card-text">Capacidad: {casas.capacidadPersona} Personas</p>
                            <p className="card-text">Categoria: {casas.categoria}</p>
                            <p className="card-text">{casas.medidas.ancho} metros x {casas.medidas.largo} metros</p>
                            <p className="card-text">Pisos: {casas.numPisos}</p>
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

                <div>
                    <select className="form-select my-2" aria-label="Default select example" onChange={(e)=> setZona(e.target.value)}>
                        <option selected>Selecciona la zona</option>
                        <option value="sur">Sur</option>
                        <option value="centro">Centro</option>
                        <option value="norte">Norte</option>
                    </select>
                </div>

                <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">@</span>
                    <input type="text" className="form-control" placeholder="Direccion" aria-label="Direccion" aria-describedby="addon-wrapping" value={direccion} onChange={(e)=> setDireccion(e.target.value)}></input>
                </div>

                <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">Costo Alquiler</span>
                    <input type="number" className="form-control" placeholder="Pesos Colombianos" aria-label="Pesos Colombianos" aria-describedby="addon-wrapping" value={costoAlquiler} onChange={(e)=> setCostoAlquiler(e.target.value)}></input>
                </div>

                <div className="input-group flex-nowrap my-2 gap-1">
                    <span className="input-group-text" id="addon-wrapping">Ancho</span>
                    <input type="number" className="form-control" placeholder="Metros" aria-label="Metros" aria-describedby="addon-wrapping" value={ancho} onChange={(e)=> setAncho(e.target.value)}></input>

                    <span className="input-group-text" id="addon-wrapping">Largo</span>
                    <input type="number" className="form-control" placeholder="Metros" aria-label="Metros" aria-describedby="addon-wrapping" value={largo} onChange={(e)=> setLargo(e.target.value)}></input>
                </div>

                <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">Número Pisos</span>
                    <input type="number" className="form-control" aria-describedby="addon-wrapping" value={pisos} onChange={(e)=> setPisos(e.target.value)}></input>
                </div>


                <div className="input-group flex-nowrap my-2">
                    <span className="input-group-text" id="addon-wrapping">Capacidad Personas</span>
                    <input type="number" className="form-control" aria-describedby="addon-wrapping" value={capacidadPersonas} onChange={(e)=> setCapacidadPersonas(e.target.value)}></input>
                </div>

                <div>
                    <select className="form-select my-2" aria-label="Default select example" onChange={(e)=> setCategoria(e.target.value)}>
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
                    <textarea className="form-control" aria-label="With textarea" value={descripcion} onChange={(e)=> setDescripcion(e.target.value)}></textarea>
                </div>

                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" className="btn btn-primary" onClick={()=> crearAlquiler()}>Crear</button>
                </div>
                </div>
            </div>
            </div>
            </div>
        </>

    );
}

export default Administrador;
