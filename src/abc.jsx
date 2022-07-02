import React, { useContext, useState, useEffect } from "react";
import useFetch from "./useFetch";

// const API_URL = `http://www.omdbapi.com/?apikey={process.env.REACT_APP_API_KEY}&s=spider`;
export const API_URL = `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}`;

const AppContext = React.createContext();

//context (warehouse)
/*Provider[<AppProvider>] (delivery) -: we wrapp <App /> inside <AppProvider></AppProvider> inside index.js 
now koi bhi component data access kar sakta hai*/
//consumer / (useContext(you))

// we are getting the children and that is app component in our case
/*context kay inside koi component show nahi kar rahay hai, it's like werehouse jaha par data rakha huwa hai jiso need hai 
wo waha se data lay sakta hai, That's why context name not start with uppercase */
const AppProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [movie, setMovie] = useState([]);
    const { isError, setIsError } = useFetch({ show: "false", msg: "" });
    const [query, setQuery] = useState("hacker");

    const getMovies = async url => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log('response data',data);

            if (data.Response === "True") {
                setIsLoading(false);
                setMovie(data.Search);
                setIsError({
                    show: false,
                    msg: null
                });
            } else {
                setIsError({
                    show: true,
                    msg: data.Error
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        let timerOut = setTimeout(() => {
            getMovies(`${API_URL}&S=${query}`);
        }, 1000);

        return () => clearTimeout(timerOut);
    }, [query]);

    return (
        <AppContext.Provider value={{ query, movie, setQuery, isLoading, isError }}>
            {children}
        </AppContext.Provider>
    );
};

const useGlobalContext = () => {
    return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };
