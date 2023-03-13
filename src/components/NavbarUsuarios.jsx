import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Contexto } from '../context/contexto';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import '../components/components.css'
import axios from 'axios';

const NavbarUsuarios = () => {

    const { cerrarSesion, id,  imgPerfil, nombre, identificacion, usuario, monto } = useContext(Contexto);

  const URL = `http://localhost:3000/usuarios/${id}`;

    const [nombreAc, setNombreAC] = useState('');
    const [usuarioAc, setUsuarioAC] = useState('');

    const [imgAc, setImgAc] = useState(null);
    const [imgSelecc, setImgSelecc] = useState(null);

    useEffect(()=>{
        setNombreAC(nombre);
        setUsuarioAC(usuario)
    },[nombre, usuario])


    const actualizarUsuario = async()=>{
            Swal.fire({
                title: "¿Estas seguro/a?",
                text: "Si actualizas tu usuario no abra vuelta atras!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, actualizar Usuario!",
              }).then(async(result) => {
                if (result.isConfirmed) {
                    try {
                        const formData = new FormData();
                        formData.append('usuario', usuarioAc);
                        formData.append('nombreCompleto', nombreAc);
                        formData.append('fotoPerfilAc', imgAc);

                        const loading = Swal.fire({
                            title: 'Actualizando Usuario',
                            text: 'Espere un momento por favor...',
                            allowOutsideClick: false,
                            showConfirmButton: false,
                            didOpen: () => {
                            Swal.showLoading();
                            },
                        });

                        await axios.put(URL, formData);

                        loading.close();

                        Swal.fire({
                        icon: 'success',
                        title: 'Actualizado Correctamente',
                        showConfirmButton: false,
                        timer: 1500}).then(()=>{
                            window.location.href = '/usuarios'
                        });
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

    const handleImageChange = (e) => {
        setImgAc(e.target.files[0]);
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImgSelecc(reader.result);
        };
        reader.readAsDataURL(file);
      };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">MisCasitas</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav align-items-center ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to={"/usuarios"}>Casas</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <div className='d-flex align-item-center'>
                                    <a className="nav-link active" href="#">{usuario}</a>
                                    <img className='rounded-circle' src={imgPerfil} style={{width: '40px'}} alt="" />
                                </div>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#usuariosPerfilModal">Ver mi perfil</a></li>
                                <li><a className="dropdown-item" href="#" onClick={()=> cerrarSesion()}>Cerrar sesión</a></li>
                            </ul>
                        </li>
                </ul>
                </div>
            </div>
            </nav>

            <div>
            <div className="modal fade" id="usuariosPerfilModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Datos usuario {usuario}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a className="nav-link active" id="tab-login" data-bs-toggle="pill" href="#pills-login" role="tab" aria-controls="pills-login" aria-selected="true">Mis datos</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className="nav-link" id="tab-register" data-bs-toggle="pill" href="#pills-register" role="tab" aria-controls="pills-register" aria-selected="false">Actualizar</a>
                    </li>
                </ul>

                <div className="tab-content">
                <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                    <div className='w-100 text-center'>
                        <h5>Perfil</h5>
                        <img className='w-50' src={imgPerfil} alt={imgPerfil} />
                    </div>
                    <div>

                    <div className="input-group flex-nowrap my-2">
                        <span className="input-group-text" id="addon-wrapping">
                        Nombre Completo
                        </span>
                        <label
                        className="form-control form-control-disabled"
                        htmlFor="direccion"
                        >
                        <span>{nombre}</span>
                        </label>
                    </div>

                    <div className="input-group flex-nowrap my-2">
                        <span className="input-group-text" id="addon-wrapping">
                        Identificacion
                        </span>
                        <label
                        className="form-control form-control-disabled"
                        htmlFor="direccion"
                        >
                        <span>{identificacion}</span>
                        </label>

                        <span className="input-group-text" id="addon-wrapping">
                        Mi dinero
                        </span>
                        <label
                        className="form-control form-control-disabled"
                        htmlFor="direccion"
                        >
                        <span>{monto}</span>
                        </label>
                    </div>

                    </div>
                </div>
                <div className="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                    <form autoComplete='off'>

                    <div className="selected-image text-center w-100 mb-3">
                    {imgSelecc ? <img className='w-50' src={imgSelecc} alt="Imagen seleccionada" /> : <p>No se ha seleccionado ninguna imagen</p>}
                    </div>

                    <div className="form-group mb-3">
                        <div className="custom-input-file col-md-6 col-sm-6 col-xs-6">
                        <input type="file" id="fichero-tarifas" className="input-file" name='imgPublicacion' onChange={handleImageChange}></input>
                        Seleccione una Imagen de Perfil...
                        </div>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput" placeholder="Nombre Completo" value={nombreAc} onChange={(e)=> setNombreAC(e.target.value)}></input>
                        <label htmlFor="floatingInput">Nombre Completo</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput" placeholder="Usuario" value={usuarioAc} onChange={(e)=> setUsuarioAC(e.target.value)}></input>
                        <label htmlFor="floatingInput">Usuario</label>
                    </div>

                    <button type="button" className="btn btn-primary btn-block mb-3 mt-3 d-flex mx-auto" onClick={()=>actualizarUsuario()}>Actualizar</button>
                    </form>
                </div>
                </div>
                </div>
                </div>
            </div>
            </div>
            </div>
        </>
    );
}

export default NavbarUsuarios;
