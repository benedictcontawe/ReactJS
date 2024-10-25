import React from 'react'
import './MovieList.css';
import Fire from '../../assets/fire.png'

const MovieList = () => {
  return (
    <section className='movie_list'>
        <header className='align_center movie_list_header'>
            <h2 className='align_center movie_list_heading'>
                Popular 
                <i mg src={Fire} alt='fire emoji' className='navbar_emoji' />
            </h2>
            <div className='align_center movie_list_fs' >
                <ul className="align_center  movie_filter">
                    <li className="movie_filter_item active">8+ Star</li>
                    <li className="movie_filter_item">7+ Star</li>
                    <li className="movie_filter_item">6+ Star</li>
                </ul>
                <select name="" id="" className="movie_sorting">
                    <option value="">SortBy</option>
                    <option value="">Date</option>
                    <option value="">Rating</option>
                </select>
                <select name="" id="" className="movie_sorting">
                    <option value="">Ascending</option>
                    <option value="">Descending</option>
                </select>
            </div>
        </header>
        <div className='movie_cards'>
            
        </div>
    </section>
  )
}

export default MovieList