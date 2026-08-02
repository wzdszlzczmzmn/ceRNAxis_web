import axios from "axios"
import { API_BASE } from "@/lib/api/config"

const api = axios.create({
    baseURL: API_BASE,

    // Temporary long timeout for expression-correlation validation.
    // Reduce this after backend expression files are optimized with Parquet / cached valid pairs.
    timeout: 600000,
})

export default api
