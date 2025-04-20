export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="loading-spinner">
        <div className="loading-spinner-inner"></div>
      </div>
      <div className="loading-text text-xl mt-6">იტვირთება...</div>
    </div>
  )
}
