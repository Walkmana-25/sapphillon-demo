import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';


function SearchView() {
    
    const [searchParams] = useSearchParams();
    const searchParam = searchParams.get('q');
    
    // searchParamがあるか確認する。
    // なければ、/にリダイレクトする。
    useEffect(() => {
        if (!searchParam) {
            window.location.href = '/?err=No search query provided.';
        }
    }, [searchParam]);
    
    return (
        <>
            <h1>test</h1>
            <p>{searchParam}</p>
        </>
    )
    
}

export default SearchView;