import { useSearchParams } from 'react-router-dom';


function SearchView() {
    
    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get('q');
    console.log(searchParam);
    
    return (
        <>
            <h1>test</h1>
        </>
    )
    
}

export default SearchView;