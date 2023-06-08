import style from './login.module.css'
import logo from '../../assets/logo.webp'
import { Input } from '../../components/Input/Index'
import { useForm} from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '../../components/Button/Index'
import {Link} from 'react-router-dom'
import {AiOutlineMail} from 'react-icons/ai'
import {BsKey} from 'react-icons/bs'
import { useAuth } from '../../hooks/auth'

interface IFormValues {
  email: string;
  password: string;
}

export function Login(){
  const {signIn } = useAuth()
  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Digite um email válido')
      .required('Campo de email obrigatório')
    ,
    password: yup.string().required('Campo de senha obrigatório')
  })
  const {register, handleSubmit, formState:{errors}} = useForm<IFormValues>({
    resolver: yupResolver(schema)
  })
  const submit = handleSubmit(async ({email, password}) => {
    try {
      await signIn({email, password})
     
      
    } catch (error) {
      
    }
  })
  return(
    <div className={style.background}>
      <div className={`container ${style.container}`}>
        <div className={style.wrapper}>
          <div>
            <img src={logo} alt='logo'/>
          </div>
          <div className={style.card}>
            <h2>Olá, seja bem vindo</h2>
            <form onSubmit={submit}>
              <Input 
                placeholder='Email' 
                {...register('email',{required: true})}
                type='text'
                error={errors.email && errors.email.message}
                icon={<AiOutlineMail size={20} />}
              />
              <Input 
                placeholder='Senha'
                {...register('password',{required: true})}
                type='password'
                error={errors.password && errors.password.message}
                icon={<BsKey size={20} />}  
              />
              
              <Button text='Entrar'/>
            </form>
            <div className={style.register}>
             <span>Ainda não tem conta? <Link to={'/register'}> cadastre-se</Link> </span>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}