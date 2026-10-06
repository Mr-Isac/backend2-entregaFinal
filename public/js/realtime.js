const socket = io();

const productForm = document.getElementById("productForm");
const deleteForm = document.getElementById("deleteForm");
const productList = document.getElementById("productList");

productForm.addEventListener("submit", (e) => {

    e.preventDefault();

    socket.emit("newProduct", {

        title: title.value,
        description: description.value,
        code: code.value,
        price: Number(price.value),
        status: true,
        stock: Number(stock.value),
        category: category.value,
        thumbnails: []

    });

    productForm.reset();

});

deleteForm.addEventListener("submit", (e)=>{

    e.preventDefault();

    socket.emit("deleteProduct", deleteId.value);

    deleteForm.reset();

});

socket.on("updateProducts",(products)=>{

    productList.innerHTML="";

    products.forEach(product=>{

        productList.innerHTML+=`
        <li>
            ${product.id} - ${product.title} - $${product.price}
        </li>
        `;

    });

});