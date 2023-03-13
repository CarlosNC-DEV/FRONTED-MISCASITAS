import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Contexto } from '../context/contexto';

const NavbarAdmin = () => {

    const { cerrarSesionAdmin, usuarioAdmin, correoAdmin, montoAdmin } = useContext(Contexto)

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
                            <Link className="nav-link active" aria-current="page" to={"/administrador"}>Casas</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <a className="nav-link active" href="#">Opciones 🠗</a>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#adminPerfilModal">Ver mi perfil</a></li>
                                <li><a className="dropdown-item" href="#" onClick={()=> cerrarSesionAdmin()}>Cerrar sesión</a></li>
                            </ul>
                        </li>
                </ul>
                </div>
            </div>
            </nav>

            <div>
            <div className="modal fade" id="adminPerfilModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Datos Administrador {usuarioAdmin}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">

                <div className="tab-content">
                <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                    <div>

                    <div className="input-group flex-nowrap my-2">
                        <span className="input-group-text" id="addon-wrapping">
                        Admin
                        </span>
                        <label
                        className="form-control form-control-disabled"
                        htmlFor="direccion"
                        >
                        <span>{usuarioAdmin}</span>
                        </label>
                    </div>

                    <div className="input-group flex-nowrap my-2">
                        <span className="input-group-text" id="addon-wrapping">
                        Correo Electronico 
                        </span>
                        <label
                        className="form-control form-control-disabled"
                        htmlFor="direccion"
                        >
                        <span>{correoAdmin}</span>
                        </label>
                    </div>

                    <div className="input-group flex-nowrap my-2">
                        <span className="input-group-text" id="addon-wrapping">
                        Monto Acumalo 
                        </span>
                        <label
                        className="form-control form-control-disabled"
                        htmlFor="direccion"
                        >
                        <span>{montoAdmin}</span>
                        </label>
                    </div>
                    </div>
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

export default NavbarAdmin;
