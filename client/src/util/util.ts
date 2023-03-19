const game=(selectUser:string,play2?:string) => {
  const resultGame:{ [unit: string]: string }={
    "tijera-papel":"win",
    "piedra-tijera":"win",
    "papel-piedra":"win",
  }

  
  if (!play2) {
    return "win"
  }

  if(play2 ===  selectUser){
    return "tie"
  }else{
    let key:string =`${selectUser}-${play2}`
    const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) =>obj[key];
    let result =getKeyValue(resultGame)(key)
    let win =result?result:"lose"
    return win
    
  }

}




export default game

