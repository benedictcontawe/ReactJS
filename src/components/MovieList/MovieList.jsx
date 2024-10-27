import React, { useEffect, useState } from 'react'
import lodash, { sortBy } from 'lodash'
import './MovieList.css';
import MovieCard from './MovieCard';
import FilterGroup from './FilterGroup';

const MovieList = ({ type, title, emoji }) => {
    const [movies, setMovies] = useState([])
    const [filterMovies, setFilterMovies] = useState([])
    const [minRating, setMinRating] = useState(0);
    const [sort, setSort] = useState({
        by: "default",
        order: "asc",
    })
    useEffect(() => {
        fetchMovies();
        /*
        fetch("https://api.themoviedb.org/3/movie/popular?api_key=5ef08969bb9d474b93cd5e3a4dcae610")
        .then(response => response.json())
        .then((data) => console.log("MovieList", "data", data));
        */
    }, [
        
    ])
    useEffect(() => {
        console.log("MovieList", "Sort", sort);
        if(sort.by !== "default") {
            const sortedMovies = lodash.orderBy(filterMovies, [sort.by], [sort.order])
            /*
            const sortedMovies = filterMovies.sort((a, b) => {
                if (sort.by === "release_date") {
                    return sort.order === "asc" 
                        ? new Date(a[sort.by] - new Date(b[sort.by]))
                        : new Date(b[sort.by] - new Date(a[sort.by]));
                } else {
                    return sort.order === "asc" 
                    ? a[sort.by] - b[sort.by]
                    : b[sort.by] - a[sort.by];
                }
            })
            */
            setFilterMovies(sortedMovies)
        }
    }, [sort])
    const fetchMovies = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=5ef08969bb9d474b93cd5e3a4dcae610`)
        console.log("MovieList", "fetchMovies", "response", response)
        const data = await response.json()
        console.log("MovieList", "fetchMovies", "data", data)
        setMovies(data.results)
        setFilterMovies(data.results)
    }
    const handleFilter = rate => {
        if (rate === minRating) {
            setMinRating(0)
            setFilterMovies(movies)
        } else {
            setMinRating(rate)
            const filtered = movies.filter(movie => movie.vote_average >= rate)
            setFilterMovies(filtered)
        }
    }
    const handleSort = event => {
        const{name , value} = event.target;
        setSort(prev => ({...prev, [name]: value}))
        /*
        setSort( prev => {
            return {...prev, [name]: value}
        })
        */
    }
    
  return (
    <section className='movie_list' id={type} >
        <header className='align_center movie_list_header'>
            <h2 className='align_center movie_list_heading'>
                {title} {" "}
                <img src={emoji} alt={`${emoji} icon`} className='navbar_emoji' />
            </h2>
            <div className='align_center movie_list_fs' >
                <FilterGroup minRating={minRating} onRatingClick={handleFilter} ratings={[8, 7, 6]} />
                <select name="by" id="" onChange={handleSort} value={sort.by} className="movie_sorting">
                    <option value="default">SortBy</option>
                    <option value="release_date">Date</option>
                    <option value="vote_average">Rating</option>
                </select>
                <select name="order" id="" onChange={handleSort} value={sort.order} className="movie_sorting">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
        </header>
        <div className='movie_cards'>
            {
                filterMovies.map (movie => <MovieCard key={movie.id} movie={movie} />)
            }
        </div>
    </section>
  )
}

export default MovieList