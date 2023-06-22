const notificationDelay = 2000

const Error = ({ message, action }) => {
	if (message === null) {
	  return null
	}
	setTimeout(() => { action(null) }, notificationDelay)
	return (
	  <div className="error">
		{message}
	  </div>
	)
}

const Success = ({ message, action }) => {
	if (message === null) {
		return null
	}
	setTimeout(() => { action(null) }, notificationDelay)
	return (
		<div className="success">
			{message}
		</div>
	)
}

const Notification = ({ error, success, setError, setSuccess}) => {
	return (
		<>
			<Error message={error} action={setError}/>
			<Success message={success} action={setSuccess}/>
		</>
	)
}

export default Notification