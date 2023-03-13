import React from 'react';
import NavbarLandig from '../components/NavbarLandig';
import ModalLoginUsuarios from '../components/ModalLoginUsuarios';
import ModalLoginAdmin from '../components/ModalLoginAdmin';

const Landing = () => {
    return (
        <>
            <NavbarLandig></NavbarLandig>
            <h1>Holaa lading</h1>
            <a className="nav-link active" href="#" data-bs-toggle="modal" data-bs-target="#adminModal">Administrador</a>
            <ModalLoginUsuarios></ModalLoginUsuarios>
            <ModalLoginAdmin></ModalLoginAdmin>
        </>
    );
}

export default Landing;
