import React from 'react';
import "../local/Page.css";

function Page({ totalItems, itemsPerPage, currentPage, onPageChange, range = 10 }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startPage = Math.max(1, currentPage - Math.floor(range / 2));
    const endPage = Math.min(totalPages, startPage + range - 1);

    const pageNumbers = Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
    );

    const canGoBack = currentPage > 1;
    const canGoForward = currentPage < totalPages;

    return (
        <div className="pagination-buttons">
            {canGoBack && (
                <button onClick={() => onPageChange(currentPage - 1)}>이전</button>
            )}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={currentPage === page}
                    className={currentPage === page ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
            {canGoForward && (
                <button onClick={() => onPageChange(currentPage + 1)}>다음</button>
            )}
        </div>
    );
}

export default Page;