const cartId = "6a62b7d0009eec4f4fb70fab";


const buttons = document.querySelectorAll(".addCart");


buttons.forEach(button => {

    button.addEventListener("click", async () => {


        const productId = button.dataset.id;


        await fetch(
            `/api/carts/${cartId}/product/${productId}`,
            {
                method: "POST"
            }
        );


        alert("Producto agregado al carrito");


    });


});