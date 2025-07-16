import axios from 'axios'

const API_KEY = '51155071-1f17bfc3aafbf1a3f381682a2'

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`

const formatUrl = (params: any) => {
    let url = apiUrl + '&per_page=25&safesearch=true&editors_choice=true'
    if (!params) return url;
    let paramKeys = Object.keys(params)
    paramKeys.map(key => {
        let value = key == 'q' ? encodeURIComponent(params[key]) : params[key]
        url += `&${key}=${value}`
    });
    return url
}

export const getImages = async (params: any) => {
    try {
        const response = await axios.get(formatUrl(params))
        const { data } = response
        return { success: true, data }
    } catch (error) {
        console.log(error)
    }
}