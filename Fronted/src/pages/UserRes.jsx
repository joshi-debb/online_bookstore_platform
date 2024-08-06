import React, { useState, useRef, useEffect, Fragment } from "react";
import "../styles/reseñas.css";  
import "bootstrap/dist/css/bootstrap.min.css";
import PostReview from "./postReview";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const UserRes = () => {
    const [selectedImage, setSelectedImage] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
    const [Reseñas, setReseñas] = useState([]);
    const id_libro = localStorage.getItem('libroSeleccionado');
    const getReseñas = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/books/getReviews/${id_libro}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();

            if (response.ok) {
                const comentarios = result.data || [];
                setReseñas(comentarios);
                // console.log("Reseñas obtenidas:", comentarios);
            } else {
                console.error("Error al obtener reseñas:", result);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };
    getReseñas();
    return (
        <Fragment>
            <section className="home" style={{ display: 'flex', justifyContent: "center", alignItems: "center", paddingLeft: "1%", paddingRight: "1%", paddingTop: "1%", paddingBottom: "1%", width: "160%"}}>
                <div style={{ width: "100%", height: "100%", backgroundColor: "#0d0c1b", justifyContent: "center", overflowY: "auto", borderRadius: "25px" }}>
                <h2>Reseñas</h2>
                    <div className="profile-form" style={{ textAlign: "left", height: "100%", backgroundColor: "#A2C9FF"/*  #6CDCE0 */ }}>
                        <div className="container-resena-user">
                            <div className="resena-user">
                                {Reseñas && Reseñas.map((Reseña, index) => (
                                    <div className='card-resena' key={index}>
                                        <div style={{ overflowX: "auto", display: "flex", alignItems: "center", marginBottom: "1%", flexDirection: "column" }}>
                                            <div className='card-comment-user'>
                                                <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", overflow: "hidden" }}>
                                                    {selectedImage && <img src={selectedImage} alt="Selected" style={{ objectFit: 'cover', borderRadius: "50%", width: '100%', height: '100%' }} />}
                                                </div>
                                                <div className='card-resena-username' style={{ maxHeight: "8vh", overflowX: "auto", whiteSpace: "normal" }}>
                                                    <span title={Reseña.userName} style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                                                        {Reseña.userName}
                                                    </span>
                                                </div>
                                                <div className="card-resena-valoracion">
                                                <label>Valoración:</label>
                                                {[...Array(Reseña.score)].map((_, index) => (
                                                    <span key={index}>
                                                        <FontAwesomeIcon icon={faStar} />
                                                    </span>
                                                ))}
                                            </div>
                                                
                                            </div>
                                            
                                            <div className='card-resena-text' style={{ overflowX: "auto", whiteSpace: "normal" }}>
                                                <span style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                                                    {Reseña.comment}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: "5px" }}>
                                <PostReview getReseñas={getReseñas} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default UserRes;