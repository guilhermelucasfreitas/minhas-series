import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

const Generos = () => {
    const [data,setData] = useState([])
    useEffect(() => {
        axios.get('api/genres')
        .then( res => {
            setData(res.data.data)
        })
    }, [])

    const deleteGenero = id =>{
        axios
            .delete('/api/genres/' + id)
            .then(res => {
                console.log(res)
            })
    }

    const renderizaLinha = record => {
        return (
            <tr key={record.id}>
                <th scope="row">{record.id}</th>
                <td>{record.name}</td>
                <td><button onClick={() => deleteGenero(record.id)}>-</button></td>
            </tr>
        )
    }

    if(data.length === 0){
        return(
            <div className="container">
                <h1>Genêros</h1>
                <div className="alert alert-warning" role="alert">
                    Você não possui genêros criados
                </div>
            </div>
        )
    }

    return (
    <div className="container">
        <h1>Genêros</h1>
        <Link to='/generos/novo'>Novo genêro</Link>
        <table className="table table-dark">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Ação</th>
                </tr>
            </thead>
            <tbody>
                {data.map(renderizaLinha)}
            </tbody>
        </table>
    </div>
    )
}
    
    export default Generos
    