export const fetchData = async function (endpoint, ...options) {
  try {
    const response = await fetch(endpoint, ...options)
    const data = await response.json()
    return {
      ...data,
      success: response?.status >= 200 && response?.status <= 300
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || "Something went wrong!"
    }
  }
}