import { Router } from "express";
import { SaleProduct } from "../Controllers/SallerController";
import { CreateUser } from "../Controllers/CreateUser";
import { CreateAccess } from "../Controllers/AccessController";
import { CreateStore } from "../Controllers/CreateStore";
import { CreateProducts } from "../Controllers/CreateProducts";
import { GetAllProducts } from "../Controllers/CreateProducts";
import { GetAllStore } from "../Controllers/CreateStore";
import { GetAllAccess } from "../Controllers/AccessController";
import { GetAllUsers } from "../Controllers/CreateUser";
import { GetAllSale } from "../Controllers/SallerController";
import { GetUniqueUsers } from "../Controllers/CreateUser";
import { GetUniqueByBuyer } from "../Controllers/SallerController";
import { GetUniqueBySeller } from "../Controllers/SallerController";
import { DeleteProducts } from "../Controllers/DeleteController";
import { DeleteUser } from "../Controllers/DeleteController";
import { DeleteStore } from "../Controllers/DeleteController";
import { SingIn } from "../Controllers/SessionController";
import { authMiddleware } from "../middleware/AuthMiddleware";

const sale_product = new SaleProduct()
const Create_users = new CreateUser()
const Create_access = new CreateAccess()
const Create_store = new CreateStore()
const Create_Product = new CreateProducts()
const Get_access = new GetAllAccess()
const Get_stores = new GetAllStore()
const Get_products = new GetAllProducts()
const Get_users = new GetAllUsers()
const Get_sale = new GetAllSale()
const Get_unique_sale_by_buyer = new GetUniqueByBuyer()
const Get_unique_sale_by_seller = new GetUniqueBySeller()
const Get_unique_user = new GetUniqueUsers()
const DELET_USER = new DeleteUser()
const DELET_STORE = new DeleteStore()
const DELETE_PRODUCT = new DeleteProducts()
const app = Router()





app.post('/access', Create_access.handle)
app.post('/new_user', Create_users.handle)
app.post('/new_store', authMiddleware(["vendedor"]), Create_store.handle)
app.post('/new_product/:storeId', authMiddleware(["vendedor"]), Create_Product.handle)


app.post('/sale', authMiddleware(["vendedor", "comprador"]), sale_product.handle)

app.post('/sign-in', SingIn)



app.get('/all_access', authMiddleware(["admin"]), Get_access.handle)
app.get('/stores', Get_stores.handle)
app.get('/products', authMiddleware(["admin", "vendedor"]), Get_products.handle)
app.get('/users', Get_users.handle)
app.get('/unique_user', authMiddleware(["admin", "vendedor", "comprador"]), Get_unique_user.handle)
app.get('/sale', Get_sale.handle)
app.get('/unique_sale_buyer', authMiddleware(["admin","comprador"]), Get_unique_sale_by_buyer.handle)
app.get('/unique_sale_seller', authMiddleware(["admin", "vendedor"]), Get_unique_sale_by_seller.handle)



app.delete('/bad_users', authMiddleware(["admin"]), DELET_USER.handle)
app.delete('/bad_stores', authMiddleware(["admin"]), DELET_STORE.handle)
app.delete('/bad_products', authMiddleware(["admin"]), DELETE_PRODUCT.handle)


export { app }