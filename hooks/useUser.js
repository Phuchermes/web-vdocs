import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export function useUser(){
    const context = useContext(UserContext)

    if (!context)
    {
        throw new Error("userUser must be used within a UserProvider")
    }


    return context
}
