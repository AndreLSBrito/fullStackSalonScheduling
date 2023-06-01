import { isBefore, startOfHour } from "date-fns";
import { ICreate } from "../interfaces/SchedulesInterface";
import { SchedulesRepository } from "../repositories/ServicesRepository";

export class SchedulesService{
  private schedulesRepository: SchedulesRepository
  constructor(){
    this.schedulesRepository = new SchedulesRepository()
  } 
  async create({name, phone, date}:ICreate){
   const dateFormatted = new Date(date)
   
   const hourStart = startOfHour(dateFormatted)

   if(isBefore(hourStart, new Date())){
    throw new Error('It is not allowed to schedule old date')
   }

   const checkIsAvailable = await this.schedulesRepository.find(hourStart)

   if(checkIsAvailable){
    throw new Error('Schedule date is not available')
   }
   const create = await this.schedulesRepository.create({name, phone, date: hourStart})
   return create
  }
}