

const Pagination = ({ page, setPage, hasNextpage }) => {
    return (
        <div className="flex items-center justify-center space-x-4 mt-4">
           
            <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md font-semibold transition-colors ${page === 1
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
            >
                Prev
            </button>

          
            <span className="text-gray-700 font-medium">
                Page {page}
            </span>

          
            <button
                onClick={() => setPage(page + 1)}
                disabled={!hasNextpage}
                className={`px-4 py-2 rounded-md font-semibold transition-colors ${!hasNextpage
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
