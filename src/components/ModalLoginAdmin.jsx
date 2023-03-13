import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.css'
import '../components/components.css'

const ModalLoginAdmin = () => {

    const URL = "http://localhost:3000/auch/administrador"

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    const auchUsuario = async()=>{
        try {
            const respuesta = await axios.post(URL, { correo: correo, contrasena: contrasena });
            if(respuesta.status && respuesta.data){

                localStorage.setItem("JWT_ADMIN", respuesta.data);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio Sesión Exitoso',
                    text: '¡Bienvenido !',
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

    return (
        <>
            <div className="modal fade" id="adminModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Login Administrador</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">

                <div className="tab-content">
                <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                    <form>

                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" id="floatingInput" placeholder="Correo Electronico" value={correo} onChange={(e)=> setCorreo(e.target.value)}></input>
                        <label for="floatingInput">Correo Electronico</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Contraseña" value={contrasena} onChange={(e)=> setContrasena(e.target.value)}></input>
                        <label for="floatingPassword">Contraseña</label>
                    </div>

                    <button type='button' className="btn btn-primary mb-4 mt-3 d-flex mx-auto" onClick={()=> auchUsuario()}>Iniciar sesion</button>

                    </form>
                </div>
                </div>
                </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default ModalLoginAdmin;
