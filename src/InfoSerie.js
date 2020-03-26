import React, {useState, useEffect} from 'react';
import axios from 'axios'
import { Redirect } from 'react-router-dom';
import { Badge } from 'reactstrap'

const InfoSerie = ({match}) =>{

    const [form,setForm] = useState({
        name: ''
    })
    const [success, setSuccess] = useState(false)
    const [mode, setMode] = useState('INFO')
    const [genres, setGenres] = useState([])
    const [genereId, setGenereId] = useState('')

     const [data, setData] = useState({})
     useEffect(() => {
        axios
            .get('/api/series/' + match.params.id)
            .then(res => {
                setData(res.data)
                setForm(res.data)
            })
        //dependencia, sempre reage ao id
     }, [match.params.id])

     useEffect(() => {
        axios
        .get('/api/genres')
        .then(res => {
            //data.data pq ele vem dentro de um wrapper
            setGenres(res.data.data)
            //olha todos os gêneros e pega o id
            const genres = res.data.data
            const encontrado = genres.find(value => data.genres === value.name)
            if(encontrado){
                setGenereId(encontrado.id)
            }
        })
        //toda vez que executar o effect mudara o data
     }, [data])

    const onChange = field => evt => {
        setForm({
            //copia tudo que esta em form
            ...form,
            //desse modo pega o nome do campo e transforma na chave do array
            [field]: evt.target.value
        })
    }

    const onChangeGenre = evt => {
        setGenereId(evt.target.value);
      };

    const selectOption = value => () => {
        setForm({
            ...form,
            status: value
        })
    }


    //custom header
    const masterHeader = {
        height:'50vh',
        minHeight: '500px',
        backgroundImage: `url('${data.background}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }

    const save = () => {
        axios
            .put('/api/series/' + match.params.id, {
            ...form,
            genre_id: genereId        
            })
        .then(res => {
            setSuccess(true)
        })
    }

    if(success) {
        return <Redirect to='/series'/>
    }

    

    return(
        <div>
            <header style={masterHeader}>
                <div className="h-100" style={{background:'rgba(0,0,0,0.7)'}}>
                    <div className='h-100 container'>
                        <div className='row h-100  align-items-center'>
                            <div className='col-3'>
                                <img className='img-fluid img-thumbnail' src={data.poster} alt={data.name}/>
                            </div>
                            <div className='col-9'>
                                <h1 className='fonte-weight-light text-white'>{data.name}</h1>
                                <div className='lead text-white'>
                                    {data.status === 'ASSISTIDO' && <Badge color='success'>Assistido</Badge>}
                                    {data.status === 'PARA_ASSISTIR' && <Badge color='warning'>Para assistir</Badge>}
                                    <Badge color='info'>Gênero: {data.genre}</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container'>
                    <button onClick={() => setMode('EDIT')} className="btn btn-primary">Editar</button>
                </div>

            </header>
            {   
                //caso clique no botão editar na linha 73, habilita os campos abaixo
                mode === 'EDIT' &&
            <div className="container">
                <h1>Editar Série</h1>
                {/* <pre>{JSON.stringify(form)}</pre> */}
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Nome</label>
                        <input className="form-control" value={form.name} onChange={onChange('name')} id="name" ></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Comentarios</label>
                        <input className="form-control" value={form.comments} onChange={onChange('comments')} id="name" ></input>
                    </div>

                    <div className="form-group">
                        <label htmlFor='name'>Gênero</label>
                        <select className="form-control" onChange={onChangeGenre} value={genereId}>
                          {genres.map(genre => <option key={genre.id} value={genre.id}> {genre.name} </option>)}  
                        </select>
                    </div>

                    <div className='form-check'>
                        <input className='form-check-input' type='radio' checked={form.status === 'ASSISTIDO'} name='status' id='assistido' value='ASSISTIDO' onChange={selectOption('ASSISTIDO')}/>
                        <label className='form-check-label' htmlFor='assistido'>
                            Assistido
                        </label>
                        </div>
                        <div className='form-check'>
                        <input className='form-check-input' type='radio' checked={form.status === 'PARA_ASSISTIR'} name='status' id='paraAssistir' value='PARA_ASSISTIR' onChange={selectOption('PARA_ASSISTIR')}/>
                        <label className='form-check-label' htmlFor='paraAssistir'>
                            Para assistir
                        </label>
                    </div>

                    <button type="button" onClick={save} className="btn btn-primary">Salvar</button>
                    <button type="button" onClick={() => setMode('INFO')} className="btn btn-danger" style={{marginLeft:'10px'}}>Cancelar Edição</button>
                </form>
            </div>
            }
        </div>
    )
}

export default InfoSerie