import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import rocket from '../../assets/rocket.png';
import star from '../../assets/glowing-star.png';
import idButton from '../../assets/id-button.png';
import memo from '../../assets/memo.png';
import order from '../../assets/package.png';
import lock from '../../assets/locked.png';
import LinkWithIcon from './LinkWithIcon';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import CartContext from '../../contexts/CartContext';
import { getSuggestionsAPI } from '../../Network/productServices';

const Navbar = () => {
  const [search, setSearch] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const navigate = useNavigate()
  const user = useContext(UserContext)
  const { cart } = useContext(CartContext)
  const handleSubmit = (event) => {
    console.log("NavBar", "handleSubmit");
    event.preventDefault()
    if(search.trim() !== "") {
      navigate(`/products?search=${search.trim()}`)
    }
    setSuggestions([])
  }
  const onHandleKeyDown = (event) => {
    console.log("NavBar", "onHandleKeyDown", event.key);
    if(selectedSuggestion < suggestions.length && event.key === "ArrowDown") {
      setSelectedSuggestion( currentIndex => 
        currentIndex === suggestions.length - 1 ? 0 : currentIndex + 1
      )
    } else if(selectedSuggestion < suggestions.length && event.key === "ArrowUp") {
      setSelectedSuggestion( currentIndex => 
        currentIndex === 0 ? suggestions.length - 1 : currentIndex - 1
      )
    } else if(event.key === "Enter"  && selectedSuggestion > -1) {
      const suggestion = suggestions[selectedSuggestion]
      navigate(`/products?search=${suggestion.title}`)
      setSearch("")
      setSuggestions([])
    } else {
      setSelectedSuggestion(-1);
    }
  }
  useEffect(() => {
    const delaySugestions = setTimeout(() => {
      if(search.trim() !== "") {
        getSuggestionsAPI(search)
        .then(response => setSuggestions(response.data))
        .catch(error => console.log("NavBar", "getSuggestionsAPI", error, search))
      } else if (search.trim() === "") {
        setSuggestions([])
      }
    }, 300);
    return () => clearTimeout(delaySugestions);
  }, [search])
  console.log("NavBar", suggestions)
  return (
    <nav className='align_center navbar'>
        <div className='align_center'>
            <h1 className='navbar_heading'>CarWish</h1>
            <form className='align_center navbar_form' onSubmit={handleSubmit} >
                <input 
                  type='text' 
                  className='navbar_search' 
                  placeholder='Search Products' 
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  onKeyDown={onHandleKeyDown} />
                <button type='submit' className='search_button' >Search</button>
                { suggestions.length > 0 &&
                <ul className="search_result">
                  { suggestions.map((suggestion, index) => 
                    <li 
                      className={selectedSuggestion === index ? "search_suggestion_link active" : 'search_suggestion_link' }
                      key={suggestion._id} >
                      <Link 
                        to={`/products?search=${suggestion.title}`} 
                        onClick={() => { 
                          setSearch("");
                          setSuggestions([])
                        }} >
                          {suggestion.title}
                      </Link>
                    </li>
                  ) }
                </ul> 
                }
            </form>
        </div>
        <div className='align_center navbar_links'>
            <LinkWithIcon title="Home" link="/" emoji={rocket}/>
            <LinkWithIcon title="Products" link="/products" emoji={star}/>
            { !user &&
              <React.Fragment>
              <LinkWithIcon title="LogIn" link="/login" emoji={idButton}/>
              <LinkWithIcon title="SignUp" link="/signup" emoji={memo}/>
              </React.Fragment>
            }
            { user &&
              <React.Fragment>
              <LinkWithIcon title="My Orders" link="/myorders" emoji={order}/>
              <LinkWithIcon title="Logout" link="/logout" emoji={lock}/>
              <NavLink to="/cart" className='align_center'>
                Cart <p className="align_center cart_counts">{cart.length}</p>
              </NavLink>
              </React.Fragment>
            }
        </div>
    </nav>
  )
}

export default Navbar