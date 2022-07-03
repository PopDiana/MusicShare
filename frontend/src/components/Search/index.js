import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './styles.css';

const Search = () => {
    
    const songs = useSelector(state => Object.values(state.songs));
    const [search, setSearch] = useState('');
    const [results, setResults] = useState('');

    const filtered = songs.filter(song => {
        return song.User?.username?.toLowerCase().includes(search.toLowerCase())
         || song.title.toLowerCase().includes(search.toLowerCase()) 
         || song.Genre?.name.toLowerCase().includes(search.toLowerCase());
    });

    const searchList = (
        filtered.map(song => {
            return (
                <Link key={song.id} className='search-result' to={{pathname: `/songs/${song.id}`}} onClick={() => setSearch('')}>
                    <div>
                        <p>{song.title}</p>
                        <p>{song.User?.username}</p>
                    </div>
                </Link>
            )
        })
    );

    return (
        <div className='search-container'>
            <form className='app-search-form'>
                <div>
                    <input type='text' placeholder='Search for a song, artist or genre...' 
                    value={search} onClick={() => setResults('results')} onBlur={() => setResults('')} onChange={(e) => setSearch(e.target.value)}/>
                    <i className="fas fa-search search-button"></i>
                </div>
            </form>
            <div className={`search-results-container ${results}`}>
                {searchList}
            </div>
        </div>
    );
};

export default Search;
