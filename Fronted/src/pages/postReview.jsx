import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const PostReview = ({getReseñas}) => {
    const id_libro = localStorage.getItem('libroSeleccionado');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0); // Valoración por defecto

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleCommentSubmit = async () => {
        try {
            const comentarioData = {
                score: rating,
                comment: comment,
                userName: localStorage.getItem('nameuser'),
            };

            const response = await fetch(`http://localhost:3000/api/books/review/${id_libro}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(comentarioData),
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log(responseData);
                alert("Comentario agregado exitosamente");
                setRating(0);
                setComment('');
                getReseñas()
            } else {
                console.error(responseData);
                alert("Error al agregar el comentario");
            }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con la API");
        }
    };


    return (
        <div style={{ color: "black" }}>
            <textarea
                id="comment"
                value={comment}
                className='comentario-input'
                placeholder='Escribe aqui tu reseña.'
                onChange={handleCommentChange}
            />
            <div>
                <label>Valoración:</label>
                {[1, 2, 3, 4, 5].map((value) => (
                    <span
                        key={value}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRatingChange(value)}
                    >
                        {value <= rating ? <FontAwesomeIcon icon={solidStar} /> : <FontAwesomeIcon icon={regularStar} />}
                    </span>
                ))}
            </div>
            <button style={{ width: "100%" }} class="btn btn-primary" onClick={handleCommentSubmit}>Enviar Reseña</button>
        </div>
    );
};

export default PostReview;