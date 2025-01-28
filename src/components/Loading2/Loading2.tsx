import './Loading2.css'

export default function Loading ({yes}: any) {
    return (
        <>
            <div className="muzieknootjes2">
                <div className="tnoot-1">
                &#9835; &#9833;
                </div>
                <div className="tnoot-2">
                &#9833;
                </div>
                <div className="tnoot-3">
                &#9839; &#9834;
                </div>
                <div className="tnoot-4">
                &#9834;
                </div>
                <div className="tnoot-5">
                &#9833; &#9835;
                </div>
                <div className="tnoot-6">
                &#9835;
                </div>
                <div className="tnoot-7">
                &#9834; &#9839;
                </div>
                <div className="tnoot-8">
                &#9839;
                </div>
            </div>
            {yes ? <h2>Preparing your experience...</h2> : null}
        </>
    )
}

// https://codepen.io/MaryG/pen/wJMMdw