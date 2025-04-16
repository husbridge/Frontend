
const EmptyState = ({text}: {text: string}) => {
  return (
      <div className="bg-white-100 rounded-lg py-4 w-full ">
          <div className="grid place-items-center h-48"> 
              <p className="text-md font-medium">{text}</p> 
          </div>
      </div>
  )
}

export default EmptyState