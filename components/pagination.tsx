"use client"

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  // გვერდების მასივის შექმნა
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5 // მაქსიმალური რაოდენობა გვერდების, რომლებიც ერთდროულად ჩანს

    if (totalPages <= maxVisiblePages) {
      // თუ გვერდების რაოდენობა ნაკლებია ან ტოლია maxVisiblePages-ზე, ყველა გვერდი გამოჩნდება
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // თუ მიმდინარე გვერდი ახლოსაა დასაწყისთან
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push(-1) // ელიფსისი
        pages.push(totalPages)
      }
      // თუ მიმდინარე გვერდი ახლოსაა ბოლოსთან
      else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push(-1) // ელიფსისი
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      }
      // თუ მიმდინარე გვერდი შუაშია
      else {
        pages.push(1)
        pages.push(-1) // ელიფსისი
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push(-2) // ელიფსისი
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* წინა გვერდის ღილაკი */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-lg ${
          currentPage === 1
            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
            : "bg-gray-800 hover:bg-gray-700 text-white"
        }`}
        aria-label="წინა გვერდი"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      {/* გვერდების ღილაკები */}
      {pageNumbers.map((pageNumber, index) => {
        // ელიფსისი
        if (pageNumber < 0) {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">
              ...
            </span>
          )
        }

        // ჩვეულებრივი გვერდის ღილაკი
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-1 rounded-lg ${
              currentPage === pageNumber
                ? "bg-neon-blue bg-opacity-30 text-white border border-neon-blue"
                : "bg-gray-800 hover:bg-gray-700 text-white"
            }`}
          >
            {pageNumber}
          </button>
        )
      })}

      {/* შემდეგი გვერდის ღილაკი */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-lg ${
          currentPage === totalPages
            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
            : "bg-gray-800 hover:bg-gray-700 text-white"
        }`}
        aria-label="შემდეგი გვერდი"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  )
}
