import {$authHost, $host} from "./index";

export const createType = async (type) => {
    const {data} = await $authHost.post("/api/type", type)
    return data
}

export const fetchType = async () => {
    const {data} = await $host.get("/api/type")
    return data
}

export const deleteType = async (id) => {
    const {data} = await $authHost.delete(`/api/type/${id}`)
    return data
}

export const createBrand = async (brand) => {
    const {data} = await $authHost.post("/api/brand", brand)
    return data
}

export const fetchBrand = async () => {
    const {data} = await $host.get("/api/brand")
    return data
}

export const deleteBrand = async (id) => {
    const {data} = await $authHost.delete(`/api/brand/${id}`)
    return data
}

export const createDevice = async (brand) => {
    const {data} = await $authHost.post("/api/device", brand)
    return data
}

export const fetchDevices = async (typeId, brandId, page, limit= 5) => {
    const {data} = await $host.get("/api/device", {params: {
            typeId, brandId, page, limit
        }})
    return data
}
export const fetchOneDevice = async (id) => {
    const {data} = await $host.get(`/api/device/${id}`)
    return data
}

export const deleteDevice = async (id) => {
    const {data} = await $authHost.delete(`/api/device/${id}`)
    return data
}