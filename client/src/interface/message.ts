export interface msg {
  messages:{
  message: string
    to: string
    id:string
    key:number
  }
  sendMessage:(value:string) => void
}


