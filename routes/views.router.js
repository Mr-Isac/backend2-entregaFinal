import { Router } from "express";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";


const router = Router();



router.get("/products", async (req, res) => {

    try {

        const {
            limit = 10,
            page = 1,
            sort,
            query
        } = req.query;


        let filter = {};


        if(query){

            if(query === "true" || query === "false"){

                filter.status = query === "true";

            }else{

                filter.category = query;

            }

        }



        let options = {

            limit: Number(limit),

            page: Number(page),

            lean: true

        };


        if(sort){

            options.sort = {

                price:
                    sort === "asc"
                    ? 1
                    : -1

            };

        }



        const result = await Product.paginate(
            filter,
            options
        );



        res.render("products", {

            products: result.docs,

            totalPages: result.totalPages,

            page: result.page,

            hasPrevPage: result.hasPrevPage,

            hasNextPage: result.hasNextPage,

            prevLink:
                result.hasPrevPage
                ? `/products?page=${result.prevPage}`
                : null,


            nextLink:
                result.hasNextPage
                ? `/products?page=${result.nextPage}`
                : null

        });


    } catch(error){

        res.status(500).send(error.message);

    }

});





router.get("/carts/:cid", async(req,res)=>{

    try{


        const cart = await Cart.findById(
            req.params.cid
        )
        .populate(
            "products.product"
        )
        .lean();



        res.render("cart",{

            products: cart.products

        });



    }catch(error){

        res.status(500).send(error.message);

    }


});



export default router;