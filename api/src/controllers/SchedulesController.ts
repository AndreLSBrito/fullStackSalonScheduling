import { NextFunction, Request, Response } from "express";
import { SchedulesService } from "../services/SchedulesService";

export class SchedulesController{
  private schedulesService: SchedulesService
  constructor(){
    this.schedulesService = new SchedulesService()
  }
  async store(request: Request, response:Response, next:NextFunction){
    const { name, phone, date} = request.body
    try {
      const result = await this.schedulesService.create({name, phone, date})

      return response.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
}