'use client'
import {createContext, useContext, useEffect, useState} from 'react';
import { getFilteredExperts } from '@/lib/experts_fetch';

const ValuesContext = createContext();

function filterUnique(arr){
    return [...new Set(arr)];
}

export const ValuesProvider = ({children}) =>{
    const [values,setValues] = useState({
      expertise_categories:[],
      languages:[],
      cities:[],
    })

    const fetchValues = async () => {
        try{
            const data = await getFilteredExperts();
            const cities = filterUnique(data.map((expert) => expert.city));
            const expertise_categories = filterUnique([].concat(...data.map((expert)=>expert.specializations)))
            const languages = filterUnique([].concat(...data.map((expert)=>expert.languages)))
            setValues({
                ...values,
                expertise_categories,
                languages,
                cities,
            })
        }
        catch(err){
            console.error("Failed to fetch values:", err);
        }
    }
        
    useEffect(()=>{
        fetchValues();
    },[])

    return (
        <ValuesContext.Provider value={{values}}>
            {children}
        </ValuesContext.Provider>
    )
}


export const useValues = () => {
    return useContext(ValuesContext);
}
