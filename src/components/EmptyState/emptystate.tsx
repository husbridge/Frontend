
const EmptyState = ({text}: {text: string}) => {
  return (
      <div className="bg-white-100 rounded-lg py-4 w-full px-4 text-center">
          <div className="grid place-items-center min-h-48">
              <p className="text-md font-medium">{text}</p>
          </div>
      </div>
  )
}

export default EmptyState