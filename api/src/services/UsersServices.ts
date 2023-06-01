import { compare, hash } from "bcrypt"
import { ICreate, IUpdate } from "../interfaces/UsersInterface"
import { UsersRepository } from "../repositories/UsersRepository"
import { s3 } from "../config/aws"
import {v4 as uuid} from 'uuid'
import { sign } from "jsonwebtoken"



export class UsersServices{
  private usersRepository: UsersRepository

  constructor(){
    this.usersRepository = new UsersRepository
  }
  async create({name, email, password}:ICreate){
    const findUser = await this.usersRepository.findUserByEmail(email)
    if(findUser){
      throw new Error('User exists')
    }
    const hashPassword = await hash(password, 10)
    const create = await this.usersRepository.create({
      name, 
      email, 
      password : hashPassword
    })
    return create
  }
  async update({name, oldPassword, newPassord, avatar_url, user_id}:IUpdate){
    let password
    if(oldPassword && newPassord){
      const findUserById = await this.usersRepository.findUserById(user_id)
      if(!findUserById){
        throw new Error('User not found')
      }
      const passwordMatch = await compare(oldPassword, findUserById.password)

      if(!passwordMatch){
        throw new Error('Password invalid.')
      }
      password = await hash(newPassord, 10)

      await this.usersRepository.updatePassword(password, user_id)
    }
    if(avatar_url){
      const uploadImage = avatar_url?.buffer;
      const uploadS3 = await s3.upload({
        Bucket: 'full-stack-salon-scheduler',
        Key: `${uuid()}-${avatar_url?.originalname}`,
        Body: uploadImage,
      }).promise()

      await this.usersRepository.update(name, uploadS3.Location, user_id)
    }

    return {
      message:"User updated successfully"
    }
  }
  async auth(email:string, password:string){
    const findUser= await this.usersRepository.findUserByEmail(email)
    if(!findUser){
      throw new Error('User or password invalid.')
    }
    const passwordMatch = await compare(password, findUser.password)
    if(!passwordMatch){
      throw new Error('User or password invalid.')
    }
    let secretKey:string | undefined = process.env.ACCESS_KEY_TOKEN
    if(!secretKey){
      throw new Error('There is no token key')
    }
    const token = sign({email},secretKey , {
      subject: findUser.id,
      expiresIn: 60*15
    })

    return {
      token,
      user:{
        name: findUser.name,
        email: findUser.email,
      }
    }
  }
}