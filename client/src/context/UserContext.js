import { useEffect, useReducer } from "react"
import Authcontext from "./Authcontext.js"
import AuthReducer from "./AuthReducer"

const UserContext = (props)=>{
  const initialState = {
    data:JSON.parse(localStorage.getItem("user")) || null,
  }
  const [state,dispatch] = useReducer(AuthReducer,initialState)

  useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(state.data))
  },[state.data])
  

 return(
    <Authcontext.Provider value={{dispatch,
      data:state.data
    }}>
        {props.children}
    </Authcontext.Provider>
 )

}

export default UserContext;