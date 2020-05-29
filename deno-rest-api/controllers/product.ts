import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Product, ReqResHandler, ReqBody } from "../types.ts";

let products: Product[] = [
  {
    id: "1",
    name: "Product One",
    description: "This is product one",
    price: 29.99,
  },
  {
    id: "2",
    name: "Product Two",
    description: "This is product two",
    price: 39.99,
  },
  {
    id: "3",
    name: "Product Three",
    description: "This is product three",
    price: 25.99,
  },
];

// @desc   Get All Products
// @route  GET /api/v1/products
const getProducts = ({ response }: ReqResHandler) => {
  response.body = {
    sucess: true,
    data: products,
  };
};

// @desc   Get single Product
// @route  GET /api/v1/products/:id
const getProduct = ({ params, response }: ReqResHandler) => {
  const product: Product | undefined = products.find((product: Product) =>
    params && params.id && product.id === params.id
  );
  if (product) {
    response.body = {
      sucess: true,
      data: product,
    };
  } else {
    response.status = 404;
    response.body = {
      sucess: false,
      msg: "No product found",
    };
  }
};

// @desc   Add single Product
// @route  POST /api/v1/products
const addProduct = async ({ request, response }: ReqResHandler) => {
  const body: ReqBody = await request.body();
  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      sucess: false,
      msg: "Missing Body",
    };
  } else {
    const product: Product = body.value;
    product.id = v4.generate();
    products.push(product);
    response.status = 201;
    response.body = {
      sucess: true,
      msg: "Product added succefully",
      data: product,
    };
  }
};

// @desc   Update single Product
// @route  PUT /api/v1/products/:id
const updateProduct = async ({ request, params, response }: ReqResHandler) => {
  const product: Product | undefined = products.find((prod: Product) =>
    params && params.id && prod.id === params.id
  );
  if (product) {
    const body: ReqBody = await request.body();
    const updatedProduct: Product = body.value;
    console.log("updatedProduct", updatedProduct);
    if (request.hasBody) {
      products = products.map((prod: Product) =>
        params && params.id && prod.id === params.id
          ? { ...prod, ...updatedProduct }
          : prod
      );
      response.body = {
        sucess: true,
        msg: "Product updated succesfully",
        data: products,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Missing Body",
      };
    }
  } else {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No product found",
    };
  }
};

// @desc   Delete single Product
// @route  DELETE /api/v1/products/:id
const deleteProduct = ({ params, response }: ReqResHandler) => {
  const product: Product | undefined = products.find((prod: Product) =>
    params && params.id && prod.id === params.id
  );
  if (product) {
    response.body = {
      sucess: true,
      msg: "Product Removed Succesfully",
      data: products.filter((prod: Product) =>
        params && params.id && params.id !== prod.id
      ),
    };
  } else {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No product found",
    };
  }
};
export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
