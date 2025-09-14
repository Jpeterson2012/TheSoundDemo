import {useEffect} from 'react';
import { useNavigate } from "react-router-dom"
import Loading from '../components/Loading/Loading';

export default function LoadingPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDone = async () => {
            try {
                var temp = await fetch(import.meta.env.VITE_URL + "/callback/emit", {credentials: "include"})
                    .then((res) => {                        
                        return res.json();
                    })
                    .then(data => {
                        console.log(data)
                    })
                return temp
            }
            catch (err) {
                console.log(`Login error occured: ${err}`)
            }
        }

        const dataDone = async () => {
            await fetchDone()            
            navigate('/app', {replace: true})
        }

        dataDone()
    },[])

    return <Loading />
}
