import {makeAutoObservable} from "mobx";
import phone from "../assets/phone.jpg"

export default class DeviceStore {
    constructor() {
        this._types = [
            {id: 1, name: "Холодильники"},
            {id: 2, name: "Смартфоны"},
            {id: 3, name: "Ноутбуки"},
            {id: 4, name: "Планшеты"},
            {id: 5, name: "Теливизоры"},

        ]
        this._brands = [
            {id: 1, name: "Samsung"},
            {id: 2, name: "Apple"},
            {id: 3, name: "Lenovo"},
            {id: 4, name: "AMD"},
        ]
        this._devices = [
            {id: 1, name: "Samsung Galaxy A52", price: 30000, rating: 8, img: phone},
            {id: 2, name: "Samsung Galaxy A52", price: 30000, rating: 8, img: phone},
            {id: 3, name: "Samsung Galaxy A52", price: 30000, rating: 8, img: phone},
            {id: 4, name: "Samsung Galaxy A52", price: 30000, rating: 8, img: phone},
            {id: 5, name: "Samsung Galaxy A52", price: 30000, rating: 8, img: phone},
            {id: 6, name: "Samsung Galaxy A52", price: 30000, rating: 8, img: phone},
        ]
        this._selectedType = {}
        this._selectedBrand = {}

        makeAutoObservable(this)
    }
    setTypes(types) {
        this._types = types
    }
    setBrands(brands) {
        this._brands = brands
    }
    setDevices(devices) {
        this._devices = devices
    }
    setSelectedType(type) {
        this._selectedType = type
    }
    setSelectedBrand(brand) {
        this._selectedBrand = brand
    }

    get types() {
        return this._types
    }
    get brands() {
        return this._brands
    }
    get devices() {
        return this._devices
    }
    get selectedType() {
        return this._selectedType
    }
    get selectedBrand() {
        return this._selectedBrand
    }
}