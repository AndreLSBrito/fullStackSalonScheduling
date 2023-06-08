import { useForm } from "react-hook-form";
import { Header } from "../../components/Header/Index";
import { InputSchedule } from "../../components/InputSchedule/Index";
import style from './EditProfile.module.css'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { useEffect, useState } from "react";
import imageDefaut from '../../assets/do-utilizador_318-159711.avif'
import {FiEdit2} from 'react-icons/fi'
import {isAxiosError} from 'axios'
import {toast} from 'react-toastify'
import { api } from "../../server/Index";
import {useNavigate} from 'react-router-dom'

interface IFormValues{
  picture: File[];
  name: string;
  email: string;
  password: string;
  newPassword: string;
  confirmPassword: string;

}

interface IData{
  newPassword?:string;
  oldPassword?:string;
  name?:string;
  avatar_url?: File;
} 

export function EditProfile(){
  const schema = yup.object().shape({
    name: yup.string(),
    newPassword: yup.string(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), 'senha devem ser iguais']),
  })
  const {register, handleSubmit, setValue} = useForm<IFormValues>({resolver : yupResolver(schema)})
  const navigate = useNavigate()

  const [fileUpload,setFileUpload] = useState(imageDefaut)

  useEffect(()=>{
    const userStorege = localStorage.getItem('user:semana-heroi')
    const user = userStorege && JSON.parse(userStorege)

    setValue('name', user.name);
    setValue('email', user.email);
    setValue('picture', user.picture);
  },[])

  const submit = handleSubmit(async ({name,password, newPassword, picture}:IFormValues) => {
    const data:IData = {
      name,
    }
    if(password && newPassword){
      data.oldPassword = password
      data.newPassword = newPassword
    }
    if(picture){
      data.avatar_url = picture[0]
    }
    try {
      const result = await api.put('/users', data,{
        headers:{
          'Content-Type': 'multpart/form-data',
        },
      })
      toast.success('Usuário atualizado com sucesso')
      navigate('/dashboard')
    } catch (error) {
      if(isAxiosError(error)){
        toast.error(error.response?.data.message)
      }
    }
  })

  const handleImage = (files:File[])=>{
    const image = files[0]

    const imageUrl = URL.createObjectURL(image)
    setFileUpload(imageUrl)
  }
  return(
    <div className="container">
      <Header/>

      <div className={style.formDiv}>
        <form onSubmit={submit}>
          {fileUpload && (
            <div className={style.fileUpload}>
              <img src={fileUpload} alt='foto do perfil' width={'300px'}/>
              <label className={style.imgUpload}>
                <input 
                  type="file" 
                  {...register('picture', {required:true, onChange: (e)=>handleImage(e.target.files)})}
                />
                <FiEdit2 />
              </label>
            </div>
          )}
          <InputSchedule 
            placeholder="Nome"
            type="text"
            {...register('name', {required:true})}
          />
          <InputSchedule 
            placeholder="Email"
            type="text"
            {...register('email', {required:true})}
          />
          <InputSchedule 
            placeholder="Senha atual"
            type="password"
            {...register('password', {required:true})}
          />
          <InputSchedule 
            placeholder="Nova senha"
            type="password"
            {...register('newPassword', {required:true})}
          />
          <InputSchedule 
            placeholder="Confirmar nova senha"
            type="password"
            {...register('confirmPassword', {required:true})}
          />
          <div className={style.footer}>
            <button >Cancelar</button>
            <button >Editar</button>
          </div>
        </form>
      </div>
    </div>
  )
}