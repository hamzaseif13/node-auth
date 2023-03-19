import React, { useEffect, useState } from "react";


interface Props {
    showModal: boolean,
    setShowModal: React.Dispatch<boolean>,
    movieId: number
}
export default function Modal({ showModal, setShowModal, movieId }: Props) {
    const [trailerURL,setURL] = useState<string>()
    window.onkeydown =(event)=>{
        if(event.key==='Escape')setShowModal(false)
    }
   
    useEffect(() => {
        const fetchMovie = async () => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${import.meta.env.VITE_API_KEY}`)
            const data = await res.json()
            setURL(data.results.find((res:any)=>res.type==='Trailer').key)
        }
        fetchMovie();
    }, [movieId])
    return (
        <>

            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-full my-6 mx-auto max-w-3xl" >
                            <div className=" rounded-lg shadow-lg relative flex flex-col w-full bg-black  outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 rounded-t">
                                    
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-white  h-6 w-6 text-4xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                { true &&
                                    <div className="w-full h-full ">

                                    <iframe width="" src={`https://www.youtube.com/embed/${trailerURL}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                                    </div>
                                
                                }
                                

                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}