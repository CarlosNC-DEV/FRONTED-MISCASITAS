import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.css'
import '../components/components.css'

const ModalLoginUsuarios = () => {

    const URL_REG = "http://localhost:3000/usuarios"
    const URL = "http://localhost:3000/auch/usuarios"

    const [imgSeleccImg, setSeleccImg] = useState(null);
    const [imgPerfil, setImgPerfil] = useState(null);
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState();
    const [numidentidicacion, setNumidentidicacion] = useState();
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');

    const registrarUsuario = async()=>{
        try {
            const formData = new FormData();
            formData.append('fotoPerfil', imgPerfil);
            formData.append('nombreCompleto', nombre);
            formData.append('fechaNacimiento', fechaNacimiento);
            formData.append('numeroIdentificacion', numidentidicacion);
            formData.append('usuario', usuario);
            formData.append('contrasena', contrasena);

            const loading = Swal.fire({
                title: 'Registrando Usuario',
                text: 'Espere un momento por favor...',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                Swal.showLoading();
                },
            });

            await axios.post(URL_REG, formData);
            
            // Cierra la alerta de espera
            loading.close();

            Swal.fire({
            icon: 'success',
            title: 'Registrado correctamente',
            showConfirmButton: false,
            timer: 1500}).then(()=>{
                window.location.href = '/'
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
    

    const auchUsuario = async()=>{
        try {
            const respuesta = await axios.post(URL, { usuario: usuario, contrasena: contrasena });
            if(respuesta.status && respuesta.data){

                localStorage.setItem("JWT_USUARIO", respuesta.data);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio Sesión Exitoso',
                    text: '¡Bienvenido!',
                    showConfirmButton: false,
                    timer: 1500}).then(()=>{
                        window.location.href = '/usuarios'
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

    const handleImageChange = (e) => {
        setImgPerfil(e.target.files[0]);
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          setSeleccImg(reader.result);
        };
        reader.readAsDataURL(file);
      };
    
      
    
    return (
        <>
            <div className="modal fade" id="usuariosModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Login Usuarios</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a className="nav-link active" id="tab-login" data-bs-toggle="pill" href="#pills-login" role="tab" aria-controls="pills-login" aria-selected="true">Login</a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a className="nav-link" id="tab-register" data-bs-toggle="pill" href="#pills-register" role="tab" aria-controls="pills-register" aria-selected="false">Register</a>
                    </li>
                </ul>

                <div className="tab-content">
                <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                    <form>

                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput" placeholder="Usuario" value={usuario} onChange={(e)=> setUsuario(e.target.value)}></input>
                        <label for="floatingInput">Usuario</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Contraseña" value={contrasena} onChange={(e)=> setContrasena(e.target.value)}></input>
                        <label for="floatingPassword">Contraseña</label>
                    </div>

                    <button type='button' className="btn btn-primary mb-4 mt-3 d-flex mx-auto" onClick={()=> auchUsuario()}>Iniciar sesion</button>

                    </form>
                </div>
                <div className="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                    <form autoComplete='off'>

                    <div className="selected-image text-center w-100 mb-3">
                    {imgSeleccImg ? <img className='w-50' src={imgSeleccImg} alt="Imagen seleccionada" /> : <p>No se ha seleccionado ninguna imagen</p>}
                    </div>

                    <div className="form-group mb-3">
                        <div className="custom-input-file col-md-6 col-sm-6 col-xs-6">
                        <input type="file" id="fichero-tarifas" className="input-file" name='imgPublicacion' onChange={handleImageChange}></input>
                        Seleccione una Imagen de Perfil...
                        </div>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput" placeholder="Nombre Completo" value={nombre} onChange={(e)=> setNombre(e.target.value)}></input>
                        <label for="floatingInput">Nombre Completo</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="date" className="form-control" id="floatingInput" placeholder="Fecha Nacimiento" value={fechaNacimiento} onChange={(e)=> setFechaNacimiento(e.target.value)}></input>
                        <label for="floatingInput">Fecha Nacimiento</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="number" className="form-control" id="floatingInput" placeholder="Número Documento" value={numidentidicacion} onChange={(e)=> setNumidentidicacion(e.target.value)}></input>
                        <label for="floatingInput">Número Documento</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput" placeholder="Usuario" value={usuario} onChange={(e)=> setUsuario(e.target.value)}></input>
                        <label for="floatingInput">Usuario</label>
                    </div>
                    
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Contraseña" value={contrasena} onChange={(e)=> setContrasena(e.target.value)}></input>
                        <label for="floatingPassword">Contraseña</label>
                    </div>

                    <button type="button" className="btn btn-primary btn-block mb-3 mt-3 d-flex mx-auto" onClick={()=> registrarUsuario()}>Registrate</button>
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

export default ModalLoginUsuarios;
