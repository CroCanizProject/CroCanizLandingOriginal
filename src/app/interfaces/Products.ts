export interface Products {
    data: ProductInfo[]
    Message: string
  }
  
  export interface ProductInfo {
    id: number
    name: string
    description: string
    stock: number
    price: number
    supplier: Supplier
    category: Category
    image: Image
  }
  
  export interface Supplier {
    id: number
    nameSupplier: string
    rfc: string
  }
  
  export interface Category {
    id: number
    name: string
    description: string
  }
  
  export interface Image {
    url: string
  }
  